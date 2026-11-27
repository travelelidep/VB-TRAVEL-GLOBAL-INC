"use client";
import { useState } from "react";
import Link from "next/link";

interface Payment {
  id: string;
  shipmentId: string;
  tracking: string;
  concept: string;
  amount: number;
  currency: "USD" | "VES";
  status: "pending" | "paid" | "partial" | "overdue" | "refunded";
  dueDate: string;
  paidDate?: string;
  method?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  breakdown?: { label: string; amount: number }[];
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    shipmentId: "SHP-001",
    tracking: "TCE123456",
    concept: "Flete Marítimo LCL + THC + Documentación",
    amount: 2850.00,
    currency: "USD",
    status: "paid",
    dueDate: "2024-01-20",
    paidDate: "2024-01-19",
    method: "Transferencia Bancaria",
    invoiceUrl: "/invoices/INV-001.pdf",
    receiptUrl: "/receipts/REC-001.pdf",
    breakdown: [
      { label: "Flete marítimo (Guangzhou → La Guaira)", amount: 1800.00 },
      { label: "THC (Terminal Handling Charges)", amount: 250.00 },
      { label: "Documentación (BL, certificado origen)", amount: 150.00 },
      { label: "Seguro todo riesgo (0.3%)", amount: 45.00 },
      { label: "Manejo y consolidación", amount: 80.00 },
      { label: "IVA (16%)", amount: 525.00 },
    ],
  },
  {
    id: "PAY-002",
    shipmentId: "SHP-001",
    tracking: "TCE123456",
    concept: "Impuestos Aduanales Venezuela (SENIAT)",
    amount: 4500.00,
    currency: "USD",
    status: "paid",
    dueDate: "2024-02-12",
    paidDate: "2024-02-11",
    method: "Pago Móvil / Transferencia",
    invoiceUrl: "/invoices/INV-002.pdf",
    receiptUrl: "/receipts/REC-002.pdf",
    breakdown: [
      { label: "IVA Importación (16% valor CIF)", amount: 2800.00 },
      { label: "Arancel Ad Valorem (5-20%)", amount: 1200.00 },
      { label: "Tasa Administrativa SENIAT", amount: 150.00 },
      { label: "Flete Nacional (La Guaira → Caracas)", amount: 350.00 },
    ],
  },
  {
    id: "PAY-003",
    shipmentId: "SHP-002",
    tracking: "TCE789012",
    concept: "Flete Aéreo Express + Manejo Aeropuerto",
    amount: 1280.00,
    currency: "USD",
    status: "paid",
    dueDate: "2024-01-21",
    paidDate: "2024-01-20",
    method: "Tarjeta de Crédito",
    invoiceUrl: "/invoices/INV-003.pdf",
    receiptUrl: "/receipts/REC-003.pdf",
    breakdown: [
      { label: "Flete aéreo (Guangzhou → Maiquetía)", amount: 950.00 },
      { label: "Fuel Surcharge (15%)", amount: 142.50 },
      { label: "Security Charge (5%)", amount: 47.50 },
      { label: "Manejo terminal carga", amount: 80.00 },
      { label: "Seguro (0.3%)", amount: 10.00 },
      { label: "IVA (16%)", amount: 50.00 },
    ],
  },
  {
    id: "PAY-004",
    shipmentId: "SHP-002",
    tracking: "TCE789012",
    concept: "Impuestos Aduanales Venezuela (Aéreo)",
    amount: 980.00,
    currency: "USD",
    status: "pending",
    dueDate: "2024-01-22",
    invoiceUrl: "/invoices/INV-004.pdf",
    breakdown: [
      { label: "IVA Importación (16%)", amount: 600.00 },
      { label: "Arancel (5%)", amount: 200.00 },
      { label: "Tasa SENIAT", amount: 100.00 },
      { label: "Entrega última milla Caracas", amount: 80.00 },
    ],
  },
  {
    id: "PAY-005",
    shipmentId: "SHP-003",
    tracking: "TCE345678",
    concept: "Anticipo Flete Marítimo FCL (40ft)",
    amount: 5000.00,
    currency: "USD",
    status: "partial",
    dueDate: "2024-01-28",
    paidDate: "2024-01-25",
    method: "Transferencia Bancaria",
    invoiceUrl: "/invoices/INV-005.pdf",
    breakdown: [
      { label: "Flete marítimo FCL 40ft (Guangzhou → La Guaira)", amount: 4200.00 },
      { label: "THC origen + destino", amount: 400.00 },
      { label: "Documentación FCL", amount: 200.00 },
      { label: "Seguro (0.3%)", amount: 200.00 },
    ],
  },
];

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: string }> = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  paid: { label: "Pagado", class: "bg-green-100 text-green-700", icon: "✅" },
  partial: { label: "Pago Parcial", class: "bg-blue-100 text-blue-700", icon: "💳" },
  overdue: { label: "Vencido", class: "bg-red-100 text-red-700", icon: "⚠️" },
  refunded: { label: "Reembolsado", class: "bg-purple-100 text-purple-700", icon: "↩️" },
};

export default function PagosPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "partial" | "overdue">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockPayments.filter(p => filterStatus === "all" || p.status === filterStatus);

  const totals = {
    pending: mockPayments.filter(p => p.status === "pending").reduce((a, b) => a + b.amount, 0),
    paid: mockPayments.filter(p => p.status === "paid").reduce((a, b) => a + b.amount, 0),
    partial: mockPayments.filter(p => p.status === "partial").reduce((a, b) => a + b.amount, 0),
    overdue: mockPayments.filter(p => p.status === "overdue").reduce((a, b) => a + b.amount, 0),
  };

  const formatCurrency = (amount: number, currency: "USD" | "VES") => {
    return new Intl.NumberFormat("es-VE", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "paid" || status === "refunded") return false;
    return new Date(dueDate) < new Date();
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
                <Link href="/portal/documentos" className="text-slate-600 hover:text-slate-900">Documentos</Link>
                <Link href="/portal/pagos" className="text-orange-500 font-semibold">Pagos</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Pagos</h1>
            <p className="text-slate-500 mt-1">Facturas, recibos y estado de cuenta de tus envíos China-Venezuela</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Recarga
            </button>
            <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-500">{formatCurrency(totals.pending, "USD")}</p>
            <p className="text-xs text-slate-400 mt-1">{mockPayments.filter(p => p.status === "pending").length} facturas</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pagados (últimos 30 días)</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totals.paid, "USD")}</p>
            <p className="text-xs text-slate-400 mt-1">{mockPayments.filter(p => p.status === "paid").length} facturas</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pagos Parciales</p>
            <p className="text-2xl font-bold text-blue-500">{formatCurrency(totals.partial, "USD")}</p>
            <p className="text-xs text-slate-400 mt-1">{mockPayments.filter(p => p.status === "partial").length} facturas</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Vencidos</p>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totals.overdue, "USD")}</p>
            <p className="text-xs text-slate-400 mt-1">{mockPayments.filter(p => p.status === "overdue").length} facturas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <span className="text-sm text-slate-500 self-center">Filtrar:</span>
            {["all", "pending", "paid", "partial", "overdue"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s as typeof filterStatus)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterStatus === s
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "all" ? "Todos" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Factura</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Envío / Guía</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Concepto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Monto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((payment) => (
                  <>
                    <tr
                      className={`${expandedId === payment.id ? "bg-orange-50" : "hover:bg-slate-50"}`}
                      onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
                    >
                      <td className="px-4 py-4">
                        <p className="font-mono font-semibold text-slate-900">{payment.id}</p>
                        {payment.invoiceUrl && (
                          <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline inline-flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Ver factura
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-700">{payment.shipmentId}</p>
                        <p className="text-sm text-slate-500 font-mono">{payment.tracking}</p>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-sm text-slate-700">{payment.concept}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900">{formatCurrency(payment.amount, payment.currency)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[payment.status].class}`}>
                          {STATUS_CONFIG[payment.status].icon} {STATUS_CONFIG[payment.status].label}
                        </span>
                        {isOverdue(payment.dueDate, payment.status) && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded">VENCIDO</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{new Date(payment.dueDate).toLocaleDateString("es-VE")}</p>
                        {payment.paidDate && (
                          <p className="text-xs text-green-600">Pagado: {new Date(payment.paidDate).toLocaleDateString("es-VE")}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {payment.status === "pending" || payment.status === "partial" || payment.status === "overdue" ? (
                            <button className="px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition w-full sm:w-auto">
                              Pagar Ahora
                            </button>
                          ) : payment.status === "paid" ? (
                            <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg">✓ Completado</span>
                          ) : (
                            <span className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-lg">—</span>
                          )}
                          {payment.receiptUrl && (
                            <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
                              Recibo
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>

                    {expandedId === payment.id && (
                      <tr>
                        <td colSpan={7} className="px-4 pb-4">
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Desglose de {payment.id}
                            </h4>
                            {payment.breakdown && (
                              <div className="space-y-2">
                                {payment.breakdown.map((item, idx) => (
                                  <div key={idx} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                                    <span className="text-slate-600">{item.label}</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(item.amount, payment.currency)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between pt-3 border-t-2 border-slate-300">
                                  <span className="font-bold text-slate-900">Total</span>
                                  <span className="font-bold text-lg text-orange-500">{formatCurrency(payment.amount, payment.currency)}</span>
                                </div>
                              </div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-3">
                              {payment.method && (
                                <span className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm">
                                  Método: {payment.method}
                                </span>
                              )}
                              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                                Descargar Detalle PDF
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500">No hay pagos con el filtro actual</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Transferencia Bancaria</h3>
            <p className="text-slate-500 text-sm mb-4">USD / VES - Banco Mercantil, Banesco, BOD, BNC</p>
            <button className="w-full text-sm text-orange-500 hover:text-orange-700 font-medium">Ver datos bancarios</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tarjeta de Crédito</h3>
            <p className="text-slate-500 text-sm mb-4">Visa, Mastercard, Amex - Procesado por Stripe</p>
            <button className="w-full text-sm text-orange-500 hover:text-orange-700 font-medium">Pagar con tarjeta</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pago Móvil / Zelle</h3>
            <p className="text-slate-500 text-sm mb-4">Pago Móvil VES / Zelle USD - Inmediato</p>
            <button className="w-full text-sm text-orange-500 hover:text-orange-700 font-medium">Ver instrucciones</button>
          </div>
        </div>
      </main>
    </div>
  );
}
