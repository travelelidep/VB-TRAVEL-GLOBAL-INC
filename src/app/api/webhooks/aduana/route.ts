import { NextRequest, NextResponse } from "next/server";
import { addEvent, createTask, hydrate } from "@/lib/agents/memory";
import { registerTrackingEvent } from "@/lib/agents/tools";

export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "PRESENTADO",
  "EN_REVISION",
  "SELECCION_ROJA",
  "SELECCION_AMARILLA",
  "SELECCION_VERDE",
  "PAGO_IMPUESTOS",
  "LIBERADO",
  "RETENIDO",
  "ANULADO",
];

const SIGUIENTE_PASO: Record<string, string> = {
  LIBERADO: "Carga liberada. Coordinando entrega final.",
  SELECCION_ROJA: "Inspección física programada. Preparar documentación original.",
  SELECCION_AMARILLA: "Revisión documental del SENIAT en curso.",
  SELECCION_VERDE: "Levante automático: sin inspección física.",
  PAGO_IMPUESTOS: "Impuestos determinados. Confirmar pago para liberar.",
  RETENIDO: "Carga retenida: revisar valor declarado, HS Code y licencias.",
  ANULADO: "DUA anulado. Se requiere nueva declaración.",
};

export async function POST(req: NextRequest) {
  try {
    await hydrate();
    const body = await req.json();
    const { duaNumber, trackingNumber, status, observaciones, impuestos, timestamp } = body;

    if (!duaNumber || !status) {
      return NextResponse.json(
        { error: "duaNumber y status son requeridos" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido", validStatuses: VALID_STATUSES },
        { status: 400 }
      );
    }

    if (trackingNumber) {
      registerTrackingEvent(
        String(trackingNumber),
        `DUA ${duaNumber}: ${status}`,
        "Aduana Venezuela",
        status
      );
    }

    const prioridad = ["RETENIDO", "SELECCION_ROJA", "ANULADO"].includes(status)
      ? "alta"
      : status === "LIBERADO"
        ? "media"
        : "baja";

    const tarea = createTask({
      agentId: "aduanas",
      tipo: "seguimiento_aduanal",
      titulo: `DUA ${duaNumber} en estado ${status}${trackingNumber ? ` (guía ${trackingNumber})` : ""}`,
      payload: { duaNumber, trackingNumber, status, observaciones, impuestos, timestamp },
      prioridad,
      delayMinutes: status === "LIBERADO" ? 30 : 180,
    });

    addEvent({
      agentId: "aduanas",
      tipo: "estado_aduanal",
      mensaje: `DUA ${duaNumber}: ${status}`,
      nivel: prioridad === "alta" ? "alerta" : "info",
      meta: { duaNumber, trackingNumber, status },
    });

    return NextResponse.json({
      success: true,
      duaNumber,
      trackingNumber,
      status,
      nextSteps: SIGUIENTE_PASO[status] ?? "Procesando...",
      tarea: tarea.id,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Aduana webhook error:", error);
    return NextResponse.json({ error: "Error procesando webhook aduana" }, { status: 500 });
  }
}
