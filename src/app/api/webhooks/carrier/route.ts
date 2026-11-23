import { NextRequest, NextResponse } from "next/server";
import { addEvent, createTask, getShipment, hydrate } from "@/lib/agents/memory";
import { registerTrackingEvent } from "@/lib/agents/tools";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await hydrate();
    const body = await req.json();
    const { trackingNumber, event, location, timestamp, details, carrier } = body;

    if (!trackingNumber || !event) {
      return NextResponse.json(
        { error: "trackingNumber y event son requeridos" },
        { status: 400 }
      );
    }

    const shipment = registerTrackingEvent(
      String(trackingNumber),
      String(event),
      String(location ?? "En tránsito"),
      String(event)
    );

    const notificacion = createTask({
      agentId: "tracking",
      tipo: "notificar_cliente",
      titulo: `Notificar "${event}" de ${trackingNumber} a ${shipment.ubicacion}`,
      payload: { trackingNumber, event, location, carrier, details, timestamp },
      prioridad: "alta",
    });

    addEvent({
      agentId: "tracking",
      tipo: "evento_carrier",
      mensaje: `${carrier ?? "carrier"}: ${trackingNumber} → ${event} (${location ?? "n/d"})`,
      nivel: "info",
      meta: { trackingNumber, event },
    });

    return NextResponse.json({
      success: true,
      received: true,
      trackingNumber,
      event,
      estado: shipment.estado,
      tarea: notificacion.id,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Carrier webhook error:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await hydrate();
  const { searchParams } = new URL(req.url);
  const trackingNumber = searchParams.get("tracking");

  if (!trackingNumber) {
    return NextResponse.json({ error: "Parámetro tracking requerido" }, { status: 400 });
  }

  const shipment = getShipment(trackingNumber);
  if (!shipment) {
    return NextResponse.json(
      { trackingNumber, encontrado: false, mensaje: "Guía no registrada en el sistema" },
      { status: 404 }
    );
  }

  return NextResponse.json({ trackingNumber, encontrado: true, ...shipment });
}
