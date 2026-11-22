import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackingNumber, event, location, timestamp, details, carrier } = body;
    
    if (!trackingNumber || !event) {
      return NextResponse.json(
        { error: "trackingNumber y event son requeridos" },
        { status: 400 }
      );
    }
    
    console.log(`[Carrier Webhook] ${carrier || "unknown"}: ${trackingNumber} - ${event} @ ${location}`);
    
    // Aquí se actualizaría la base de datos y se dispararían notificaciones
    // await updateTracking(trackingNumber, { event, location, timestamp, details });
    // await notifyClient(trackingNumber, event);
    
    return NextResponse.json({
      success: true,
      received: true,
      trackingNumber,
      event,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Carrier webhook error:", error);
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingNumber = searchParams.get("tracking");
  
  if (!trackingNumber) {
    return NextResponse.json(
      { error: "Parámetro tracking requerido" },
      { status: 400 }
    );
  }
  
  return NextResponse.json({
    trackingNumber,
    status: "IN_TRANSIT",
    lastEvent: "DEPARTED_PORT",
    lastLocation: "Puerto Huangpu",
    lastUpdate: new Date().toISOString(),
    carrier: "COSCO",
    vessel: "COSCO SHIPPING VIRGO v.045E",
  });
}
