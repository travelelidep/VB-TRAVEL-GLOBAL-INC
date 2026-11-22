import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { duaNumber, trackingNumber, status, observaciones, impuestos, timestamp } = body;
    
    if (!duaNumber || !status) {
      return NextResponse.json(
        { error: "duaNumber y status son requeridos" },
        { status: 400 }
      );
    }
    
    console.log(`[Aduana Webhook] DUA: ${duaNumber} - ${status} - Tracking: ${trackingNumber}`);
    
    const validStatuses = [
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
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido", validStatuses },
        { status: 400 }
      );
    }
    
    // Aquí se actualizaría tracking y notificaría al cliente
    // await updateCustomsStatus(duaNumber, trackingNumber, status, observaciones, impuestos);
    
    return NextResponse.json({
      success: true,
      duaNumber,
      trackingNumber,
      status,
      processedAt: new Date().toISOString(),
      nextSteps: status === "LIBERADO" 
        ? "Carga liberada. Coordinando entrega final."
        : status === "SELECCION_ROJA"
        ? "Inspección física programada. Preparar documentación original."
        : status === "PAGO_IMPUESTOS"
        ? "Impuestos pagados. Esperando liberación."
        : "Procesando...",
    });
  } catch (error) {
    console.error("Aduana webhook error:", error);
    return NextResponse.json(
      { error: "Error procesando webhook aduana" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const duaNumber = searchParams.get("dua");
  
  if (!duaNumber) {
    return NextResponse.json(
      { error: "Parámetro dua requerido" },
      { status: 400 }
    );
  }
  
  return NextResponse.json({
    duaNumber,
    status: "LIBERADO",
    trackingNumber: "TCE123456",
    impuestosPagados: 2450.00,
    fechaLiberacion: new Date().toISOString(),
    observaciones: "Canal verde. Sin inspección física.",
  });
}
