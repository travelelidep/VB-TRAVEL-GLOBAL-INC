import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const docsSchema = z.object({
  quoteId: z.string().optional(),
  tipoCarga: z.enum(["paqueteria", "carga_suelta", "paletizada", "contenedor"]),
  modalidad: z.enum(["aerea", "maritima"]),
  contenido: z.string(),
  valor: z.number().positive(),
  peso: z.number().positive(),
  origen: z.string(),
  destino: z.string(),
  incoterm: z.string().default("DDP"),
});

const DOCUMENTS = {
  aerea: [
    { code: "AWB", name: "Air Waybill", mandatory: true, description: "Contrato de transporte aéreo. Emitido por la aerolínea." },
    { code: "CI", name: "Commercial Invoice", mandatory: true, description: "Factura comercial con valor FOB, descripción, HS Code, país origen." },
    { code: "PL", name: "Packing List", mandatory: true, description: "Lista de empaque: bultos, peso bruto/neto, dimensiones por bulto." },
    { code: "CO", name: "Certificate of Origin", mandatory: false, description: "Certificado de origen (Formulario FTA China-Venezuela si aplica)." },
    { code: "DG", name: "Dangerous Goods Declaration", mandatory: false, description: "Requerido si carga IATA DGR (baterías, químicos, aerosoles)." },
    { code: "INS", name: "Insurance Certificate", mandatory: false, description: "Póliza de seguro todo riesgo (recomendado valor + 10%)." },
  ],
  maritima: [
    { code: "BL", name: "Bill of Lading", mandatory: true, description: "Conocimiento de embarque (Original o Telex Release)." },
    { code: "CI", name: "Commercial Invoice", mandatory: true, description: "Factura comercial con valor FOB, descripción, HS Code, país origen." },
    { code: "PL", name: "Packing List", mandatory: true, description: "Lista de empaque detallada por contenedor/bulto." },
    { code: "CO", name: "Certificate of Origin", mandatory: false, description: "Certificado de origen para preferencias arancelarias." },
    { code: "FUM", name: "Fumigation Certificate", mandatory: false, description: "Certificado de fumigación (madera, paletas, embalaje)." },
    { code: "INS", name: "Insurance Certificate", mandatory: false, description: "Póliza de seguro marítimo (ICC A/B/C)." },
    { code: "SOLAS", name: "VGM Certificate", mandatory: true, description: "Verified Gross Mass (peso verificado contenedor). Obligatorio SOLAS." },
  ],
};

const VENEZUELA_REQUIREMENTS = [
  { doc: "DUA", name: "Declaración Única de Aduana", authority: "SENIAT", timing: "Pre-arribo" },
  { doc: "LI", name: "Licencia de Importación", authority: "MINCOMERCIO", timing: "Pre-embarque (productos regulados)" },
  { doc: "RUC", name: "Registro Único de Contribuyente", authority: "SENIAT", timing: "Permanente" },
  { doc: "CERT_ORIGEN", name: "Certificado de Origen", authority: "Cámara Comercio", timing: "Pre-embarque" },
  { doc: "SANITARIO", name: "Certificado Sanitario/Fitosanitario", authority: "INSAI/INIA", timing: "Pre-embarque (alimentos, agro)" },
  { doc: "PHITO", name: "Certificado Fitosanitario", authority: "INIA", timing: "Pre-embarque (vegetales, madera)" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = docsSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const { modalidad, contenido, valor, tipoCarga } = parsed.data;
    
    const baseDocs = DOCUMENTS[modalidad].map(d => ({
      ...d,
      status: "pending",
      templateUrl: `/templates/${d.code.toLowerCase()}.pdf`,
      generated: false,
    }));
    
    const venezuelaDocs = VENEZUELA_REQUIREMENTS.map(d => ({
      code: d.doc,
      name: d.name,
      authority: d.authority,
      timing: d.timing,
      mandatory: ["DUA", "RUC"].includes(d.doc),
      status: "pending",
      description: `Requerido por ${d.authority} - ${d.timing}`,
    }));
    
    // IA: detectar documentos especiales según contenido
    const specialDocs = [];
    const contentLower = contenido.toLowerCase();
    
    if (contentLower.includes("bater") || contentLower.includes("pilas") || contentLower.includes("lithium")) {
      specialDocs.push({ code: "UN383", name: "UN38.3 Test Summary", mandatory: true, description: "Pruebas baterías litio (IATA)" });
    }
    if (contentLower.includes("alimento") || contentLower.includes("comida") || contentLower.includes("bebida")) {
      specialDocs.push({ code: "SANITARIO", name: "Certificado Sanitario Alimentos", mandatory: true, description: "MPPS/INSAI - Registro sanitario Venezuela" });
    }
    if (contentLower.includes("medicin") || contentLower.includes("farmaceu")) {
      specialDocs.push({ code: "PHARMA", name: "Licencia Importación Medicamentos", mandatory: true, description: "MPPS - Registro farmacéutico" });
    }
    if (contentLower.includes("madera") || contentLower.includes("palet") || tipoCarga === "paletizada") {
      specialDocs.push({ code: "NIMF15", name: "Tratamiento NIMF-15", mandatory: true, description: "Madera tratada térmicamente (IPPC)" });
    }
    if (valor > 5000) {
      specialDocs.push({ code: "VALOR", name: "Declaración de Valor", mandatory: true, description: "Valor > $5,000 USD requiere declaración jurada" });
    }
    
    await new Promise(r => setTimeout(r, 300));
    
    return NextResponse.json({
      success: true,
      documents: {
        internacionales: baseDocs,
        venezuela: venezuelaDocs,
        especiales: specialDocs,
      },
      checklist: [
        { step: 1, action: "Completar Commercial Invoice con HS Code 6 dígitos", done: false },
        { step: 2, action: "Generar Packing List coincidente con factura", done: false },
        { step: 3, action: modalidad === "maritima" ? "Obtener VGM (peso verificado contenedor)" : "Confirmar datos AWB con aerolínea", done: false },
        { step: 4, action: "Solicitar Certificado de Origen (Cámara Comercio)", done: false },
        { step: 5, action: "Preparar DUA Venezuela (SENIAT)", done: false },
        { step: 6, action: specialDocs.length > 0 ? `Gestionar ${specialDocs.length} documento(s) especial(es)` : "Verificar licencias de importación", done: false },
      ],
      agent: "documentos-ia-v1",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Documentos error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
