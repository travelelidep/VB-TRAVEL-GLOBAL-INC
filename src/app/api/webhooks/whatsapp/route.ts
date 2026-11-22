import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "tucargaexpress_verify_2024";

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
        if (change.field === "messages") {
          const messages = change.value.messages || [];
          const contacts = change.value.contacts || [];
          
          for (const msg of messages) {
            const contact = contacts.find((c: any) => c.wa_id === msg.from);
            const name = contact?.profile?.name || msg.from;
            
            console.log(`[WhatsApp] ${name} (${msg.from}): ${msg.text?.body || msg.type}`);
            
            if (msg.type === "text") {
              await handleTextMessage(msg.from, msg.text.body, name);
            } else if (msg.type === "interactive") {
              await handleInteractiveMessage(msg.from, msg.interactive, name);
            } else if (msg.type === "location") {
              await handleLocationMessage(msg.from, msg.location, name);
            }
          }
          
          const statuses = change.value.statuses || [];
          for (const status of statuses) {
            console.log(`[WhatsApp] Status: ${status.id} - ${status.status}`);
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WhatsApp] Error:", error);
    return NextResponse.json({ success: true });
  }
}

async function handleTextMessage(from: string, text: string, name: string) {
  const lower = text.toLowerCase().trim();
  
  if (lower.includes("cotiz") || lower.includes("precio") || lower.includes("quote")) {
    await sendMessage(from, 
      `Hola ${name} 👋\n\n` +
      `Para cotizar tu envío China-Venezuela necesito:\n` +
      `📦 Tipo de carga (paquetería, carga suelta, paletizada, contenedor)\n` +
      `✈️/🚢 Modalidad (aéreo 24-48h / marítimo 25-35 días)\n` +
      `⚖️ Peso total (kg)\n` +
      `📏 Dimensiones (L×A×H cm por caja)\n` +
      `💰 Valor de la carga (USD)\n` +
      `📋 Contenido (ej: electrónicos, ropa, repuestos)\n` +
      `📍 Destino en Venezuela (ciudad)\n\n` +
      `O usa nuestro cotizador web: https://tucargaexpress.com/cotizador\n\n` +
      `¿Tienes los datos a mano?`
    );
  } else if (lower.includes("rastre") || lower.includes("track") || lower.startsWith("tce")) {
    const tracking = text.toUpperCase().match(/TCE\d+/)?.[0];
    if (tracking) {
      await sendMessage(from, `🔍 Consultando ${tracking}...\n\nEn un momento te envío el estado actual.`);
    } else {
      await sendMessage(from, 
        `Para rastrear tu envío, envíame tu número de guía (ej: TCE123456)\n\n` +
        `O consulta en: https://tucargaexpress.com/rastreo`
      );
    }
  } else if (lower.includes("documento") || lower.includes("dua") || lower.includes("aduana")) {
    await sendMessage(from,
      `📄 Documentos para importar China → Venezuela:\n\n` +
      `✅ Commercial Invoice (factura comercial)\n` +
      `✅ Packing List (lista de empaque)\n` +
      `✅ Bill of Lading / AWB\n` +
      `✅ Certificado de Origen\n` +
      `✅ DUA Venezuela (SENIAT)\n` +
      `⚠️ Licencia de importación (productos regulados)\n` +
      `⚠️ Certificado sanitario/fitosanitario (alimentos, agro)\n\n` +
      `Nuestro agente IA genera checklist personalizado. ¿Quieres que te envíe la lista completa para tu tipo de carga?`
    );
  } else if (lower.includes("hola") || lower.includes("buen") || lower.startsWith("hi")) {
    await sendMessage(from,
      `Hola ${name} 👋 Bienvenido a TuCargaExpress IA\n\n` +
      `Somos tu operador logístico China-Venezuela puerta a puerta:\n` +
      `✈️ Aéreo Express: 24-48h Guangzhou → Caracas\n` +
      `🚢 Marítimo LCL/FCL: 25-35 días\n` +
      `🤖 Cotización instantánea con IA\n` +
      `📱 Tracking proactivo por WhatsApp\n` +
      `📄 Documentos aduanales automáticos\n\n` +
      `¿En qué te ayudo hoy?\n` +
      `1️⃣ Cotizar envío\n` +
      `2️⃣ Rastrear carga\n` +
      `3️⃣ Documentos aduana\n` +
      `4️⃣ Hablar con asesor`
    );
  } else {
    await sendMessage(from,
      `Gracias ${name}. Un asesor te responderá en breve.\n\n` +
      `Mientras tanto:\n` +
      `🌐 Web: tucargaexpress.com\n` +
      `📧 Email: info@tucargaexpress.com\n` +
      `📞 Tel: +1 (305) 677-2049`
    );
  }
}

async function handleInteractiveMessage(from: string, interactive: any, name: string) {
  if (interactive.type === "button_reply") {
    const id = interactive.button_reply.id;
    if (id === "cotizar") await handleTextMessage(from, "cotizar", name);
    if (id === "rastrear") await handleTextMessage(from, "rastrear", name);
    if (id === "documentos") await handleTextMessage(from, "documentos", name);
    if (id === "asesor") await sendMessage(from, `Perfecto ${name}, te conecto con un asesor humano 👨‍💼`);
  }
}

async function handleLocationMessage(from: string, location: any, name: string) {
  await sendMessage(from, `📍 Ubicación recibida. ¿Es el destino de entrega en Venezuela?`);
}

async function sendMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!token || !phoneId) {
    console.log(`[WhatsApp] Simulado → ${to}: ${text.substring(0, 80)}...`);
    return;
  }
  
  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
}
