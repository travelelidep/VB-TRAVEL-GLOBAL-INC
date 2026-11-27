import { NextRequest, NextResponse } from "next/server";
import { getAgentEmail, getAgentById } from "@/lib/agent-assignment";
import { addEvent, createTask, hydrate, upsertLead } from "@/lib/agents/memory";

interface WingsWebhookPayload {
  pnr: string;
  bookingReference?: string;
  totalAmount: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled" | "failed";
  passengers: Array<{
    name: string;
    email?: string;
    phone?: string;
    type: "ADT" | "CHD" | "INF";
  }>;
  bookingData: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    cabinClass: string;
    airline?: string;
    flightNumber?: string;
  };
  subAgent?: string;
  agentRef?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  timestamp: string;
  signature?: string;
}

async function sendAgentNotification(payload: WingsWebhookPayload, agenteId: string) {
  const agentEmail = getAgentEmail(agenteId);
  const agente = getAgentById(agenteId);

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; padding: 24px; }
        .header { background: linear-gradient(135deg, #0f4c81 0%, #1a6cb5 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0; }
        .content { background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none; }
        .pnr-badge { display: inline-block; background: #f59e0b; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { color: #64748b; font-weight: 500; }
        .detail-value { font-weight: 600; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0f4c81 0%, #1a6cb5 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
        .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🎉 Nueva Reserva Confirmada</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Asignada a: ${agente?.nombre || agenteId}</p>
        </div>
        <div class="content">
          <div style="text-align: center; margin-bottom: 24px;">
            <span class="pnr-badge">PNR: ${payload.pnr}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Cliente Principal</span>
            <span class="detail-value">${payload.passengers[0]?.name || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Pasajeros</span>
            <span class="detail-value">${payload.passengers.length}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Ruta</span>
            <span class="detail-value">${payload.bookingData.origin} → ${payload.bookingData.destination}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha Salida</span>
            <span class="detail-value">${payload.bookingData.departureDate}</span>
          </div>
          ${payload.bookingData.returnDate ? `
          <div class="detail-row">
            <span class="detail-label">Fecha Regreso</span>
            <span class="detail-value">${payload.bookingData.returnDate}</span>
          </div>` : ""}
          <div class="detail-row">
            <span class="detail-label">Clase</span>
            <span class="detail-value">${payload.bookingData.cabinClass}</span>
          </div>
          ${payload.bookingData.airline ? `
          <div class="detail-row">
            <span class="detail-label">Aerolínea</span>
            <span class="detail-value">${payload.bookingData.airline} ${payload.bookingData.flightNumber ? `(${payload.bookingData.flightNumber})` : ""}</span>
          </div>` : ""}
          <div class="detail-row">
            <span class="detail-label">Importe Total</span>
            <span class="detail-value">${payload.currency} ${payload.totalAmount.toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Estado</span>
            <span class="detail-value" style="text-transform: capitalize; color: ${payload.status === "confirmed" ? "#10b981" : payload.status === "pending" ? "#f59e0b" : "#ef4444"};">${payload.status}</span>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://mdtravelgloballlc.mywingsbooking.com/es/booking/${payload.pnr}" class="btn">
              Ver Reserva en WINGS →
            </a>
          </div>

          <div class="footer">
            <p>MD Travel Global LLC - Sistema Automatizado de Notificaciones</p>
            <p>Webhook recibido: ${new Date(payload.timestamp).toLocaleString("es-ES")}</p>
            <p>Tracking: ${payload.utm_source || "direct"} / ${payload.utm_medium || "none"} / ${payload.utm_campaign || "none"}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY no configurado, saltando email");
      return;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MD Travel Sistema <sistema@mdtravelglobal.com>",
        to: [agentEmail],
        subject: `🎉 Nueva reserva: ${payload.pnr} - ${payload.passengers[0]?.name || "Cliente"}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error enviando email:", error);
    }
  } catch (error) {
    console.error("Error en sendAgentNotification:", error);
  }
}

async function logToCRM(payload: WingsWebhookPayload, agenteId: string) {
  // Aquí integrarías con tu CRM (Airtable, HubSpot, Supabase, etc.)
  // Ejemplo para Airtable:
  /*
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  if (airtableApiKey && airtableBaseId) {
    await fetch(`https://api.airtable.com/v0/${airtableBaseId}/Reservas`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          PNR: payload.pnr,
          Agente: agenteId,
          Cliente: payload.passengers[0]?.name,
          Email: payload.passengers[0]?.email,
          Telefono: payload.passengers[0]?.phone,
          Origen: payload.bookingData.origin,
          Destino: payload.bookingData.destination,
          FechaSalida: payload.bookingData.departureDate,
          FechaRegreso: payload.bookingData.returnDate || "",
          Importe: payload.totalAmount,
          Moneda: payload.currency,
          Estado: payload.status,
          UTM_Source: payload.utm_source,
          UTM_Medium: payload.utm_medium,
          UTM_Campaign: payload.utm_campaign,
          FechaCreacion: new Date().toISOString(),
        },
      }),
    });
  }
  */
  console.log("[CRM] Reservaría logueada:", { pnr: payload.pnr, agente: agenteId });
}

export async function POST(req: NextRequest) {
  try {
    const payload: WingsWebhookPayload = await req.json();

    // Validación básica
    if (!payload.pnr || !payload.totalAmount) {
      return NextResponse.json(
        { error: "Payload inválido: faltan campos requeridos (pnr, totalAmount)" },
        { status: 400 }
      );
    }

    // Verificar firma si WINGS la envía (configurar en WINGS Admin)
    const expectedSignature = process.env.WINGS_WEBHOOK_SECRET;
    if (expectedSignature && payload.signature) {
      const crypto = await import("crypto");
      const hmac = crypto.createHmac("sha256", expectedSignature);
      hmac.update(JSON.stringify(payload));
      const computedSignature = hmac.digest("hex");
      if (computedSignature !== payload.signature) {
        console.error("Firma webhook inválida");
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
      }
    }

    // Determinar agente asignado
    const agenteId = payload.subAgent || payload.utm_content || "maria.ventas";

    // Ejecutar notificaciones en paralelo
    await Promise.all([
      sendAgentNotification(payload, agenteId),
      logToCRM(payload, agenteId),
    ]);

    // Célula de agentes: registrar el cliente y programar el seguimiento
    await hydrate();
    const pasajero = payload.passengers?.[0];
    if (pasajero?.name) {
      const lead = upsertLead({
        nombre: pasajero.name,
        email: pasajero.email,
        telefono: pasajero.phone,
        origen: "wings-booking",
        interes: `Reserva ${payload.pnr} ${payload.bookingData.origin} → ${payload.bookingData.destination}`,
        agentId: "ventas",
        etapa: payload.status === "confirmed" ? "cerrado" : "negociacion",
      });

      createTask({
        agentId: "ventas",
        tipo: "seguimiento_reserva",
        titulo: `Post-venta de reserva ${payload.pnr} (${pasajero.name})`,
        payload: { pnr: payload.pnr, leadId: lead.id, totalAmount: payload.totalAmount },
        prioridad: "media",
        delayMinutes: 24 * 60,
      });
    }

    if (payload.status === "confirmed") {
      createTask({
        agentId: "operaciones",
        tipo: "confirmar_servicio",
        titulo: `Confirmar servicios de la reserva ${payload.pnr}`,
        payload: {
          pnr: payload.pnr,
          origen: payload.bookingData.origin,
          destino: payload.bookingData.destination,
          salida: payload.bookingData.departureDate,
        },
        prioridad: "alta",
        delayMinutes: 15,
      });
    }

    addEvent({
      agentId: "ventas",
      tipo: "reserva_wings",
      mensaje: `Reserva ${payload.pnr} ${payload.status} (${payload.currency} ${payload.totalAmount})`,
      nivel: payload.status === "confirmed" ? "exito" : "info",
      meta: { pnr: payload.pnr, agente: agenteId },
    });

    return NextResponse.json({
      ok: true,
      message: "Webhook procesado correctamente",
      agenteNotificado: agenteId,
    });
  } catch (error) {
    console.error("Error procesando webhook WINGS:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/wings",
    description: "Webhook para confirmaciones de reserva WINGS",
    expectedPayload: {
      pnr: "string",
      totalAmount: "number",
      currency: "string",
      status: "confirmed | pending | cancelled | failed",
      passengers: "array",
      bookingData: "object",
      subAgent: "string (optional)",
    },
  });
}
