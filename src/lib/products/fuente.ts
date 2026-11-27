import { CATALOGO } from "./catalogo";
import type { Producto, ResultadoProductos } from "./tipos";

export interface OpcionesBusqueda {
  q?: string;
  categoria?: string;
  limite?: number;
}

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

function coincide(producto: Producto, termino: string): boolean {
  const t = normalizar(termino);
  return [producto.titulo, producto.categoria, producto.proveedor, producto.origen].some((campo) =>
    normalizar(campo).includes(t)
  );
}

function aProducto(fila: Record<string, unknown>): Producto | null {
  const titulo = String(fila.titulo ?? fila.title ?? fila.name ?? "").trim();
  if (!titulo) return null;

  const precioCrudo = fila.precio ?? fila.price ?? fila.unit_price;
  const precio = Number(precioCrudo);

  const pesoCrudo = fila.pesoKg ?? fila.peso ?? fila.weight;
  const pesoKg = Number(pesoCrudo);

  return {
    id: String(fila.id ?? fila.product_id ?? titulo.slice(0, 40)),
    titulo,
    categoria: String(fila.categoria ?? fila.category ?? "General"),
    precio: Number.isFinite(precio) && precio > 0 ? precio : null,
    moq: String(fila.moq ?? fila.min_order ?? "Consultar"),
    pesoKg: Number.isFinite(pesoKg) && pesoKg > 0 ? pesoKg : null,
    dimensiones: fila.dimensiones ? String(fila.dimensiones) : null,
    proveedor: String(fila.proveedor ?? fila.supplier ?? fila.origin ?? "China"),
    origen: String(fila.origen ?? fila.source ?? "Alibaba"),
    url: fila.url ? String(fila.url) : null,
  };
}

async function buscarRemoto(opciones: OpcionesBusqueda): Promise<Producto[] | null> {
  const base = process.env.PRODUCTOS_API_URL;
  if (!base) return null;

  const destino = new URL(base);
  if (opciones.q) destino.searchParams.set("q", opciones.q);
  if (opciones.categoria) destino.searchParams.set("categoria", opciones.categoria);
  destino.searchParams.set("limit", String(opciones.limite ?? 24));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const respuesta = await fetch(destino, {
      headers: process.env.PRODUCTOS_API_KEY
        ? { Authorization: `Bearer ${process.env.PRODUCTOS_API_KEY}` }
        : {},
      signal: controller.signal,
      cache: "no-store",
    });
    if (!respuesta.ok) return null;

    const datos = await respuesta.json();
    const filas: unknown[] = Array.isArray(datos)
      ? datos
      : datos.productos ?? datos.items ?? datos.data ?? [];

    return filas
      .map((fila) => (fila && typeof fila === "object" ? aProducto(fila as Record<string, unknown>) : null))
      .filter((p): p is Producto => p !== null);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function buscarProductos(opciones: OpcionesBusqueda = {}): Promise<ResultadoProductos> {
  const limite = Math.min(Math.max(opciones.limite ?? 24, 1), 60);

  const remoto = await buscarRemoto({ ...opciones, limite });
  if (remoto) {
    return { productos: remoto.slice(0, limite), fuente: "remoto", total: remoto.length };
  }

  let productos = CATALOGO;
  if (opciones.categoria) {
    productos = productos.filter(
      (p) => normalizar(p.categoria) === normalizar(opciones.categoria as string)
    );
  }
  if (opciones.q) {
    productos = productos.filter((p) => coincide(p, opciones.q as string));
  }

  return {
    productos: productos.slice(0, limite),
    fuente: "catalogo",
    total: productos.length,
  };
}

export function categoriasDisponibles(): string[] {
  return Array.from(new Set(CATALOGO.map((p) => p.categoria))).sort();
}
