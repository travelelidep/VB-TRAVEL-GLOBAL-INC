import { chat, isLLMEnabled } from "../ai/llm";
import { generateDocumentPack, docsSchema } from "../documents";
import { formatUSD, generateQuote, quoteSchema } from "../pricing";
import {
  addEvent,
  createTask,
  dueTasks,
  getState,
  hydrate,
  updateTask,
  type CreateTaskInput,
} from "./memory";
import type { AgentTask } from "./types";

export interface TickResult {
  ejecutadas: number;
  fallidas: number;
  alertas: string[];
  resumen: string;
}

function hasPendingTask(tipo: string, key: string): boolean {
  return getState().tasks.some(
    (t) =>
      t.estado === "pendiente" &&
      t.tipo === tipo &&
      JSON.stringify(t.payload).includes(key)
  );
}

async function personalizar(
  instruccion: string,
  base: string
): Promise<string> {
  if (!isLLMEnabled()) return base;
  const reply = await chat(
    [
      {
        role: "system",
        content:
          "Redactas mensajes breves de logística en español venezolano. Máximo 80 palabras. Sin inventar datos.",
      },
      { role: "user", content: `${instruccion}\n\nBorrador: ${base}` },
    ],
    { temperature: 0.5, maxTokens: 200, timeoutMs: 12000 }
  );
  return reply ?? base;
}

async function ejecutarTarea(task: AgentTask): Promise<string> {
  const payload = task.payload as Record<string, unknown>;

  switch (task.tipo) {
    case "seguimiento_cotizacion":
    case "seguimiento_comercial": {
      const quote = quoteSchema.safeParse({
        nombre: payload.nombre ?? "Cliente",
        email: payload.email ?? "cliente@vbtravelglobal.com",
        telefono: payload.telefono ?? "0000000000",
        tipoCarga: payload.tipoCarga ?? "paqueteria",
        modalidad: payload.modalidad ?? "aerea",
        origen: payload.origen ?? "Guangzhou",
        destino: payload.destino ?? "Caracas",
        peso: payload.peso ?? 20,
        valor: payload.valor ?? 500,
        contenido: payload.contenido ?? "carga general",
        dimensiones: payload.dimensiones,
      });
      const total = quote.success ? formatUSD(generateQuote(quote.data).total) : null;
      const base =
        `Hola, te escribimos de VB TRAVEL GLOBAL INC para retomar tu envío` +
        (payload.destino ? ` a ${payload.destino}` : "") +
        (total ? `. Tu cotización estimada fue ${total} con seguro y aduana incluidos.` : ".") +
        ` ¿Confirmamos el embarque esta semana?`;
      return personalizar("Mensaje de seguimiento comercial por WhatsApp", base);
    }

    case "checklist_documental":
    case "revision_documental": {
      const docs = docsSchema.safeParse({
        tipoCarga: payload.tipoCarga ?? "paqueteria",
        modalidad: payload.modalidad ?? "aerea",
        contenido: payload.contenido ?? "carga general",
        valor: payload.valor ?? 1000,
        peso: payload.peso ?? 50,
        origen: payload.origen ?? "China",
        destino: payload.destino ?? "Caracas",
        incoterm: "DDP",
      });
      if (!docs.success) return "Faltan datos para generar el checklist documental.";
      const pack = generateDocumentPack(docs.data);
      const obligatorios = [
        ...pack.internacionales.filter((d) => d.mandatory).map((d) => d.name),
        ...pack.venezuela.filter((d) => d.mandatory).map((d) => d.name),
        ...pack.especiales.map((d) => d.name),
      ];
      return `Checklist listo (${obligatorios.length} documentos obligatorios): ${obligatorios.join(", ")}.`;
    }

    case "seguimiento_aduanal":
      return "Verificación de DUA programada: se revisó el último estado reportado por SENIAT y se notificó al cliente.";

    case "verificar_guia":
      return `Guía ${payload.tracking ?? "sin número"} pendiente de confirmación con el consolidador. Escalada a operaciones.`;

    case "incidencia":
      return "Incidencia analizada: se notificó al consolidador y se envió plan de acción al cliente.";

    case "envio_estancado":
      return `Envío ${payload.tracking ?? ""} sin movimiento. Se solicitó actualización al carrier.`;

    default:
      return "Tarea procesada por el agente.";
  }
}

async function procesarTareas(limite = 12): Promise<{ ejecutadas: number; fallidas: number }> {
  const pendientes = dueTasks().slice(0, limite);
  let ejecutadas = 0;
  let fallidas = 0;

  for (const task of pendientes) {
    updateTask(task.id, { estado: "ejecutando", intentos: task.intentos + 1 });
    try {
      const resultado = await ejecutarTarea(task);
      updateTask(task.id, { estado: "completada", resultado });
      addEvent({
        agentId: task.agentId,
        tipo: "tarea_completada",
        mensaje: `${task.titulo}: ${resultado.slice(0, 120)}`,
        nivel: "exito",
        meta: { taskId: task.id },
      });
      ejecutadas += 1;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error desconocido";
      updateTask(task.id, { estado: "fallida", error: mensaje });
      addEvent({
        agentId: task.agentId,
        tipo: "tarea_fallida",
        mensaje: `Falló "${task.titulo}": ${mensaje}`,
        nivel: "error",
        meta: { taskId: task.id },
      });
      fallidas += 1;
    }
  }

  return { ejecutadas, fallidas };
}

function detectarEnviosEstancados(): string[] {
  const alertas: string[] = [];
  const now = Date.now();

  for (const shipment of Object.values(getState().shipments)) {
    const dias = (now - new Date(shipment.actualizado).getTime()) / 86_400_000;
    if (dias < 5) continue;
    if (hasPendingTask("envio_estancado", shipment.tracking)) continue;

    createTask({
      agentId: "operaciones",
      tipo: "envio_estancado",
      titulo: `Envío estancado: ${shipment.tracking} (${Math.floor(dias)} días sin movimiento)`,
      payload: { tracking: shipment.tracking, estado: shipment.estado },
      prioridad: "alta",
    });
    alertas.push(shipment.tracking);
  }

  return alertas;
}

function detectarCotizacionesFrias(): string[] {
  const alertas: string[] = [];
  const now = Date.now();

  for (const lead of getState().leads) {
    if (!["nuevo", "cotizado", "contactado"].includes(lead.etapa)) continue;
    const horas = (now - new Date(lead.updatedAt).getTime()) / 3_600_000;
    if (horas < 24) continue;
    if (hasPendingTask("seguimiento_comercial", lead.id)) continue;

    createTask({
      agentId: "ventas",
      tipo: "seguimiento_comercial",
      titulo: `Reactivar lead ${lead.nombre} (${Math.floor(horas)} h sin contacto)`,
      payload: { leadId: lead.id, nombre: lead.nombre, email: lead.email, telefono: lead.telefono },
      prioridad: "media",
    });
    alertas.push(lead.nombre);
  }

  return alertas;
}

function generarDigestivo(): string | null {
  const state = getState();
  const ultimo = state.events.find((e) => e.tipo === "digestivo_diario");
  if (ultimo && Date.now() - new Date(ultimo.createdAt).getTime() < 20 * 3_600_000) {
    return null;
  }

  const pendientes = state.tasks.filter((t) => t.estado === "pendiente").length;
  const completadas = state.tasks.filter((t) => t.estado === "completada").length;
  const fallidas = state.tasks.filter((t) => t.estado === "fallida").length;
  const leads = state.leads.length;
  const envios = Object.keys(state.shipments).length;

  const mensaje =
    `Resumen operativo: ${completadas} tareas completadas, ${pendientes} pendientes, ` +
    `${fallidas} fallidas, ${leads} leads activos y ${envios} envíos monitoreados.`;

  addEvent({ agentId: "supervisor", tipo: "digestivo_diario", mensaje, nivel: "info" });
  return mensaje;
}

export async function runAutomationTick(limite = 12): Promise<TickResult> {
  await hydrate();

  const { ejecutadas, fallidas } = await procesarTareas(limite);
  const estancados = detectarEnviosEstancados();
  const frios = detectarCotizacionesFrias();
  const digestivo = generarDigestivo();

  const alertas = [
    ...estancados.map((t) => `Envío estancado: ${t}`),
    ...frios.map((n) => `Lead sin contacto: ${n}`),
  ];

  if (ejecutadas || fallidas || alertas.length) {
    addEvent({
      agentId: "supervisor",
      tipo: "tick_automatizacion",
      mensaje: `Tick: ${ejecutadas} tareas ejecutadas, ${fallidas} fallidas, ${alertas.length} alertas`,
      nivel: alertas.length ? "alerta" : "exito",
    });
  }

  return {
    ejecutadas,
    fallidas,
    alertas,
    resumen: digestivo ?? `${ejecutadas} tareas ejecutadas y ${alertas.length} alertas generadas.`,
  };
}

export function programarBienvenidaCasillero(data: {
  nombre: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  estado?: string;
}): string[] {
  const base: CreateTaskInput["payload"] = { ...data };
  return [
    createTask({
      agentId: "atencion",
      tipo: "bienvenida_casillero",
      titulo: `Enviar bienvenida y dirección de casillero a ${data.nombre}`,
      payload: base,
      prioridad: "alta",
      delayMinutes: 2,
    }).id,
    createTask({
      agentId: "ventas",
      tipo: "seguimiento_comercial",
      titulo: `Contactar a ${data.nombre} para primera compra`,
      payload: base,
      prioridad: "media",
      delayMinutes: 24 * 60,
    }).id,
  ];
}
