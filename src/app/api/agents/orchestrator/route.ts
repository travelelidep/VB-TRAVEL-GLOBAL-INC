import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isLLMEnabled } from "@/lib/ai/llm";
import { hydrate, getSnapshot } from "@/lib/agents/memory";
import { runOrchestrator } from "@/lib/agents/orchestrator";
import { AGENTS } from "@/lib/agents/registry";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  message: z.string().min(1).max(4000),
  agentId: z
    .enum(["supervisor", "cotizador", "documentos", "aduanas", "tracking", "atencion", "ventas", "marketing", "operaciones"])
    .optional(),
  canal: z.enum(["web", "whatsapp", "email", "interno"]).optional(),
  cliente: z
    .object({
      nombre: z.string().optional(),
      email: z.string().email().optional(),
      telefono: z.string().optional(),
      ciudad: z.string().optional(),
    })
    .optional(),
  contexto: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  await hydrate();
  const snapshot = getSnapshot();
  return NextResponse.json({
    ok: true,
    llm: isLLMEnabled(),
    persistencia: snapshot.persistence,
    agentes: AGENTS.map((agent) => ({
      id: agent.id,
      nombre: agent.nombre,
      rol: agent.rol,
      emoji: agent.emoji,
      descripcion: agent.descripcion,
      capacidades: agent.capacidades,
      herramientas: agent.herramientas,
      automatico: agent.automatico,
      metricas: snapshot.metrics[agent.id] ?? {
        ejecuciones: 0,
        conLLM: 0,
        deterministas: 0,
        latenciaTotalMs: 0,
        errores: 0,
      },
    })),
    resumen: {
      tareasPendientes: snapshot.tasks.filter((t) => t.estado === "pendiente").length,
      tareasCompletadas: snapshot.tasks.filter((t) => t.estado === "completada").length,
      leads: snapshot.leads.length,
      envios: snapshot.shipments.length,
    },
    tareas: snapshot.tasks.slice(0, 40),
    eventos: snapshot.events.slice(0, 40),
    leads: snapshot.leads.slice(0, 20),
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Solicitud inválida", detalles: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await runOrchestrator(parsed.data);

    return NextResponse.json({
      ok: true,
      agente: result.agentId,
      respuesta: result.reply,
      acciones: result.acciones,
      tareas: result.tareasCreadas,
      usadoLLM: result.usadoLLM,
      latenciaMs: result.latenciaMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[orchestrator] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del orquestador" },
      { status: 500 }
    );
  }
}
