import { NextRequest } from "next/server";
import { responderAsesor, PREGUNTAS_SUGERIDAS } from "@/lib/knowledge/asesor";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ sugerencias: PREGUNTAS_SUGERIDAS });
}

export async function POST(request: NextRequest) {
  let cuerpo: { mensaje?: unknown };

  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const mensaje = typeof cuerpo.mensaje === "string" ? cuerpo.mensaje.trim() : "";

  if (mensaje.length < 2) {
    return Response.json({ error: "Escribe una pregunta" }, { status: 400 });
  }
  if (mensaje.length > 600) {
    return Response.json({ error: "La pregunta es demasiado larga" }, { status: 400 });
  }

  try {
    const resultado = await responderAsesor(mensaje);
    return Response.json(resultado);
  } catch (error) {
    console.error("Error en el asesor:", error);
    return Response.json(
      {
        respuesta:
          "No pude consultar la base en este momento. Escríbenos por WhatsApp al +58 416 111157 y te atendemos de inmediato.",
        fuentes: [],
        sugerencias: PREGUNTAS_SUGERIDAS.slice(0, 3),
        origen: "base",
      },
      { status: 200 }
    );
  }
}
