import { NextRequest, NextResponse } from "next/server";
import { runAutomationTick } from "@/lib/agents/automation";
import { hydrate, getSnapshot } from "@/lib/agents/memory";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const query = new URL(req.url).searchParams.get("secret") ?? "";
  return token === secret || query === secret;
}

async function handle(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const limitParam = new URL(req.url).searchParams.get("limit");
  const limite = Math.min(Math.max(Number(limitParam) || 12, 1), 50);

  try {
    const resultado = await runAutomationTick(limite);
    await hydrate();
    const snapshot = getSnapshot();

    return NextResponse.json({
      ok: true,
      ...resultado,
      cola: {
        pendientes: snapshot.tasks.filter((t) => t.estado === "pendiente").length,
        completadas: snapshot.tasks.filter((t) => t.estado === "completada").length,
        fallidas: snapshot.tasks.filter((t) => t.estado === "fallida").length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[automation] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Error ejecutando la automatización" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
