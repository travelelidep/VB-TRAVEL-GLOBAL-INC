import { NextResponse } from "next/server";
import { isLLMEnabled, getLLMConfig } from "@/lib/ai/llm";
import { getSnapshot, hydrate, persistenceEnabled } from "@/lib/agents/memory";

export const dynamic = "force-dynamic";

export async function GET() {
  await hydrate();
  const snapshot = getSnapshot();
  const llm = getLLMConfig();

  return NextResponse.json(
    {
      status: "ok",
      service: "vb-travel-global",
      version: process.env.APP_VERSION ?? "1.0.0",
      uptimeSegundos: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        llm: {
          habilitado: isLLMEnabled(),
          modelo: llm?.model ?? null,
          proveedor: llm ? new URL(llm.baseUrl).host : null,
        },
        persistencia: persistenceEnabled() ? "redis" : "memoria",
        whatsapp: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
        email: Boolean(process.env.RESEND_API_KEY),
      },
      agentes: {
        tareasPendientes: snapshot.tasks.filter((t) => t.estado === "pendiente").length,
        tareasCompletadas: snapshot.tasks.filter((t) => t.estado === "completada").length,
        leads: snapshot.leads.length,
        envios: snapshot.shipments.length,
        eventos: snapshot.events.length,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
