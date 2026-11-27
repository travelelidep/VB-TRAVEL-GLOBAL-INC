"use client";

import { useEffect, useState } from "react";

interface Producto {
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

const ICONOS: Record<string, string> = {
  Electrónica: "fa-mobile-screen-button",
  Ropa: "fa-shirt",
  Calzado: "fa-shoe-prints",
  Hogar: "fa-couch",
  Belleza: "fa-spray-can-sparkles",
  Ferretería: "fa-screwdriver-wrench",
  Repuestos: "fa-gears",
  General: "fa-box",
};

const WHATSAPP = "https://wa.me/58416111157?text=Hola%2C%20busco%20un%20producto%20para%20importar%20desde%20China";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCargando(true);
      const params = new URLSearchParams();
      if (busqueda.trim()) params.set("q", busqueda.trim());
      if (categoria !== "Todas") params.set("categoria", categoria);

      try {
        const respuesta = await fetch(`/api/products?${params.toString()}`);
        const datos = await respuesta.json();
        setProductos(datos.productos ?? []);
        setCategorias(datos.categorias ?? []);
      } catch {
        setProductos([]);
      } finally {
        setCargando(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [busqueda, categoria]);

  const cotizar = (producto: Producto) => {
    const seleccion = {
      id: producto.id,
      titulo: producto.titulo,
      contenido: producto.titulo,
      precio: producto.precio,
      valorCarga: producto.precio != null ? String(producto.precio) : "",
      peso: producto.pesoKg != null ? `${producto.pesoKg} kg` : "",
      pesoKg: producto.pesoKg,
      dimensiones: producto.dimensiones,
      proveedor: producto.proveedor,
      supplier: producto.proveedor,
      origen: producto.origen,
      source: producto.origen,
      url: producto.url,
    };

    try {
      localStorage.setItem("vb_selected_product", JSON.stringify(seleccion));
    } catch {
      /* modo privado: el evento igual carga los datos */
    }

    window.dispatchEvent(new CustomEvent("vb:producto", { detail: seleccion }));
    setSeleccionado(producto.id);
    document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="productos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            Catálogo de importación
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Productos que traemos desde China
          </h2>
          <p className="text-lg text-slate-600">
            Busca el producto, elige la cantidad y cotiza el envío a Venezuela en un solo paso.
          </p>
        </div>

        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busca audífonos, gorras, ollas, repuestos..."
              aria-label="Buscar productos"
              className="w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-900"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Todas", ...categorias].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                categoria === c
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 text-slate-700 hover:border-orange-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="mt-12 text-center bg-slate-50 rounded-2xl p-10">
            <i className="fas fa-box-open text-4xl text-slate-300 mb-4" />
            <p className="text-slate-700 font-medium mb-2">No encontramos ese producto en el catálogo</p>
            <p className="text-slate-500 mb-6">
              Escríbenos y lo buscamos con nuestros proveedores en China.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-orange-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <i
                      className={`fas ${ICONOS[producto.categoria] ?? ICONOS.General} text-orange-500 text-lg`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {producto.categoria}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[3rem]">
                  {producto.titulo}
                </h3>

                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-900">
                    {producto.precio != null ? `$${producto.precio.toFixed(2)}` : "Consultar"}
                  </p>
                  <p className="text-xs text-slate-500">FOB China, por unidad</p>
                </div>

                <dl className="mt-4 space-y-1.5 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Mínimo</dt>
                    <dd className="font-medium text-right">{producto.moq}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Peso</dt>
                    <dd className="font-medium text-right">
                      {producto.pesoKg != null ? `${producto.pesoKg} kg` : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Origen</dt>
                    <dd className="font-medium text-right truncate">{producto.proveedor}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => cotizar(producto)}
                  className={`mt-5 w-full py-3 rounded-xl font-semibold transition-all ${
                    seleccionado === producto.id
                      ? "bg-green-600 text-white"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {seleccionado === producto.id ? (
                    <>
                      <i className="fas fa-check mr-2" />
                      Cargado en el cotizador
                    </>
                  ) : (
                    <>
                      <i className="fas fa-calculator mr-2" />
                      Cotizar este producto
                    </>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-slate-500">
          Precios de referencia FOB China. El costo final incluye flete, aduana y entrega en
          Venezuela; un asesor te lo confirma al cotizar.
        </p>
      </div>
    </section>
  );
}
