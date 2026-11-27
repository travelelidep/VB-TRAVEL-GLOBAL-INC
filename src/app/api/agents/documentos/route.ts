import { NextRequest, NextResponse } from "next/server";
import { addEvent, createTask, hydrate } from "@/lib/agents/memory";
import { docsSchema, generateDocumentPack } from "@/lib/documents";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await hydrate();
    const parsed = docsSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", detalles: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pack = generateDocumentPack(parsed.data);

    const tarea = createTask({
      agentId: "documentos",
      tipo: "revision_documental",
      titulo: `Revisar documentos de embarque a ${parsed.data.destino}`,
      payload: { ...parsed.data },
      prioridad: pack.especiales.length > 0 ? "alta" : "media",
      delayMinutes: 120,
    });

    addEvent({
      agentId: "documentos",
      tipo: "checklist_generado",
      mensaje: `Checklist ${parsed.data.modalidad} para ${parsed.data.destino} (${pack.especiales.length} requisitos especiales)`,
      nivel: pack.especiales.length > 0 ? "alerta" : "exito",
    });

    return NextResponse.json({
      success: true,
      documents: {
        internacionales: pack.internacionales,
        venezuela: pack.venezuela,
        especiales: pack.especiales,
      },
      checklist: pack.checklist,
      agent: "documentos",
      tarea: { id: tarea.id, programada: tarea.dueAt },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[documentos] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
