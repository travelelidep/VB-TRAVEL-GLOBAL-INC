"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Shipment {
  id: string;
  tracking: string;
  status: string;
  origin: string;
  destination: string;
  modality: string;
  weight: number;
  value: number;
  createdAt: string;
  eta: string;
  currentLocation: string;
  progress: number;
}

const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    tracking: "TCE123456",
    status: "EN TRÁNSITO",
    origin: "Guangzhou, China",
    destination: "Caracas, Venezuela",
    modality: "Marítimo LCL",
    weight: 1250,
    value: 15400,
    createdAt: "2024-01-15",
    eta: "2024-02-14",
    currentLocation: "Puerto La Guaira",
    progress: 75,
  },
  {
    id: "SHP-002",
    tracking: "TCE789012",
    status: "EN REPARTO",
    origin: "Guangzhou, China",
    destination: "Valencia, Venezuela",
    modality: "Aéreo Express",
    weight: 45,
    value: 3200,
    createdAt: "2024-01-20",
    eta: "2024-01-22",
    currentLocation: "Caracas - Última milla",
    progress: 90,
  },
  {
    id: "SHP-003",
    tracking: "TCE345678",
    status: "EN ALMACÉN ORIGEN",
    origin: "Shenzhen, China",
    destination: "Maracaibo, Venezuela",
    modality: "Marítimo FCL",
    weight: 18500,
    value: 85000,
    createdAt: "2024-01-25",
    eta: "2024-03-01",
    currentLocation: "Almacén TuCargaExpress Shenzhen",
    progress: 10,
  },
];

const STATUS_COLORS: Record<string, string> = {
  "EN ALMACÉN ORIGEN": "bg-blue-100 text-blue-700",
  "CONSOLIDADO": "bg-indigo-100 text-indigo-700",
  "DESPACHO ADUANAL CHINA": "bg-yellow-100 text-yellow-700",
  "EMBARCADO": "bg-purple-100 text-purple-700",
  "EN TRÁNSITO": "bg-sky-100 text-sky-700",
  "LLEGADA PUERTO": "bg-orange-100 text-orange-700",
  "DESPACHO ADUANAL VENEZUELA": "bg-amber-100 text-amber-700",
  "EN TRÁNSITO NACIONAL": "bg-teal-100 text-teal-700",
  "EN REPARTO": "bg-pink-100 text-pink-700",
  "ENTREGADO": "bg-green-100 text-green-700",
};

export default function EnviosPage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = shipments.filter(s => {
    const matchesSearch = s.tracking.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statuses = [...new Set(shipments.map(s => s.status))];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-slate-900">TuCargaExpress</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/portal/envios" className="text-orange-500 font-semibold">Mis Envíos</Link>
                <Link href="/portal/documentos" className="text-slate-600 hover:text-slate-900">Documentos</Link>
                <Link href="/portal/pagos" className="text-slate-600 hover:text-slate-900">Pagos</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Juan Pérez</span>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mis Envíos</h1>
            <p className="text-slate-500 mt-1">Gestiona y rastrea todos tus envíos China-Venezuela</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="#" className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Envío
            </Link>
            <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por guía, destino, contenido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white min-w-[200px]"
            >
              <option value="all">Todos los estados</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Shipments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((shipment) => (
            <article key={shipment.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Status Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[shipment.status] || "bg-slate-100 text-slate-700"}`}>
                  {shipment.status}
                </span>
                <span className="text-sm text-slate-500 font-mono">{shipment.tracking}</span>
              </div>

              {/* Progress */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progreso</span>
                  <span className="text-sm font-bold text-orange-500">{shipment.progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${shipment.progress}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={shipment.modality.includes("Aéreo") ? "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" : "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{shipment.modality}</p>
                    <p className="font-medium text-slate-900">{shipment.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Origen</p>
                    <p className="font-medium">{shipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Destino</p>
                    <p className="font-medium">{shipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Peso</p>
                    <p className="font-medium">{shipment.weight.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Valor</p>
                    <p className="font-medium">${shipment.value.toLocaleString()} USD</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm text-slate-500">Creado: {new Date(shipment.createdAt).toLocaleDateString("es-VE")}</p>
                  <p className="text-sm font-medium text-orange-500">ETA: {new Date(shipment.eta).toLocaleDateString("es-VE")}</p>
                  <p className="text-xs text-slate-400 mt-1">📍 {shipment.currentLocation}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2">
                <Link
                  href={`/rastreo?tracking=${shipment.tracking}`}
                  className="flex-1 text-center px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Rastrear
                </Link>
                <Link
                  href={`/portal/documentos?shipment=${shipment.id}`}
                  className="flex-1 text-center px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Documentos
                </Link>
                <button className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                  Chat
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700">No se encontraron envíos</h3>
              <p className="text-slate-500 mt-1">Intenta con otro filtro o búsqueda</p>
            </div>
          )}
        </div>

        {/* Empty State for new users */}
        {shipments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <svg className="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No tienes envíos aún</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Crea tu primer envío China-Venezuela y gestiona todo desde este portal.
            </p>
            <Link href="/#cotizador" className="inline-flex items-center gap-2 btn-primary px-8 py-4 rounded-xl font-bold text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Cotizar mi primer envío
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
