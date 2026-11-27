import { NextResponse } from "next/server";
import { runAutomationTick } from "@/lib/agents/automation";
import { getSnapshot, hydrate } from "@/lib/agents/memory";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ENFRIAMIENTO_MS = 10_000;
let ultimaEjecucion = 0;

/**
 * Disparo manual desde el panel /agentes. Solo procesa tareas ya vencidas y
 * aplica un enfriamiento por instancia para evitar abuso del endpoint público.
 */
export async function POST() {
  const ahora = Date.now();
  if (ahora - ultimaEjecucion < ENFRIAMIENTO_MS) {
    return NextResponse.json(
      { ok: false, error: "La automatización acaba de ejecutarse; espera unos segundos." },
      { status: 429 }
    );
  }
  ultimaEjecucion = ahora;

  try {
    await hydrate();
    const resultado = await runAutomationTick(12);
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
    console.error("[agents/tick] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Error ejecutando la automatización" },
      { status: 500 }
    );
  }
}
