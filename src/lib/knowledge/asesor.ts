import { chat, isLLMEnabled } from "@/lib/ai/llm";
import { BASE_CONOCIMIENTO, GLOSARIO } from "./base";
import type {
  EntradaConocimiento,
  FuenteRespuesta,
  RespuestaAsesor,
  TerminoGlosario,
} from "./tipos";

const STOPWORDS = new Set([
  "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "que", "y", "o", "u",
  "en", "para", "por", "con", "sin", "del", "al", "es", "son", "se", "su", "sus",
  "mi", "mis", "tu", "tus", "como", "cuanto", "cuanta", "cuantos", "cuantas",
  "cuando", "donde", "hay", "puedo", "puede", "necesito", "necesita",
  "quiero", "saber", "sobre", "mas", "me", "te", "le", "lo", "si", "no", "ya",
  "muy", "tambien", "tiene", "tengo", "hacer", "esta", "este", "esto", "eso",
  "esa", "esos", "esas", "ser", "cual", "cuales", "algun", "alguna",
  "favor", "gracias", "hola", "buenas", "dias", "tardes", "noches",
]);

const ALIAS: Record<string, string> = {
  documentos: "documento", documentacion: "documento", papeles: "documento",
  requisitos: "requisito", requisito: "documento", tramites: "tramite",
  impuestos: "arancel", impuesto: "arancel", tributos: "arancel", tributo: "arancel",
  courier: "casillero", buzon: "casillero",
  facturas: "factura", invoice: "factura",
  permisos: "permiso", autorizacion: "permiso", licencia: "permiso", registro: "permiso",
  marcas: "marca", replica: "marca", replicas: "marca", falsificacion: "marca", pirata: "marca",
  envio: "transporte", envios: "transporte", flete: "transporte", carga: "transporte",
  kilos: "peso", kg: "peso", volumetrico: "peso",
  poliza: "seguro", cobertura: "seguro",
  demora: "tiempo", demoran: "tiempo", tarda: "tiempo", dias: "tiempo", transito: "tiempo",
  costo: "precio", costos: "precio", tarifa: "precio", cuesta: "precio", vale: "precio",
  baterias: "bateria", litio: "bateria", power: "bateria", bank: "bateria",
  prohibido: "prohibid", prohibida: "prohibid", prohibidos: "prohibid", prohibidas: "prohibid",
  seniat: "venezuela", aduanas: "aduana", aduanero: "aduana", aduanera: "aduana",
  gacc: "china", chinas: "china", chino: "china",
  guia: "awb", aerea: "awb", air: "awb", waybill: "awb",
  conocimiento: "bl", lading: "bl", bill: "bl",
  contenedor: "fcl", grupaje: "lcl", consolidado: "consolidacion",
  declarar: "declar", declaro: "declar", declaramos: "declar", declara: "declar",
};

const PREGUNTAS_SUGERIDAS = [
  "¿Qué documentos necesito para importar desde China?",
  "¿Qué impuestos pago al llegar a Venezuela?",
  "¿Aéreo o marítimo, qué me conviene?",
  "¿Puedo importar baterías de litio?",
  "¿Qué es un BL y para qué sirve?",
  "¿Qué productos están prohibidos?",
];

const PIDE_DEFINICION = /\b(que es|que significa|significa|definicion|define|glosario|termino)\b/;

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenizar(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9.]+/)
    .map((token) => token.replace(/^\.+|\.+$/g, ""))
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map((token) => ALIAS[token] ?? token);
}

function contieneToken(aguja: string, pajar: string): boolean {
  if (aguja.length <= 3) {
    return new RegExp(`\\b${aguja.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(pajar);
  }
  return pajar.includes(aguja);
}

interface Documento {
  entrada: EntradaConocimiento;
  titulo: string;
  claves: string;
  cuerpo: string;
}

const DOCUMENTOS: Documento[] = BASE_CONOCIMIENTO.map((entrada) => ({
  entrada,
  titulo: normalizar(entrada.titulo),
  claves: normalizar(entrada.claves.join(" ")),
  cuerpo: normalizar([entrada.resumen, ...entrada.detalle].join(" ")),
}));

const FRECUENCIA = new Map<string, number>();
for (const documento of DOCUMENTOS) {
  const vistos = new Set(tokenizar(`${documento.claves} ${documento.titulo}`));
  for (const token of vistos) {
    FRECUENCIA.set(token, (FRECUENCIA.get(token) ?? 0) + 1);
  }
}

/** Un token presente en casi todas las entradas (china, importar) pesa menos. */
function pesoInverso(token: string): number {
  const frecuencia = FRECUENCIA.get(token) ?? 0;
  return Math.log(1 + DOCUMENTOS.length / (1 + frecuencia));
}

function puntuar(documento: Documento, tokens: string[], frase: string): number {
  let puntaje = 0;

  for (const token of tokens) {
    const peso = pesoInverso(token);
    if (contieneToken(token, documento.titulo)) puntaje += 4 * peso;
    if (contieneToken(token, documento.claves)) puntaje += 3 * peso;
    if (contieneToken(token, documento.cuerpo)) puntaje += 1 * peso;
  }

  if (frase.length > 8 && (documento.titulo.includes(frase) || documento.claves.includes(frase))) {
    puntaje += 6;
  }

  return puntaje;
}

export interface ResultadoConocimiento {
  entradas: EntradaConocimiento[];
  glosario: TerminoGlosario[];
}

export function buscarConocimiento(consulta: string, limite = 3): ResultadoConocimiento {
  const tokens = tokenizar(consulta);
  if (tokens.length === 0) return { entradas: [], glosario: [] };

  const frase = normalizar(consulta).trim();
  const puntuados = DOCUMENTOS.map((documento) => ({
    entrada: documento.entrada,
    puntaje: puntuar(documento, tokens, frase),
  })).sort((a, b) => b.puntaje - a.puntaje);

  const mejor = puntuados[0]?.puntaje ?? 0;
  const entradas =
    mejor < 5
      ? []
      : puntuados
          .filter((item) => item.puntaje >= Math.max(5, mejor * 0.55))
          .slice(0, limite)
          .map((item) => item.entrada);

  const consultaNormalizada = normalizar(consulta);
  const pideDefinicion = PIDE_DEFINICION.test(consultaNormalizada);

  const glosario =
    pideDefinicion || entradas.length === 0
      ? GLOSARIO.filter((termino) => {
          const nombre = normalizar(termino.termino);
          const claves = normalizar(termino.claves.join(" "));
          return tokens.some(
            (token) => contieneToken(token, nombre) || contieneToken(token, claves)
          );
        }).slice(0, 2)
      : GLOSARIO.filter((termino) =>
          consultaNormalizada.includes(normalizar(termino.termino))
        ).slice(0, 1);

  return { entradas, glosario };
}

function fuentesDe(
  entradas: EntradaConocimiento[],
  glosario: TerminoGlosario[]
): FuenteRespuesta[] {
  return [
    ...entradas.map((entrada) => ({
      id: entrada.id,
      titulo: entrada.titulo,
      categoria: entrada.categoria,
    })),
    ...glosario.map((termino) => ({
      id: `glosario-${normalizar(termino.termino)}`,
      titulo: termino.termino,
      categoria: "Glosario" as const,
    })),
  ];
}

function menu(): RespuestaAsesor {
  return {
    respuesta:
      "Puedo asesorarte sobre importar desde China a Venezuela. Dime el tema y te respondo con detalle:\n\n" +
      "• 📄 Documentos y trámites de importación\n" +
      "• 💰 Aranceles, IVA e impuestos de aduana\n" +
      "• 🚢 Aéreo o marítimo, tiempos y costos\n" +
      "• ⚠️ Productos prohibidos, restringidos y baterías\n" +
      "• 🏷️ Factura comercial, packing list, BL y AWB\n" +
      "• 🏛️ Leyes y organismos de China y Venezuela\n\n" +
      "Si tu caso es específico, escríbenos por WhatsApp al +58 416 111157 y un asesor lo revisa.",
    fuentes: [],
    sugerencias: PREGUNTAS_SUGERIDAS.slice(0, 4),
    origen: "base",
  };
}

const AVISO =
  "_Información general, no asesoría legal: las normas y alícuotas cambian. Confírmalo con SENIAT, la aduana china (GACC) o tu agente aduanal._";

function componerDesdeBase(
  entradas: EntradaConocimiento[],
  glosario: TerminoGlosario[]
): RespuestaAsesor {
  const partes: string[] = [];

  if (entradas.length === 0) {
    partes.push(
      glosario.map((termino) => `**${termino.termino}**: ${termino.definicion}`).join("\n\n")
    );
    partes.push(AVISO);
    return {
      respuesta: partes.join("\n\n"),
      fuentes: fuentesDe(entradas, glosario),
      sugerencias: PREGUNTAS_SUGERIDAS.slice(0, 3),
      origen: "base",
    };
  }

  const principal = entradas[0];
  partes.push(`**${principal.titulo}**\n${principal.resumen}`);
  partes.push(principal.detalle.map((punto) => `• ${punto}`).join("\n"));

  const relacionadas = entradas.slice(1);
  if (relacionadas.length > 0) {
    partes.push(
      `También te puede servir:\n${relacionadas.map((entrada) => `• ${entrada.titulo}`).join("\n")}`
    );
  }

  if (glosario.length > 0) {
    partes.push(
      `Definición: ${glosario
        .map((termino) => `**${termino.termino}** — ${termino.definicion}`)
        .join(" ")}`
    );
  }

  const fuentes = Array.from(
    new Set([...(principal.fuentes ?? []), ...relacionadas.flatMap((e) => e.fuentes ?? [])])
  );
  if (fuentes.length > 0) {
    partes.push(`Fuentes: ${fuentes.join(" · ")}.`);
  }

  partes.push(AVISO);

  return {
    respuesta: partes.join("\n\n"),
    fuentes: fuentesDe(entradas, glosario),
    sugerencias: PREGUNTAS_SUGERIDAS.filter(
      (pregunta) =>
        !entradas.some((entrada) =>
          normalizar(pregunta).includes(normalizar(entrada.titulo.slice(0, 12)))
        )
    ).slice(0, 3),
    origen: "base",
  };
}

const PROMPT_SISTEMA = `Eres el asesor de importación de VB TRAVEL GLOBAL INC (casillero y carga China → Venezuela).
Respondes en español, con tono profesional y cercano, en máximo 180 palabras.

Reglas:
- Usa SOLO la documentación entregada. Si el dato no está, dilo y ofrece WhatsApp +58 416 111157.
- No inventes alícuotas, plazos ni requisitos. Si la norma puede haber cambiado, aclara que se confirme con SENIAT, GACC o el agente aduanal.
- Estructura: respuesta directa, luego 2-4 puntos clave con viñetas.
- Cierra con una pregunta útil o una invitación a cotizar, sin sonar insistente.`;

export async function responderAsesor(consulta: string): Promise<RespuestaAsesor> {
  const { entradas, glosario } = buscarConocimiento(consulta);

  if (entradas.length === 0 && glosario.length === 0) {
    return menu();
  }

  if (isLLMEnabled()) {
    const contexto = entradas
      .map(
        (entrada) =>
          `## ${entrada.titulo} (${entrada.categoria})\n${entrada.resumen}\n${entrada.detalle
            .map((punto) => `- ${punto}`)
            .join("\n")}${entrada.fuentes?.length ? `\nFuentes: ${entrada.fuentes.join(", ")}` : ""}`
      )
      .join("\n\n");

    const glosarioTexto = glosario
      .map((termino) => `${termino.termino}: ${termino.definicion}`)
      .join("\n");

    const respuesta = await chat(
      [
        { role: "system", content: PROMPT_SISTEMA },
        {
          role: "user",
          content: `Documentación:\n${contexto}${glosarioTexto ? `\n\nGlosario:\n${glosarioTexto}` : ""}\n\nPregunta del cliente: ${consulta}`,
        },
      ],
      { temperature: 0.2, maxTokens: 600, timeoutMs: 15000 }
    );

    if (respuesta) {
      return {
        respuesta,
        fuentes: fuentesDe(entradas, glosario),
        sugerencias: PREGUNTAS_SUGERIDAS.slice(0, 3),
        origen: "ia",
      };
    }
  }

  return componerDesdeBase(entradas, glosario);
}

export function temasDisponibles(): { categoria: string; titulo: string }[] {
  return BASE_CONOCIMIENTO.map((entrada) => ({
    categoria: entrada.categoria,
    titulo: entrada.titulo,
  }));
}

export { PREGUNTAS_SUGERIDAS };
