import { generateDocumentPack, docsSchema, type DocumentPack } from "../documents";
import { formatUSD, generateQuote, quoteSchema, type QuoteResult } from "../pricing";
import {
  createTask as storeTask,
  getShipment,
  getState,
  upsertLead,
  upsertShipment,
} from "./memory";
import type { AgentId } from "./types";

export interface ToolResult {
  ok: boolean;
  resumen: string;
  data?: unknown;
  acciones?: string[];
  faltantes?: string[];
  tareas?: string[];
}

type AnyRecord = Record<string, unknown>;

function num(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function extractTracking(message: string): string | undefined {
  const patterns = [/VBG[-\s]?\d{4,}/i, /TCE\d{4,}/i, /\b[A-Z]{2,4}\d{6,}\b/];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[0].replace(/\s/g, "").toUpperCase();
  }
  return undefined;
}

export function cotizar(input: AnyRecord, cliente?: AnyRecord): ToolResult {
  const candidate = {
    nombre: str(input.nombre) ?? str(cliente?.nombre) ?? "Cliente web",
    email: str(input.email) ?? str(cliente?.email) ?? "cliente@vbtravelglobal.com",
    telefono: str(input.telefono) ?? str(cliente?.telefono) ?? "0000000000",
    empresa: str(input.empresa),
    tipoCarga: str(input.tipoCarga) ?? "paqueteria",
    modalidad: (str(input.modalidad) ?? "aerea").toLowerCase().includes("mar") ? "maritima" : "aerea",
    origen: str(input.origen) ?? "Guangzhou, China",
    destino: str(input.destino) ?? str(cliente?.ciudad),
    peso: num(input.peso),
    dimensiones: str(input.dimensiones),
    piezas: num(input.piezas),
    valor: num(input.valor),
    contenido: str(input.contenido),
    notas: str(input.notas),
  };

  const parsed = quoteSchema.safeParse(candidate);
  if (!parsed.success) {
    const faltantes = parsed.error.issues.map((i) => i.path.join("."));
    return {
      ok: false,
      resumen: `Faltan datos para cotizar: ${[...new Set(faltantes)].join(", ")}`,
      faltantes: [...new Set(faltantes)],
    };
  }

  const quote: QuoteResult = generateQuote(parsed.data);
  const desglose = Object.entries(quote.breakdown)
    .map(([k, v]) => `• ${k.replace(/_/g, " ")}: ${formatUSD(v)}`)
    .join("\n");

  return {
    ok: true,
    resumen:
      `Cotización ${quote.modality === "aerea" ? "aérea" : "marítima"} ${quote.route}\n` +
      `Peso facturable: ${quote.chargeableWeight} kg (volumétrico ${quote.volumetricWeight} kg)\n` +
      `${desglose}\n` +
      `TOTAL: ${formatUSD(quote.total)} USD (${quote.incoterm}, tránsito ${quote.transitDays} días, válida ${quote.validity})`,
    data: quote,
    acciones: [
      "Cotización generada",
      "Seguimiento comercial programado a 24 h",
      "Checklist documental programado",
    ],
  };
}

export function documentos(input: AnyRecord, cliente?: AnyRecord): ToolResult {
  const candidate = {
    quoteId: str(input.quoteId),
    tipoCarga: str(input.tipoCarga) ?? "paqueteria",
    modalidad: (str(input.modalidad) ?? "aerea").toLowerCase().includes("mar") ? "maritima" : "aerea",
    contenido: str(input.contenido) ?? "carga general",
    valor: num(input.valor) ?? 1000,
    peso: num(input.peso) ?? 50,
    origen: str(input.origen) ?? "China",
    destino: str(input.destino) ?? str(cliente?.ciudad) ?? "Caracas",
    incoterm: str(input.incoterm) ?? "DDP",
  };

  const parsed = docsSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      ok: false,
      resumen: "Necesito tipo de carga, modalidad, contenido y valor para generar el checklist.",
      faltantes: parsed.error.issues.map((i) => i.path.join(".")),
    };
  }

  const pack: DocumentPack = generateDocumentPack(parsed.data);
  const obligatorios = pack.internacionales.filter((d) => d.mandatory).map((d) => d.name);
  const venezuela = pack.venezuela.filter((d) => d.mandatory).map((d) => d.name);
  const especiales = pack.especiales.map((d) => d.name);

  return {
    ok: true,
    resumen:
      `Checklist documental (${parsed.data.modalidad === "aerea" ? "aéreo" : "marítimo"}):\n` +
      `• Internacionales obligatorios: ${obligatorios.join(", ")}\n` +
      `• Venezuela obligatorios: ${venezuela.join(", ")}\n` +
      (especiales.length ? `• Especiales detectados: ${especiales.join(", ")}\n` : "") +
      `• Pasos: ${pack.checklist.map((c) => c.action).join(" → ")}`,
    data: pack,
    acciones: ["Checklist documental generado"],
  };
}

export function rastrear(tracking: string | undefined): ToolResult {
  if (!tracking) {
    return {
      ok: false,
      resumen: "Necesito el número de guía (por ejemplo VBG123456 o TCE123456) para rastrear el envío.",
      faltantes: ["tracking"],
    };
  }

  const shipment = getShipment(tracking);
  if (!shipment) {
    const task = storeTask({
      agentId: "tracking",
      tipo: "verificar_guia",
      titulo: `Verificar guía no encontrada: ${tracking}`,
      payload: { tracking },
      prioridad: "media",
    });
    return {
      ok: false,
      resumen: `No encuentro la guía ${tracking} en el sistema. Registré una verificación con el equipo de operaciones.`,
      tareas: [task.id],
    };
  }

  return {
    ok: true,
    resumen:
      `Guía ${shipment.tracking}: ${shipment.estado}\n` +
      `Último evento: ${shipment.ultimoEvento} (${shipment.ubicacion})\n` +
      `Actualizado: ${new Date(shipment.actualizado).toLocaleString("es-VE")}`,
    data: shipment,
  };
}

export function crearLead(input: AnyRecord, agentId: AgentId): ToolResult {
  const nombre = str(input.nombre) ?? "Cliente sin nombre";
  const lead = upsertLead({
    nombre,
    email: str(input.email),
    telefono: str(input.telefono),
    ciudad: str(input.ciudad),
    estado: str(input.estado),
    origen: str(input.origen) ?? "agente-ia",
    interes: str(input.interes),
    agentId,
  });

  return {
    ok: true,
    resumen: `Lead registrado: ${lead.nombre} (${lead.etapa}). Asignado a ${agentId}.`,
    data: lead,
  };
}

export function crearTarea(input: AnyRecord, agentId: AgentId): ToolResult {
  const titulo = str(input.titulo) ?? "Tarea creada por agente";
  const task = storeTask({
    agentId: (str(input.agentId) as AgentId) ?? agentId,
    tipo: str(input.tipo) ?? "seguimiento",
    titulo,
    payload: (input.payload as Record<string, unknown>) ?? {},
    prioridad: (str(input.prioridad) as "alta" | "media" | "baja") ?? "media",
    delayMinutes: num(input.delayMinutes) ?? 0,
  });
  return { ok: true, resumen: `Tarea programada: ${titulo}`, tareas: [task.id] };
}

export function resumenOperacion(): ToolResult {
  const state = getState();
  const pendientes = state.tasks.filter((t) => t.estado === "pendiente").length;
  const fallidas = state.tasks.filter((t) => t.estado === "fallida").length;
  const leadsNuevos = state.leads.filter((l) => l.etapa === "nuevo").length;
  const envios = Object.keys(state.shipments).length;

  return {
    ok: true,
    resumen:
      `Operación: ${pendientes} tareas pendientes, ${fallidas} fallidas, ${leadsNuevos} leads nuevos, ${envios} envíos monitoreados.`,
    data: { pendientes, fallidas, leadsNuevos, envios },
  };
}

export function registerTrackingEvent(
  tracking: string,
  evento: string,
  ubicacion: string,
  estado?: string
) {
  return upsertShipment(tracking, {
    ...(estado ? { estado } : {}),
    evento: { evento, ubicacion },
  });
}
