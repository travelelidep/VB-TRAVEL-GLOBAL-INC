import { addEvent, createTask } from "./memory";
import { getAgent } from "./registry";
import { cotizar, documentos, extractTracking, rastrear, resumenOperacion } from "./tools";
import type { AgentId, AgentReply, OrchestratorInput } from "./types";

const CIUDADES_VENEZUELA = [
  "caracas", "valencia", "maracaibo", "barquisimeto", "puerto ordaz", "maturin",
  "cumana", "san cristobal", "merida", "maracay", "barcelona", "puerto la cruz",
];

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectCiudad(message: string): string | undefined {
  const clean = normalize(message);
  const ciudad = CIUDADES_VENEZUELA.find((c) => clean.includes(c));
  return ciudad ? ciudad.replace(/\b\w/g, (letra) => letra.toUpperCase()) : undefined;
}

function parsePeso(message: string): number | undefined {
  const match = message.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilos?|kilogramos?)/i);
  if (!match) return undefined;
  return Number(match[1].replace(",", "."));
}

function parseBultos(message: string): {
  piezas?: number;
  dimensiones?: string;
  pesoTotal?: number;
} {
  const dims = message.match(
    /(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i
  );
  const bultos = message.match(/(\d+)\s*(cajas?|bultos?|piezas?|paletas?)/i);
  const porUnidad = message.match(
    /(\d+)\s*(?:cajas?|bultos?|piezas?|paletas?)\s*de\s*(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?|kilogramos?)/i
  );

  return {
    piezas: bultos ? Number(bultos[1]) : undefined,
    dimensiones: dims ? `${dims[1]}x${dims[2]}x${dims[3]}`.replace(/,/g, ".") : undefined,
    pesoTotal: porUnidad
      ? Number(porUnidad[1]) * Number(porUnidad[2].replace(",", "."))
      : undefined,
  };
}

function parseValor(message: string): number | undefined {
  const match = message.match(/(?:\$|usd)\s*(\d+(?:[.,]\d+)?)\s*(k|mil)?/i) ??
    message.match(/valor[^\d]{0,10}(\d+(?:[.,]\d+)?)/i);
  if (!match) return undefined;
  const base = Number(match[1].replace(",", "."));
  return /k|mil/i.test(match[2] ?? "") ? base * 1000 : base;
}

function parseModalidad(message: string): "aerea" | "maritima" {
  const clean = normalize(message);
  return /maritim|barco|buque|contenedor|fcl|lcl/.test(clean) ? "maritima" : "aerea";
}

function buildPayload(input: OrchestratorInput): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...(input.contexto ?? {}) };
  const message = input.message;

  const bultos = parseBultos(message);
  if (!payload.destino) payload.destino = detectCiudad(message);
  if (!payload.dimensiones && bultos.dimensiones) payload.dimensiones = bultos.dimensiones;
  if (!payload.piezas && bultos.piezas) payload.piezas = bultos.piezas;
  if (!payload.peso) payload.peso = bultos.pesoTotal ?? parsePeso(message);
  if (!payload.valor) payload.valor = parseValor(message);
  if (!payload.modalidad) payload.modalidad = parseModalidad(message);
  if (!payload.contenido) payload.contenido = message.slice(0, 120);
  if (!payload.nombre && input.cliente?.nombre) payload.nombre = input.cliente.nombre;
  if (!payload.email && input.cliente?.email) payload.email = input.cliente.email;
  if (!payload.telefono && input.cliente?.telefono) payload.telefono = input.cliente.telefono;
  return payload;
}

function tarea(
  agentId: AgentId,
  titulo: string,
  tipo: string,
  prioridad: "alta" | "media" | "baja" = "media",
  delayMinutes = 0,
  payload: Record<string, unknown> = {}
): string {
  return createTask({ agentId, titulo, tipo, prioridad, delayMinutes, payload }).id;
}

export async function runDeterministic(input: OrchestratorInput): Promise<AgentReply> {
  const started = Date.now();
  const agentId = input.agentId ?? "supervisor";
  const agent = getAgent(agentId);
  const payload = buildPayload(input);
  const acciones: string[] = [];
  const tareasCreadas: string[] = [];
  let reply = "";

  switch (agentId) {
    case "cotizador": {
      const result = cotizar(payload, input.cliente);
      if (result.ok) {
        reply =
          `Listo, aquí está tu cotización 👇\n\n${result.resumen}\n\n` +
          `Incluye seguro todo riesgo, impuestos de aduana y entrega puerta a puerta. ` +
          `¿Confirmamos el embarque o ajustamos peso/modalidad?`;
        acciones.push("Cotización calculada");
        tareasCreadas.push(
          tarea("ventas", "Seguimiento de cotización enviada", "seguimiento_cotizacion", "media", 24 * 60, payload)
        );
        tareasCreadas.push(
          tarea("documentos", "Preparar checklist documental de la cotización", "checklist_documental", "baja", 60, payload)
        );
      } else {
        const faltantes = (result.faltantes ?? []).filter((f) => !["nombre", "email", "telefono"].includes(f));
        reply =
          `Puedo cotizarte al instante 💰. Me falta esto:\n\n` +
          [...new Set(faltantes)].map((f) => `• ${f}`).join("\n") +
          `\n\nEjemplo: "20 kg de electrónicos a Caracas, valor $800, aéreo".`;
      }
      break;
    }

    case "documentos": {
      const result = documentos(payload, input.cliente);
      reply = result.ok
        ? `${result.resumen}\n\n¿Quieres que prepare los documentos en borrador?`
        : result.resumen;
      if (result.ok) {
        acciones.push("Checklist documental generado");
        tareasCreadas.push(
          tarea("documentos", "Revisar documentos originales del embarque", "revision_documental", "alta", 120, payload)
        );
      }
      break;
    }

    case "tracking": {
      const tracking = extractTracking(input.message) ?? (payload.tracking as string | undefined);
      const result = rastrear(tracking);
      reply = result.ok
        ? `${result.resumen}\n\n¿Necesitas que te avise en cada hito del envío?`
        : result.resumen;
      if (result.ok) acciones.push("Rastreo consultado");
      if (result.tareas?.length) tareasCreadas.push(...result.tareas);
      break;
    }

    case "aduanas": {
      const clean = normalize(input.message);
      const guia = extractTracking(input.message);
      const shipment = guia ? rastrear(guia) : null;
      const explicaciones: Record<string, string> = {
        "canal rojo": "Canal rojo significa inspección física. Debes tener a mano factura comercial, packing list y BL/AWB originales; el reconocimiento lo hace el SENIAT en el almacén fiscal.",
        "canal amarillo": "Canal amarillo es revisión documental: el SENIAT valida valores y clasificación arancelaria. Suele resolverse en 24-72 h si los papeles coinciden.",
        "canal verde": "Canal verde es levante automático: el sistema valida y libera sin inspección. Es el escenario más rápido.",
        retenido: "Si el DUA está retenido, revisa: valor declarado, HS Code, licencias y certificados sanitarios. El agente humano puede pedir el acta al SENIAT.",
        liberado: "¡Buenas noticias! Con el DUA liberado se coordina la entrega de última milla en 24-48 h.",
      };
      const key = Object.keys(explicaciones).find((k) => clean.includes(normalize(k)));
      reply = key
        ? explicaciones[key]
        : shipment?.ok
          ? `Estado aduanal de ${guia}: ${shipment.resumen}\n\n¿Quieres que revise si falta algún documento?`
          : "Cuéntame el estado del DUA (presentado, en revisión, canal rojo/amarillo/verde, pago de impuestos, liberado o retenido) y te digo el siguiente paso exacto.";
      acciones.push("Análisis aduanal");
      break;
    }

    case "atencion": {
      const nombre = input.cliente?.nombre?.split(" ")[0] ?? "";
      const clean = normalize(input.message);
      if (/casillero|registro|cuenta/.test(clean)) {
        reply =
          `¡Perfecto${nombre ? `, ${nombre}` : ""}! Abrir tu casillero es gratis 🎉\n\n` +
          `1️⃣ Regístrate con nombre, email y teléfono\n` +
          `2️⃣ Recibes tu dirección en Guangzhou y tu código VBG\n` +
          `3️⃣ Compra en Taobao, 1688, Alibaba o Tmall usando esa dirección\n` +
          `4️⃣ Nosotros consolidamos, despachamos y entregamos en tu puerta\n\n` +
          `¿Te envío el formulario ahora mismo?`;
        acciones.push("Guía de apertura de casillero");
        if (input.cliente?.telefono || input.cliente?.email) {
          tareasCreadas.push(
            tarea("atencion", `Enviar formulario de casillero a ${nombre || "cliente"}`, "enviar_formulario", "alta", 5, {
              ...payload,
            })
          );
        }
      } else if (/horario|atienden|abierto/.test(clean)) {
        reply =
          "Atendemos 24/7 por WhatsApp y el agente IA responde al instante 🕐. Un asesor humano revisa casos complejos de lunes a sábado, 8:00 a 18:00 (hora Venezuela).";
      } else if (/precio|cotiz|tarifa/.test(clean)) {
        const result = cotizar(payload, input.cliente);
        reply = result.ok
          ? result.resumen
          : "Con gusto te cotizo 💰. Dime peso, destino en Venezuela, valor de la mercancía y si prefieres aéreo o marítimo.";
        acciones.push("Derivado a cotización");
      } else {
        reply =
          `¡Hola${nombre ? ` ${nombre}` : ""}! 👋 Soy Sofía, de VB TRAVEL GLOBAL INC.\n\n` +
          `Puedo ayudarte con:\n` +
          `💰 Cotizar tu envío China → Venezuela\n` +
          `📦 Rastrear una guía\n` +
          `📄 Documentos de aduana\n` +
          `🏠 Abrir tu casillero gratis\n\n` +
          `¿Qué necesitas hoy?`;
        acciones.push("Menú de atención enviado");
      }
      break;
    }

    case "ventas": {
      const nombre = input.cliente?.nombre?.split(" ")[0];
      reply =
        `Hola${nombre ? ` ${nombre}` : ""} 👋 Te escribo de VB TRAVEL GLOBAL INC para dar seguimiento a tu envío.\n\n` +
        `Esta semana tenemos consolidación aérea saliendo de Guangzhou: 24-48 h a Caracas, con seguro y aduana incluidos.\n\n` +
        `¿Te reservo el cupo con la cotización que te enviamos o ajustamos el peso?`;
      acciones.push("Mensaje de seguimiento comercial");
      tareasCreadas.push(
        tarea("ventas", "Reintentar contacto comercial en 48 h", "seguimiento_comercial", "media", 48 * 60, payload)
      );
      break;
    }

    case "marketing": {
      reply =
        `✨ Publicación lista:\n\n` +
        `"¿Compraste en China y no sabes cómo traerlo? 🇨🇳➡️🇻🇪\n` +
        `Con VB TRAVEL GLOBAL tu carga sale de Guangzhou y llega a tu puerta en Venezuela.\n` +
        `✈️ Aéreo 24-48 h | 🚢 Marítimo 25-35 días\n` +
        `📦 Casillero gratis + seguro + aduana incluida\n` +
        `Escríbenos al WhatsApp +58 416 111157 y cotiza en minutos."\n\n` +
        `¿Lo adapto para Instagram, TikTok o email?`;
      acciones.push("Contenido generado");
      break;
    }

    case "operaciones": {
      const guia = extractTracking(input.message);
      const shipment = guia ? rastrear(guia) : null;
      reply =
        `Registré la incidencia${guia ? ` de la guía ${guia}` : ""} con prioridad alta ⚠️.\n` +
        (shipment?.ok ? `${shipment.resumen}\n` : "") +
        `\nAcciones: verificación con el consolidador en China, revisión del último evento y contacto con el cliente en menos de 4 horas.`;
      acciones.push("Incidencia registrada");
      tareasCreadas.push(
        tarea("operaciones", `Investigar incidencia${guia ? ` guía ${guia}` : ""}`, "incidencia", "alta", 0, payload)
      );
      break;
    }

    default: {
      const resumen = resumenOperacion();
      reply =
        `Soy Nexo, el supervisor de la célula de agentes de VB TRAVEL GLOBAL INC 🧠\n\n` +
        `Puedo conectarte con:\n` +
        `💰 Coti (precios) · 📄 Docu (documentos) · 🛃 Aduanero · 📦 Rastrea (guías)\n` +
        `💬 Sofía (atención) · 📈 Valeria (ventas) · ⚙️ Opera (incidencias)\n\n` +
        `Estado actual: ${resumen.resumen}\n\n` +
        `¿Qué necesitas resolver?`;
      acciones.push("Menú de agentes enviado");
    }
  }

  addEvent({
    agentId,
    tipo: "respuesta_determinista",
    mensaje: `${agent.nombre} respondió por reglas (${input.canal ?? "web"})`,
    nivel: "info",
  });

  return {
    agentId,
    reply,
    acciones,
    tareasCreadas,
    usadoLLM: false,
    latenciaMs: Date.now() - started,
  };
}
