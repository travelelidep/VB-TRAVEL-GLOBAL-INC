import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const quoteSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(10),
  empresa: z.string().optional(),
  tipoCarga: z.enum(["paqueteria", "carga_suelta", "paletizada", "contenedor"]),
  modalidad: z.enum(["aerea", "maritima"]),
  origen: z.string(),
  destino: z.string().min(2),
  peso: z.number().positive(),
  dimensiones: z.string().optional(),
  valor: z.number().positive(),
  contenido: z.string().min(3),
  notas: z.string().optional(),
});

type AirRate = { base: number; min: number; fuel: number; security: number };
type SeaRate = { base: number; min: number; fuel: number; thc: number; docs: number };
type Rate = AirRate | SeaRate;

// Tarifas basadas en mercado real Alibaba Logistics + flete Guangzhou→Venezuela 2024
const RATES: Record<"aerea" | "maritima", Rate> = {
  aerea: { base: 12.5, min: 50, fuel: 0.18, security: 0.05 },
  maritima: { base: 4.2, min: 250, fuel: 0.08, thc: 0.12, docs: 120 },
};

const DESTINATIONS: Record<string, { factor: number; daysAir: number; daysSea: number }> = {
  caracas: { factor: 1.0, daysAir: 2, daysSea: 28 },
  valencia: { factor: 1.05, daysAir: 2, daysSea: 30 },
  maracaibo: { factor: 1.15, daysAir: 3, daysSea: 32 },
  barquisimeto: { factor: 1.1, daysAir: 3, daysSea: 31 },
  "puerto ordaz": { factor: 1.25, daysAir: 3, daysSea: 35 },
  maturin: { factor: 1.2, daysAir: 3, daysSea: 33 },
  cumana: { factor: 1.2, daysAir: 3, daysSea: 33 },
  "san cristobal": { factor: 1.18, daysAir: 3, daysSea: 32 },
  merida: { factor: 1.15, daysAir: 3, daysSea: 32 },
};

function calculateVolumetricWeight(dims: string, pieces = 1): number {
  const match = dims.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 0;
  const [, l, w, h] = match.map(Number);
  return (l * w * h / 6000) * pieces;
}

function getAirRateByWeight(weight: number): number {
  // Tarifas escalonadas por volumen (kg facturable)
  if (weight <= 10) return 14.50;
  if (weight <= 50) return 12.80;
  if (weight <= 100) return 11.20;
  if (weight <= 300) return 9.80;
  return 8.50; // +300 kg tarifa corporativa
}

function getSeaRateByWeight(weight: number): number {
  // Tarifas LCL escalonadas
  if (weight <= 200) return 5.20;
  if (weight <= 500) return 4.50;
  if (weight <= 1000) return 3.90;
  if (weight <= 2000) return 3.40;
  return 3.00; // FCL equivalent
}

function generateQuote(data: z.infer<typeof quoteSchema>) {
  const destKey = data.destino.toLowerCase().replace(/[^a-z]/g, "");
  const dest = DESTINATIONS[destKey] || { factor: 1.2, daysAir: 3, daysSea: 35 };
  
  const volWeight = calculateVolumetricWeight(data.dimensiones || "");
  const chargeableWeight = Math.max(data.peso, volWeight);
  
  let breakdown: Record<string, number> = {};
  let total = 0;
  
  if (data.modalidad === "aerea") {
    const ratePerKg = getAirRateByWeight(chargeableWeight);
    const freight = chargeableWeight * ratePerKg * dest.factor;
    const fuel = freight * 0.18; // Fuel surcharge 18%
    const security = freight * 0.05; // Security charge 5%
    const handling = 35; // Manejo aeropuerto
    
    breakdown.flete = Math.round(freight * 100) / 100;
    breakdown.combustible = Math.round(fuel * 100) / 100;
    breakdown.seguridad = Math.round(security * 100) / 100;
    breakdown.manejo_aeropuerto = handling;
    
    total = freight + fuel + security + handling;
  } else {
    const ratePerKg = getSeaRateByWeight(chargeableWeight);
    const freight = chargeableWeight * ratePerKg * dest.factor;
    const thc = freight * 0.12; // THC origen + destino ~12%
    const docs = 120; // Documentación BL, CO, certificado origen
    const handling = data.tipoCarga === "contenedor" ? 350 : data.tipoCarga === "paletizada" ? 120 : 60;
    
    breakdown.flete = Math.round(freight * 100) / 100;
    breakdown.thc = Math.round(thc * 100) / 100;
    breakdown.documentacion = docs;
    breakdown.manejo = handling;
    
    total = freight + thc + docs + handling;
  }
  
  // Seguro todo riesgo (opcional pero recomendado) - 0.3% valor
  const insurance = data.valor * 0.003;
  breakdown.seguro = Math.round(insurance * 100) / 100;
  total += insurance;
  
  // Aduanas Venezuela: IVA 16% + Arancel promedio 10% = ~26% sobre CIF
  // CIF ≈ valor + flete + seguro
  const cif = data.valor + (data.modalidad === "aerea" ? breakdown.flete + breakdown.combustible + breakdown.seguridad : breakdown.flete + breakdown.thc) + insurance;
  const customs = cif * 0.26;
  breakdown.aduanas_iva_aranceles = Math.round(customs * 100) / 100;
  total += customs;
  
  // Entrega última milla Venezuela (incluida en tarifa base pero desglosada)
  const lastMile = data.modalidad === "aerea" ? 40 : 60;
  breakdown.entrega_ultima_milla = lastMile;
  total += lastMile;
  
  // Redondeo final
  const finalTotal = Math.round(total * 100) / 100;
  
  return {
    breakdown,
    total: finalTotal,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    volumetricWeight: Math.round(volWeight * 100) / 100,
    transitDays: data.modalidad === "aerea" ? dest.daysAir : dest.daysSea,
    modality: data.modalidad,
    route: `Guangzhou → ${data.destino}`,
    incoterm: "DDP Puerta a Puerta",
    validity: "7 días",
    insuranceIncluded: true,
    customsIncluded: true,
    ratePerKg: data.modalidad === "aerea" ? getAirRateByWeight(chargeableWeight) : getSeaRateByWeight(chargeableWeight),
    destFactor: dest.factor,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = quoteSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const quote = generateQuote(parsed.data);
    
    await new Promise(r => setTimeout(r, 500));
    
    return NextResponse.json({
      success: true,
      quote,
      quoteId: `VBG-Q-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      agent: "vb-cotizador-ia-v1",
    });
  } catch (error) {
    console.error("Cotizador error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
