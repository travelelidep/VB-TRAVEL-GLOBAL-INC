"use client";
import { useState } from "react";
import Link from "next/link";

interface Document {
  id: string;
  code: string;
  name: string;
  category: "internacional" | "venezuela" | "especial";
  status: "pending" | "uploaded" | "approved" | "rejected" | "not_required";
  mandatory: boolean;
  description: string;
  templateUrl?: string;
  uploadedAt?: string;
  reviewedAt?: string;
  notes?: string;
}

const mockDocuments: Document[] = [
  { id: "1", code: "CI", name: "Commercial Invoice", category: "internacional", status: "approved", mandatory: true, description: "Factura comercial con HS Code, valor FOB, descripción detallada", templateUrl: "/templates/ci.pdf", uploadedAt: "2024-01-15", reviewedAt: "2024-01-16" },
  { id: "2", code: "PL", name: "Packing List", category: "internacional", status: "approved", mandatory: true, description: "Lista de empaque: bultos, peso bruto/neto, dimensiones", templateUrl: "/templates/pl.pdf", uploadedAt: "2024-01-15", reviewedAt: "2024-01-16" },
  { id: "3", code: "BL", name: "Bill of Lading", category: "internacional", status: "uploaded", mandatory: true, description: "Conocimiento de embarque original / Telex Release", uploadedAt: "2024-01-18" },
  { id: "4", code: "CO", name: "Certificate of Origin", category: "internacional", status: "pending", mandatory: false, description: "Certificado de origen Cámara Comercio China", templateUrl: "/templates/co.pdf" },
  { id: "5", code: "DUA", name: "Declaración Única de Aduana", category: "venezuela", status: "pending", mandatory: true, description: "DUA Venezuela - SENIAT (presentar pre-arribo)", templateUrl: "/templates/dua.pdf" },
  { id: "6", code: "RUC", name: "Registro Único de Contribuyente", category: "venezuela", status: "approved", mandatory: true, description: "RUC empresa importadora vigente", uploadedAt: "2024-01-10", reviewedAt: "2024-01-10" },
  { id: "7", code: "LI", name: "Licencia de Importación", category: "venezuela", status: "not_required", mandatory: false, description: "MINCOMERCIO - Solo productos regulados", notes: "No aplica para esta mercancía" },
  { id: "8", code: "UN383", name: "UN38.3 Test Summary", category: "especial", status: "pending", mandatory: true, description: "Pruebas baterías litio (IATA DGR)", templateUrl: "/templates/un383.pdf" },
  { id: "9", code: "NIMF15", name: "Tratamiento NIMF-15", category: "especial", status: "approved", mandatory: true, description: "Madera tratada térmicamente (paletas)", uploadedAt: "2024-01-14", reviewedAt: "2024-01-15" },
];

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-700" },
  uploaded: { label: "Subido", class: "bg-blue-100 text-blue-700" },
  approved: { label: "Aprobado", class: "bg-green-100 text-green-700" },
  rejected: { label: "Rechazado", class: "bg-red-100 text-red-700" },
  not_required: { label: "No Requerido", class: "bg-slate-100 text-slate-600" },
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  internacional: { label: "Internacionales", icon: "🌍", color: "bg-blue-500" },
  venezuela: { label: "Venezuela (SENIAT)", icon: "🇻🇪", color: "bg-yellow-500" },
  especial: { label: "Especiales", icon: "⚠️", color: "bg-red-500" },
};

export default function DocumentosPage() {
  const [filterCategory, setFilterCategory] = useState<"all" | "internacional" | "venezuela" | "especial">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "uploaded" | "approved" | "rejected">("all");

  const filtered = mockDocuments.filter(d => {
    const cat = filterCategory === "all" || d.category === filterCategory;
    const stat = filterStatus === "all" || d.status === filterStatus;
    return cat && stat;
  });

  const stats = {
    total: mockDocuments.length,
    pending: mockDocuments.filter(d => d.status === "pending").length,
    approved: mockDocuments.filter(d => d.status === "approved").length,
    rejected: mockDocuments.filter(d => d.status === "rejected").length,
  };

  const handleDownloadTemplate = (doc: Document) => {
    if (doc.templateUrl) {
      window.open(doc.templateUrl, "_blank");
    }
  };

  const handleUpload = (doc: Document) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        alert(`Subiendo ${file.name} para ${doc.name}...\n\nEn producción: upload a S3 + notificación a agente IA`);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
                <Link href="/portal/envios" className="text-slate-600 hover:text-slate-900">Mis Envíos</Link>
                <Link href="/portal/documentos" className="text-orange-500 font-semibold">Documentos</Link>
                <Link href="/portal/pagos" className="text-slate-600 hover:text-slate-900">Pagos</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión Documental</h1>
            <p className="text-slate-500 mt-1">Documentos para envío SHP-001 (TCE123456) - Guangzhou → Caracas</p>
          </div>
          <button className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Generar Checklist IA
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total Documentos</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Aprobados</p>
            <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Rechazados</p>
            <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Categoría:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="all">Todas</option>
                <option value="internacional">🌍 Internacionales</option>
                <option value="venezuela">🇻🇪 Venezuela (SENIAT)</option>
                <option value="especial">⚠️ Especiales</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Estado:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="uploaded">Subidos</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Obligatorio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fechas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-900 flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded">{doc.code}</span>
                          {doc.name}
                          {doc.mandatory && <span className="px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded">Obligatorio</span>}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs">{doc.description}</p>
                        {doc.notes && <p className="text-xs text-amber-600 mt-1">{doc.notes}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: CATEGORY_LABELS[doc.category].color + "15", color: CATEGORY_LABELS[doc.category].color }}>
                        {CATEGORY_LABELS[doc.category].icon} {CATEGORY_LABELS[doc.category].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[doc.status].class}`}>
                        {STATUS_LABELS[doc.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {doc.mandatory ? (
                        <span className="text-red-500 font-semibold">●</span>
                      ) : (
                        <span className="text-slate-400">○</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {doc.uploadedAt && (
                        <div className="text-slate-600">
                          <p>Subido: <span className="font-medium">{new Date(doc.uploadedAt).toLocaleDateString("es-VE")}</span></p>
                        </div>
                      )}
                      {doc.reviewedAt && (
                        <div className="text-green-600">
                          <p>Revisado: <span className="font-medium">{new Date(doc.reviewedAt).toLocaleDateString("es-VE")}</span></p>
                        </div>
                      )}
                      {!doc.uploadedAt && <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {doc.templateUrl && (
                          <button
                            onClick={() => handleDownloadTemplate(doc)}
                            className="px-3 py-1.5 text-xs font-medium text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition"
                          >
                            Plantilla
                          </button>
                        )}
                        {doc.status === "pending" && (
                          <button
                            onClick={() => handleUpload(doc)}
                            className="px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                          >
                            Subir
                          </button>
                        )}
                        {doc.status === "rejected" && (
                          <button className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                            Re-subir
                          </button>
                        )}
                        {doc.status === "approved" && (
                          <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                            ✓ Listo
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500">No hay documentos con los filtros actuales</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">Completitud del expediente</span>
              <span className="font-bold text-orange-500">
                {Math.round((stats.approved / stats.total) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${(stats.approved / stats.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stats.approved} de {stats.total} documentos aprobados. {stats.pending} pendientes.
            </p>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Agente IA Documental
              </h3>
              <p className="text-slate-300 mt-1">
                Nuestro agente revisa tus documentos en tiempo real, detecta inconsistencias y sugiere correcciones antes del despacho aduanal.
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition w-full md:w-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Revisar con IA Ahora
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
