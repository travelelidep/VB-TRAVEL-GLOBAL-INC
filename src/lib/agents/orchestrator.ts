import { chat, isLLMEnabled, parseJsonLoose, type LLMMessage } from "../ai/llm";
import { runDeterministic } from "./handlers";
import { addEvent, createTask, hydrate, recordRun } from "./memory";
import { AGENTS, getAgent } from "./registry";
import {
  cotizar,
  documentos,
  extractTracking,
  rastrear,
  resumenOperacion,
  type ToolResult,
} from "./tools";
import type { AgentDefinition, AgentId, AgentReply, OrchestratorInput } from "./types";

interface RoutingResult {
  agentId: AgentId;
  motivo: string;
  confianza: number;
  usadoLLM: boolean;
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const LIMITE_PALABRA_CORTA = 3;

function coincide(clean: string, keyword: string): boolean {
  const k = normalize(keyword);
  if (!k) return false;
  if (k.length > LIMITE_PALABRA_CORTA) return clean.includes(k);
  // Siglas cortas (bl, kg, awb, dua...) solo como palabra: evita que "problema" active "bl".
  const escapado = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z])${escapado}(?![a-z])`).test(clean);
}

function scoreAgent(agent: AgentDefinition, clean: string): number {
  return agent.keywords.reduce((score, keyword) => {
    return coincide(clean, keyword) ? score + 1 : score;
  }, 0);
}

function routeByKeywords(message: string): RoutingResult {
  const clean = normalize(message);
  const scored = AGENTS.filter((a) => a.id !== "supervisor")
    .map((agent) => ({ agent, score: scoreAgent(agent, clean) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) {
    return { agentId: "atencion", motivo: "Sin coincidencia clara; atención al cliente atiende primero", confianza: 0.35, usadoLLM: false };
  }

  const tied = scored.filter((s) => s.score === best.score);
  if (tied.length > 1) {
    const priority: AgentId[] = ["tracking", "aduanas", "cotizador", "documentos", "operaciones", "ventas", "atencion", "marketing"];
    const chosen = tied.sort((a, b) => priority.indexOf(a.agent.id) - priority.indexOf(b.agent.id))[0];
    return { agentId: chosen.agent.id, motivo: `Empate resuelto por prioridad operativa (${chosen.agent.nombre})`, confianza: 0.55, usadoLLM: false };
  }

  return {
    agentId: best.agent.id,
    motivo: `Coincidencia de palabras clave con ${best.agent.nombre}`,
    confianza: Math.min(0.9, 0.5 + best.score * 0.1),
    usadoLLM: false,
  };
}

async function routeWithLLM(message: string): Promise<RoutingResult | null> {
  if (!isLLMEnabled()) return null;

  const catalog = AGENTS.map(
    (a) => `- ${a.id}: ${a.rol}. ${a.descripcion}`
  ).join("\n");

  const raw = await chat(
    [
      {
        role: "system",
        content:
          "Eres el enrutador de una célula de agentes de IA. Devuelve SOLO JSON válido con las claves: agentId, confianza (0-1), motivo.\n" +
          "Elige el agente más específico. Usa 'atencion' para saludos y dudas generales.\n\nAgentes:\n" +
          catalog,
      },
      { role: "user", content: message.slice(0, 1500) },
    ],
    { temperature: 0, maxTokens: 120, json: true, timeoutMs: 8000 }
  );

  const parsed = parseJsonLoose<{ agentId?: string; confianza?: number; motivo?: string }>(raw);
  if (!parsed?.agentId) return null;

  const exists = AGENTS.some((a) => a.id === parsed.agentId);
  if (!exists) return null;

  return {
    agentId: parsed.agentId as AgentId,
    motivo: parsed.motivo ?? "Clasificación por LLM",
    confianza: typeof parsed.confianza === "number" ? parsed.confianza : 0.7,
    usadoLLM: true,
  };
}

export async function routeAgent(message: string): Promise<RoutingResult> {
  const llm = await routeWithLLM(message);
  if (llm) return llm;
  return routeByKeywords(message);
}

function buildPayload(input: OrchestratorInput): Record<string, unknown> {
  return { ...(input.contexto ?? {}), mensaje: input.message };
}

function groundTools(
  agentId: AgentId,
  input: OrchestratorInput,
  payload: Record<string, unknown>
): ToolResult[] {
  const results: ToolResult[] = [];
  const agent = getAgent(agentId);

  if (agent.herramientas.includes("cotizar") && (payload.peso || payload.destino)) {
    results.push(cotizar(payload, input.cliente));
  }
  if (agent.herramientas.includes("documentos") && (payload.contenido || payload.valor)) {
    results.push(documentos(payload, input.cliente));
  }
  if (agent.herramientas.includes("rastrear")) {
    const tracking = extractTracking(input.message) ?? (payload.tracking as string | undefined);
    if (tracking) results.push(rastrear(tracking));
  }
  if (agent.herramientas.includes("resumenOperacion") && results.length === 0) {
    results.push(resumenOperacion());
  }
  return results;
}

function scheduleSideEffects(
  agentId: AgentId,
  payload: Record<string, unknown>
): string[] {
  const created: string[] = [];
  const programar = (
    agente: AgentId,
    titulo: string,
    tipo: string,
    prioridad: "alta" | "media" | "baja",
    delayMinutes: number
  ) =>
    created.push(
      createTask({ agentId: agente, titulo, tipo, prioridad, delayMinutes, payload }).id
    );

  switch (agentId) {
    case "cotizador":
      if (payload.peso && payload.destino) {
        programar("ventas", "Seguimiento de cotización enviada", "seguimiento_cotizacion", "media", 24 * 60);
        programar("documentos", "Preparar checklist documental", "checklist_documental", "baja", 90);
      }
      break;
    case "documentos":
      programar("documentos", "Revisar documentos originales del embarque", "revision_documental", "alta", 120);
      break;
    case "operaciones":
      programar("operaciones", "Seguimiento de incidencia operativa", "incidencia", "alta", 240);
      break;
    case "ventas":
      programar("ventas", "Reintentar contacto comercial", "seguimiento_comercial", "media", 48 * 60);
      break;
    case "aduanas":
      programar("aduanas", "Verificar estado del DUA", "seguimiento_aduanal", "media", 12 * 60);
      break;
    default:
      break;
  }
  return created;
}

async function executeWithLLM(
  agent: AgentDefinition,
  input: OrchestratorInput,
  payload: Record<string, unknown>
): Promise<{ reply: string; acciones: string[]; tareasCreadas: string[] } | null> {
  const tools = groundTools(agent.id, input, payload);
  const toolContext = tools
    .filter((t) => t.ok)
    .map((t) => `RESULTADO DE HERRAMIENTA:\n${t.resumen}`)
    .join("\n\n");

  const messages: LLMMessage[] = [
    { role: "system", content: agent.systemPrompt },
  ];

  if (toolContext) {
    messages.push({
      role: "system",
      content:
        `Datos reales del sistema (no inventes otros):\n\n${toolContext}\n\n` +
        "Responde al cliente en español, máximo 150 palabras, usando estos datos.",
    });
  }

  if (input.cliente) {
    messages.push({
      role: "system",
      content: `Cliente: ${JSON.stringify(input.cliente)}. Canal: ${input.canal ?? "web"}.`,
    });
  }

  messages.push({ role: "user", content: input.message });

  const reply = await chat(messages, { temperature: 0.4, maxTokens: 600 });
  if (!reply) return null;

  const acciones = tools.filter((t) => t.ok).map((t) => t.resumen.split("\n")[0]);
  const tareasCreadas = scheduleSideEffects(agent.id, payload);

  return { reply, acciones, tareasCreadas };
}

export async function runOrchestrator(input: OrchestratorInput): Promise<AgentReply> {
  await hydrate();
  const started = Date.now();

  const routing: RoutingResult = input.agentId
    ? { agentId: input.agentId, motivo: "Agente solicitado explícitamente", confianza: 1, usadoLLM: false }
    : await routeAgent(input.message);

  const agent = getAgent(routing.agentId);
  const payload = buildPayload(input);

  let result: AgentReply | null = null;

  if (isLLMEnabled()) {
    const llmResult = await executeWithLLM(agent, input, payload);
    if (llmResult) {
      result = {
        agentId: agent.id,
        reply: llmResult.reply,
        acciones: llmResult.acciones,
        tareasCreadas: llmResult.tareasCreadas,
        usadoLLM: true,
        latenciaMs: Date.now() - started,
      };
    }
  }

  if (!result) {
    result = await runDeterministic({ ...input, agentId: agent.id });
  }

  result.latenciaMs = Date.now() - started;
  recordRun(agent.id, result.usadoLLM, result.latenciaMs);

  addEvent({
    agentId: agent.id,
    tipo: "respuesta",
    mensaje: `${agent.nombre} respondió a "${input.message.slice(0, 70)}"`,
    nivel: "exito",
    meta: {
      canal: input.canal ?? "web",
      usadoLLM: result.usadoLLM,
      confianza: routing.confianza,
      motivo: routing.motivo,
      latenciaMs: result.latenciaMs,
    },
  });

  return result;
}
