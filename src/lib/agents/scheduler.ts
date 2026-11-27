import { runAutomationTick, type TickResult } from "./automation";
import { addEvent } from "./memory";

const INTERVALO_MS = 15 * 60 * 1000;
const ARRANQUE_MS = 30 * 1000;

type SchedulerGlobal = typeof globalThis & {
  __vbgScheduler?: { detener: () => void };
};

async function tick(origen: string) {
  try {
    const resultado: TickResult = await runAutomationTick();
    addEvent({
      agentId: "supervisor",
      tipo: "automatizacion",
      mensaje: `Tick ${origen}: ${resultado.ejecutadas} ejecutadas, ${resultado.fallidas} fallidas.`,
      nivel: resultado.fallidas > 0 ? "alerta" : "info",
      meta: { ...resultado },
    });
  } catch (error) {
    console.error("[scheduler] Error en el tick de automatización:", error);
  }
}

export function startScheduler(): void {
  const g = globalThis as SchedulerGlobal;
  if (g.__vbgScheduler) return;

  const arranque = setTimeout(() => void tick("arranque"), ARRANQUE_MS);
  const intervalo = setInterval(() => void tick("periodico"), INTERVALO_MS);
  intervalo.unref?.();
  arranque.unref?.();

  g.__vbgScheduler = {
    detener: () => {
      clearTimeout(arranque);
      clearInterval(intervalo);
      delete g.__vbgScheduler;
    },
  };

  console.log("[scheduler] Automatización de agentes activa (cada 15 minutos).");
}
