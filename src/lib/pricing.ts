import { z } from "zod";

export const quoteSchema = z.object({
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
  piezas: z.number().int().positive().optional(),
  valor: z.number().positive(),
  contenido: z.string().min(3),
  notas: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

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

export function calculateVolumetricWeight(dims: string, pieces = 1): number {
  const match = dims.match(
    /(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i
  );
  if (!match) return 0;
  const [, l, w, h] = match.map(Number);
  return (l * w * h) / 6000 * pieces;
}

export function getAirRateByWeight(weight: number): number {
  if (weight <= 10) return 14.5;
  if (weight <= 50) return 12.8;
  if (weight <= 100) return 11.2;
  if (weight <= 300) return 9.8;
  return 8.5;
}

export function getSeaRateByWeight(weight: number): number {
  if (weight <= 200) return 5.2;
  if (weight <= 500) return 4.5;
  if (weight <= 1000) return 3.9;
  if (weight <= 2000) return 3.4;
  return 3.0;
}

export interface QuoteResult {
  breakdown: Record<string, number>;
  total: number;
  chargeableWeight: number;
  volumetricWeight: number;
  transitDays: number;
  modality: "aerea" | "maritima";
  route: string;
  incoterm: string;
  validity: string;
  insuranceIncluded: boolean;
  customsIncluded: boolean;
  ratePerKg: number;
  destFactor: number;
  moneda: "USD";
}

function normalizarCiudad(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const DESTINATIONS_NORMALIZADAS = new Map(
  Object.entries(DESTINATIONS).map(([ciudad, datos]) => [normalizarCiudad(ciudad), datos])
);

export function generateQuote(data: QuoteInput): QuoteResult {
  const dest = DESTINATIONS_NORMALIZADAS.get(normalizarCiudad(data.destino)) || {
    factor: 1.2,
    daysAir: 3,
    daysSea: 35,
  };

  const volWeight = calculateVolumetricWeight(data.dimensiones || "", data.piezas ?? 1);
  const chargeableWeight = Math.max(data.peso, volWeight);

  const breakdown: Record<string, number> = {};
  let total = 0;

  if (data.modalidad === "aerea") {
    const ratePerKg = getAirRateByWeight(chargeableWeight);
    const freight = chargeableWeight * ratePerKg * dest.factor;
    const fuel = freight * 0.18;
    const security = freight * 0.05;
    const handling = 35;

    breakdown.flete = Math.round(freight * 100) / 100;
    breakdown.combustible = Math.round(fuel * 100) / 100;
    breakdown.seguridad = Math.round(security * 100) / 100;
    breakdown.manejo_aeropuerto = handling;

    total = freight + fuel + security + handling;
  } else {
    const ratePerKg = getSeaRateByWeight(chargeableWeight);
    const freight = chargeableWeight * ratePerKg * dest.factor;
    const thc = freight * 0.12;
    const docs = 120;
    const handling =
      data.tipoCarga === "contenedor" ? 350 : data.tipoCarga === "paletizada" ? 120 : 60;

    breakdown.flete = Math.round(freight * 100) / 100;
    breakdown.thc = Math.round(thc * 100) / 100;
    breakdown.documentacion = docs;
    breakdown.manejo = handling;

    total = freight + thc + docs + handling;
  }

  const insurance = data.valor * 0.003;
  breakdown.seguro = Math.round(insurance * 100) / 100;
  total += insurance;

  const cif =
    data.valor +
    (data.modalidad === "aerea"
      ? breakdown.flete + breakdown.combustible + breakdown.seguridad
      : breakdown.flete + breakdown.thc) +
    insurance;
  const customs = cif * 0.26;
  breakdown.aduanas_iva_aranceles = Math.round(customs * 100) / 100;
  total += customs;

  const lastMile = data.modalidad === "aerea" ? 40 : 60;
  breakdown.entrega_ultima_milla = lastMile;
  total += lastMile;

  return {
    breakdown,
    total: Math.round(total * 100) / 100,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    volumetricWeight: Math.round(volWeight * 100) / 100,
    transitDays: data.modalidad === "aerea" ? dest.daysAir : dest.daysSea,
    modality: data.modalidad,
    route: `${data.origen} → ${data.destino}`,
    incoterm: "DDP Puerta a Puerta",
    validity: "7 días",
    insuranceIncluded: true,
    customsIncluded: true,
    ratePerKg:
      data.modalidad === "aerea"
        ? getAirRateByWeight(chargeableWeight)
        : getSeaRateByWeight(chargeableWeight),
    destFactor: dest.factor,
    moneda: "USD",
  };
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
