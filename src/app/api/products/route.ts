import { NextRequest } from "next/server";
import { buscarProductos, categoriasDisponibles } from "@/lib/products/fuente";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limite = Number(searchParams.get("limit") ?? 24);

  try {
    const resultado = await buscarProductos({
      q: searchParams.get("q") ?? undefined,
      categoria: searchParams.get("categoria") ?? undefined,
      limite: Number.isFinite(limite) ? limite : 24,
    });

    return Response.json({ ...resultado, categorias: categoriasDisponibles() });
  } catch (error) {
    console.error("Error buscando productos:", error);
    return Response.json(
      { productos: [], fuente: "catalogo", total: 0, categorias: categoriasDisponibles(), error: true },
      { status: 200 }
    );
  }
}
