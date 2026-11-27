import { NextRequest, NextResponse } from "next/server";
import { addEvent } from "@/lib/agents/memory";
import { runOrchestrator } from "@/lib/agents/orchestrator";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "vbtravelglobal_verify_2024";

interface WhatsAppMessage {
  from: string;
  type: string;
  text?: { body: string };
  interactive?: { type: string; button_reply?: { id: string; title: string } };
  location?: { latitude: number; longitude: number };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verificado");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp] Verificación fallida");
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ success: true });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "messages") continue;

        const messages: WhatsAppMessage[] = change.value.messages || [];
        const contacts = change.value.contacts || [];

        for (const msg of messages) {
          const contact = contacts.find(
            (c: { wa_id: string }) => c.wa_id === msg.from
          );
          const name = contact?.profile?.name || msg.from;
          const texto = resolverTexto(msg);

          if (!texto) continue;

          console.log(`[WhatsApp] ${name} (${msg.from}): ${texto}`);
          await atenderMensaje(msg.from, name, texto);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WhatsApp] Error:", error);
    // Siempre 200 para que Meta no reintente en bucle
    return NextResponse.json({ success: true });
  }
}

function resolverTexto(msg: WhatsAppMessage): string | null {
  if (msg.type === "text" && msg.text?.body) return msg.text.body;
  if (msg.type === "interactive" && msg.interactive?.button_reply) {
    const id = msg.interactive.button_reply.id;
    const mapa: Record<string, string> = {
      cotizar: "Quiero cotizar un envío",
      rastrear: "Quiero rastrear mi envío",
      documentos: "¿Qué documentos necesito para importar?",
      asesor: "Quiero hablar con un asesor humano",
      casillero: "Quiero abrir mi casillero",
    };
    return mapa[id] ?? msg.interactive.button_reply.title;
  }
  if (msg.type === "location" && msg.location) {
    return `Mi ubicación de entrega es lat ${msg.location.latitude}, lng ${msg.location.longitude}`;
  }
  return null;
}

async function atenderMensaje(from: string, name: string, texto: string) {
  const resultado = await runOrchestrator({
    message: texto,
    canal: "whatsapp",
    cliente: { nombre: name, telefono: from },
  });

  await sendMessage(from, resultado.reply);

  addEvent({
    agentId: resultado.agentId,
    tipo: "whatsapp_atendido",
    mensaje: `WhatsApp de ${name}: ${texto.slice(0, 60)}`,
    nivel: "info",
    meta: { usadoLLM: resultado.usadoLLM, latenciaMs: resultado.latenciaMs },
  });
}

async function sendMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.log(`[WhatsApp] Simulado → ${to}: ${text.substring(0, 120)}`);
    return;
  }

  try {
    await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text.slice(0, 4096) },
      }),
    });
  } catch (error) {
    console.error("[WhatsApp] Error enviando mensaje:", error);
  }
}
