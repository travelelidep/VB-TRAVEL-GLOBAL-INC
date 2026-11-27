export interface Producto {
  id: string;
  titulo: string;
  categoria: string;
  precio: number | null;
  moq: string;
  pesoKg: number | null;
  dimensiones: string | null;
  proveedor: string;
  origen: string;
  url: string | null;
}

export interface ResultadoProductos {
  productos: Producto[];
  fuente: "catalogo" | "remoto";
  total: number;
}
