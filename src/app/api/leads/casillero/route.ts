import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { programarBienvenidaCasillero } from "@/lib/agents/automation";
import { addEvent, addLeadNote, hydrate, upsertLead } from "@/lib/agents/memory";

export const dynamic = "force-dynamic";

const casilleroSchema = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email(),
  telefono: z.string().min(7).max(30),
  direccion: z.string().min(3).max(200),
  codigoPostal: z.string().min(2).max(20),
  ciudad: z.string().min(2).max(80),
  estado: z.string().min(2).max(80),
});

const DIRECCION_CHINA = {
  ciudad: "Guangzhou",
  provincia: "Guangdong",
  pais: "China",
  codigoPostal: "510000",
  telefonoReferencia: "+86 020 8888 1111",
};

function generarCodigo(nombre: string): string {
  const iniciales = nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VBG-${iniciales || "CL"}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    await hydrate();
    const parsed = casilleroSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos", detalles: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const codigo = generarCodigo(data.nombre);

    const lead = upsertLead({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      ciudad: data.ciudad,
      estado: data.estado,
      origen: "web-casillero",
      interes: "apertura de casillero",
      agentId: "atencion",
    });

    addLeadNote(lead.id, `Casillero ${codigo} solicitado desde la web (${data.ciudad}, ${data.estado}).`);

    const tareas = programarBienvenidaCasillero({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      ciudad: data.ciudad,
      estado: data.estado,
    });

    addEvent({
      agentId: "atencion",
      tipo: "casillero_solicitado",
      mensaje: `Nuevo casillero ${codigo} para ${data.nombre} (${data.ciudad})`,
      nivel: "exito",
      meta: { leadId: lead.id, codigo },
    });

    return NextResponse.json({
      ok: true,
      codigo,
      leadId: lead.id,
      tareas,
      direccionChina: {
        ...DIRECCION_CHINA,
        destinatario: `${data.nombre} ${codigo}`,
        direccion: `Bodega VB Travel Global, ${data.ciudad}/${data.estado} → consolidación`,
      },
      mensaje:
        "Casillero creado. El agente de atención enviará la dirección en Guangzhou y las etiquetas por WhatsApp.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[casillero] Error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear el casillero" },
      { status: 500 }
    );
  }
}
