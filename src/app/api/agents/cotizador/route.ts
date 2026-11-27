import { NextRequest, NextResponse } from "next/server";
import { addEvent, addLeadNote, createTask, hydrate, upsertLead } from "@/lib/agents/memory";
import { formatUSD, generateQuote, quoteSchema } from "@/lib/pricing";

export const dynamic = "force-dynamic";

function num(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.,-]/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Acepta el contrato del API (peso/valor/destino) y también el formulario
 * del wizard (pesoPorCaja/cajas/valorCarga/destinoFinal).
 */
function normalizePayload(body: Record<string, unknown>): Record<string, unknown> {
  const cajas = num(body.cajas) ?? 1;
  const paletas = num(body.paletas) ?? 1;
  const pesoPorCaja = num(body.pesoPorCaja);
  const pesoPalet = num(body.pesoPalet);

  const peso =
    num(body.peso) ??
    (pesoPorCaja ? pesoPorCaja * cajas : undefined) ??
    (pesoPalet ? pesoPalet * paletas : undefined);

  const piezas = num(body.piezas) ?? num(body.cajas) ?? num(body.paletas) ?? 1;

  const largo = str(body.largo);
  const ancho = str(body.ancho);
  const alto = str(body.alto);
  const dimensiones =
    str(body.dimensiones) ?? (largo && ancho && alto ? `${largo}x${ancho}x${alto}` : undefined);

  return {
    nombre: str(body.nombre) ?? "Cliente web",
    email: str(body.email) ?? "cliente@vbtravelglobal.com",
    telefono: str(body.telefono) ?? "0000000000",
    empresa: str(body.empresa),
    tipoCarga: str(body.tipoCarga) ?? "paqueteria",
    modalidad: str(body.modalidad) ?? "aerea",
    origen: str(body.origen) ?? str(body.ubicacionOrigen) ?? "Guangzhou, China",
    destino: str(body.destino) ?? str(body.destinoFinal),
    peso,
    dimensiones,
    piezas,
    valor: num(body.valor) ?? num(body.valorCarga),
    contenido: str(body.contenido),
    notas: str(body.notas),
  };
}

export async function POST(req: NextRequest) {
  try {
    await hydrate();
    const body = (await req.json()) as Record<string, unknown>;
    const parsed = quoteSchema.safeParse(normalizePayload(body));

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          detalles: parsed.error.flatten(),
          camposFaltantes: [...new Set(parsed.error.issues.map((i) => i.path.join(".")))],
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const quote = generateQuote(data);
    const quoteId = `VBG-Q-${Date.now().toString(36).toUpperCase()}`;

    const lead = upsertLead({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      ciudad: data.destino,
      origen: "web-cotizador",
      interes: `${data.modalidad} · ${data.tipoCarga} · ${data.peso} kg`,
      agentId: "cotizador",
      etapa: "cotizado",
    });

    addLeadNote(
      lead.id,
      `Cotización ${quoteId}: ${formatUSD(quote.total)} (${data.modalidad}, ${quote.chargeableWeight} kg facturables).`
    );

    const seguimiento = createTask({
      agentId: "ventas",
      tipo: "seguimiento_cotizacion",
      titulo: `Seguimiento de cotización ${quoteId} — ${data.nombre}`,
      payload: { ...data, quoteId, total: quote.total },
      prioridad: "alta",
      delayMinutes: 24 * 60,
    });

    const documental = createTask({
      agentId: "documentos",
      tipo: "checklist_documental",
      titulo: `Preparar checklist documental de ${quoteId}`,
      payload: { ...data, quoteId },
      prioridad: "media",
      delayMinutes: 60,
    });

    addEvent({
      agentId: "cotizador",
      tipo: "cotizacion_generada",
      mensaje: `${quoteId}: ${formatUSD(quote.total)} para ${data.nombre} (${data.destino})`,
      nivel: "exito",
      meta: { quoteId, total: quote.total, modalidad: data.modalidad },
    });

    return NextResponse.json({
      success: true,
      quoteId,
      quote,
      resumen: `${quote.modality === "aerea" ? "Aéreo" : "Marítimo"} a ${data.destino}: ${formatUSD(quote.total)} USD (${quote.transitDays} días de tránsito).`,
      agent: "cotizador",
      agentes: {
        seguimiento: { id: seguimiento.id, programado: seguimiento.dueAt },
        documental: { id: documental.id, programado: documental.dueAt },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cotizador] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
