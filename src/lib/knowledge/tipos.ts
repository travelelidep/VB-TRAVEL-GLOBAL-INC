export type CategoriaConocimiento =
  | "China"
  | "Venezuela"
  | "Documentos"
  | "Transporte"
  | "Aduanas"
  | "Restricciones";

export interface EntradaConocimiento {
  id: string;
  categoria: CategoriaConocimiento;
  titulo: string;
  claves: string[];
  resumen: string;
  detalle: string[];
  fuentes?: string[];
  enlaces?: { titulo: string; url: string }[];
}

export interface TerminoGlosario {
  termino: string;
  definicion: string;
  claves: string[];
}

export interface FuenteRespuesta {
  id: string;
  titulo: string;
  categoria: CategoriaConocimiento | "Glosario";
}

export interface RespuestaAsesor {
  respuesta: string;
  fuentes: FuenteRespuesta[];
  sugerencias: string[];
  origen: "base" | "ia";
}
