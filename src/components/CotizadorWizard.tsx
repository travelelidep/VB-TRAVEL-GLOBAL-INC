"use client";
import { useCallback, useEffect, useState } from "react";

interface CotizacionData {
  tipoCarga: "paqueteria" | "carga_suelta" | "paletizada" | "contenedor";
  modalidad: "aerea" | "maritima";
  cajas: number;
  largo: string;
  ancho: string;
  alto: string;
  pesoPorCaja: string;
  paletas: number;
  largoPalet: string;
  anchoPalet: string;
  altoPalet: string;
  pesoPalet: string;
  tipoContenedor: "20ft" | "40ft" | "40hq";
  valorCarga: string;
  contenido: string;
  ubicacionOrigen: string;
  destinoFinal: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  notas: string;
}

const initialData: CotizacionData = {
  tipoCarga: "carga_suelta",
  modalidad: "maritima",
  cajas: 1,
  largo: "",
  ancho: "",
  alto: "",
  pesoPorCaja: "",
  paletas: 1,
  largoPalet: "",
  anchoPalet: "",
  altoPalet: "",
  pesoPalet: "",
  tipoContenedor: "20ft",
  valorCarga: "",
  contenido: "",
  ubicacionOrigen: "Guangzhou (almacén VB TRAVEL GLOBAL)",
  destinoFinal: "",
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  notas: "",
};

const steps = [
  { id: 1, title: "Tipo de Envío", desc: "¿Qué vas a enviar?" },
  { id: 2, title: "Medidas y Peso", desc: "Dimensiones exactas" },
  { id: 3, title: "Detalles Carga", desc: "Contenido y ubicaciones" },
  { id: 4, title: "Tus Datos", desc: "Para enviarte la cotización" },
];

interface ProductoSeleccionado {
  titulo?: string;
  contenido?: string;
  precio?: number | null;
  valorCarga?: string;
  peso?: string;
  pesoKg?: number | null;
  dimensiones?: string | null;
  proveedor?: string;
  supplier?: string;
  origen?: string;
  source?: string;
  url?: string | null;
}

function partesDimensiones(dimensiones?: string | null): string[] {
  return (dimensiones ?? "")
    .split("×")
    .map((parte) => parte.replace(/[^0-9.,]/g, "").trim());
}

export default function CotizadorWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CotizacionData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [productPrefilled, setProductPrefilled] = useState(false);

  const aplicarProducto = useCallback((producto: ProductoSeleccionado) => {
    const pesoTexto = producto.peso || (producto.pesoKg != null ? String(producto.pesoKg) : "");
    const pesoNumero = Number.isFinite(parseFloat(pesoTexto)) ? String(parseFloat(pesoTexto)) : "";
    const [largo = "", ancho = "", alto = ""] = partesDimensiones(producto.dimensiones);
    const titulo = producto.contenido || producto.titulo || "";
    const proveedor = producto.supplier || producto.proveedor || "";
    const origen = producto.source || producto.origen || "";
    const valor = producto.valorCarga || (producto.precio != null ? String(producto.precio) : "");

    setData((prev) => ({
      ...prev,
      valorCarga: valor,
      contenido: titulo,
      pesoPorCaja: pesoNumero,
      largo,
      ancho,
      alto,
      tipoCarga: parseFloat(pesoTexto) < 30 ? "paqueteria" : "carga_suelta",
      notas: `Producto desde catálogo: ${titulo}\nProveedor: ${proveedor}\nFuente: ${origen}${producto.url ? `\nURL: ${producto.url}` : ""}`,
    }));
    setProductPrefilled(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("vb_selected_product");
      if (!stored) return;

      try {
        aplicarProducto(JSON.parse(stored) as ProductoSeleccionado);
        localStorage.removeItem("vb_selected_product");
      } catch (error) {
        console.error("Producto guardado inválido:", error);
      }
    }, 0);

    const alSeleccionar = (evento: Event) => {
      const detalle = (evento as CustomEvent<ProductoSeleccionado>).detail;
      if (detalle) aplicarProducto(detalle);
    };

    window.addEventListener("vb:producto", alSeleccionar);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("vb:producto", alSeleccionar);
    };
  }, [aplicarProducto]);

  const updateData = (field: keyof CotizacionData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/agents/cotizador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitted(true);
    }
  };

  const progress = (currentStep / 4) * 100;

  if (submitted) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-green-500 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Cotización Enviada!</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Nuestro agente IA está calculando tu mejor opción. Recibirás la cotización detallada
          en tu email y WhatsApp en menos de 15 minutos.
        </p>
        <button
          onClick={() => { setSubmitted(false); setCurrentStep(1); setData(initialData); setProductPrefilled(false); }}
          className="btn-primary px-8 py-3 rounded-xl"
        >
          Nueva Cotización
        </button>
      </div>
    );
  }

  return (
    <section id="cotizar" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Calculadora IA Instantánea
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Cotiza tu Envío China-Venezuela en 4 Pasos
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Completa el asistente y recibe precio, tránsit time y documentos requeridos al instante.
            Almacén en Guangzhou. Entrega puerta a puerta en toda Venezuela.
          </p>
        </div>

        {productPrefilled && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-check text-green-500"></i>
              </div>
              <div>
                <p className="font-semibold text-green-700">Producto cargado desde el catálogo</p>
                <p className="text-sm text-green-600">Los campos de valor, contenido, peso y dimensiones se completaron solos. Revísalos y continúa.</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-200 -translate-y-1/2 rounded" />
            <div className="absolute top-1/2 left-0 h-2 bg-orange-500 -translate-y-1/2 rounded transition-all duration-300" style={{ width: `${progress}%` }} />
            {steps.map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    idx + 1 < currentStep
                      ? "bg-orange-500 text-white"
                      : idx + 1 === currentStep
                      ? "bg-orange-500 text-white ring-4 ring-orange-100"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {idx + 1 < currentStep ? <i className="fas fa-check" /> : step.id}
                </div>
                <span className="text-xs font-medium text-slate-500 mt-2 text-center w-24">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-slate-900">¿Qué tipo de carga envías?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "paqueteria", label: "Paquetería", desc: "Cajas pequeñas <30kg c/u", icon: "fa-box" },
                      { value: "carga_suelta", label: "Carga Suelta", desc: "Cajas sueltas, varias piezas", icon: "fa-boxes-stacked" },
                      { value: "paletizada", label: "Paletizada", desc: "Carga en paletas standard", icon: "fa-pallet" },
                      { value: "contenedor", label: "Contenedor", desc: "FCL 20ft/40ft completo", icon: "fa-container-storage" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateData("tipoCarga", opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          data.tipoCarga === opt.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-200 hover:border-orange-300"
                        }`}
                      >
                        <i className={`fas ${opt.icon} text-2xl mb-2 ${data.tipoCarga === opt.value ? "text-orange-500" : "text-slate-400"}`}></i>
                        <div className="font-semibold text-slate-900">{opt.label}</div>
                        <div className="text-xs text-slate-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mt-6">Modalidad de Envío</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "aerea", label: "Aéreo Express", time: "24-48h", price: "Desde $14.50/kg", icon: "fa-plane" },
                      { value: "maritima", label: "Marítimo LCL/FCL", time: "25-35 días", price: "Desde $5.20/kg", icon: "fa-ship" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateData("modalidad", opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          data.modalidad === opt.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-200 hover:border-orange-300"
                        }`}
                      >
                        <i className={`fas ${opt.icon} text-2xl mb-2 ${data.modalidad === opt.value ? "text-orange-500" : "text-slate-400"}`}></i>
                        <div className="font-semibold text-slate-900">{opt.label}</div>
                        <div className="text-xs text-slate-500">{opt.time} • {opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {data.tipoCarga === "contenedor" ? "Tipo de Contenedor" : "Dimensiones y Peso"}
                  </h3>

                  {data.tipoCarga === "contenedor" ? (
                    <div className="grid grid-cols-3 gap-4">
                      {["20ft", "40ft", "40hq"].map((tc) => (
                        <button
                          key={tc}
                          type="button"
                          onClick={() => updateData("tipoContenedor", tc)}
                          className={`p-6 rounded-xl border-2 text-center transition-all ${
                            data.tipoContenedor === tc
                              ? "border-orange-500 bg-orange-50"
                              : "border-slate-200 hover:border-orange-300"
                          }`}
                        >
                          <i className={`fas fa-container-storage text-3xl mb-2 ${data.tipoContenedor === tc ? "text-orange-500" : "text-slate-400"}`}></i>
                          <div className="font-semibold text-slate-900">{tc}</div>
                          <div className="text-xs text-slate-500">
                            {tc === "20ft" && "33 CBM • 28 ton"}
                            {tc === "40ft" && "67 CBM • 28 ton"}
                            {tc === "40hq" && "76 CBM • 28 ton"}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : data.tipoCarga === "paletizada" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Número de Paletas</label>
                        <input
                          type="number"
                          min="1"
                          value={data.paletas}
                          onChange={(e) => updateData("paletas", parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Largo (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.largoPalet}
                            onChange={(e) => updateData("largoPalet", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="120"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Ancho (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.anchoPalet}
                            onChange={(e) => updateData("anchoPalet", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Alto (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.altoPalet}
                            onChange={(e) => updateData("altoPalet", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="150"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Peso por Paleta (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={data.pesoPalet}
                          onChange={(e) => updateData("pesoPalet", e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Número de Cajas</label>
                        <input
                          type="number"
                          min="1"
                          value={data.cajas}
                          onChange={(e) => updateData("cajas", parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Largo (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.largo}
                            onChange={(e) => updateData("largo", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="60"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Ancho (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.ancho}
                            onChange={(e) => updateData("ancho", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="40"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Alto (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={data.alto}
                            onChange={(e) => updateData("alto", e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Peso por Caja (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.pesoPorCaja}
                          onChange={(e) => updateData("pesoPorCaja", e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="25"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">
                      <i className="fas fa-info-circle text-orange-500 mr-2"></i>
                      <strong>Importante:</strong> Medidas exactas evitan recargos. Para carga suelta: largo × ancho × alto de <strong>cada caja</strong>.
                      Si es paletizada: medidas de la <strong>palleta completa</strong> (estándar 120×100×150cm).
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-slate-900">Detalles de la Carga</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor de la Carga (USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={data.valorCarga}
                        onChange={(e) => updateData("valorCarga", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contenido *</label>
                      <input
                        type="text"
                        required
                        value={data.contenido}
                        onChange={(e) => updateData("contenido", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Ej: Electrónicos, ropa, repuestos, maquinaria..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación Origen en China</label>
                      <select
                        value={data.ubicacionOrigen}
                        onChange={(e) => updateData("ubicacionOrigen", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="Guangzhou (almacén VB TRAVEL GLOBAL)">Guangzhou - Almacén VB TRAVEL GLOBAL (Gratis)</option>
                        <option value="Guangzhou (fábrica/proveedor)">Guangzhou - Recolectar en fábrica/proveedor</option>
                        <option value="Shenzhen">Shenzhen</option>
                        <option value="Yiwu">Yiwu</option>
                        <option value="Shanghai">Shanghai</option>
                        <option value="Ningbo">Ningbo</option>
                        <option value="Otra ciudad China">Otra ciudad (consultar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Destino Final en Venezuela *</label>
                      <input
                        type="text"
                        required
                        value={data.destinoFinal}
                        onChange={(e) => updateData("destinoFinal", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Ej: Caracas, Valencia, Maracaibo, Barquisimeto..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-lg font-semibold text-slate-900">Tus Datos de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={data.nombre}
                        onChange={(e) => updateData("nombre", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => updateData("email", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Teléfono *</label>
                      <input
                        type="tel"
                        required
                        value={data.telefono}
                        onChange={(e) => updateData("telefono", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="+58 4XX XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Empresa (opcional)</label>
                      <input
                        type="text"
                        value={data.empresa}
                        onChange={(e) => updateData("empresa", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notas adicionales</label>
                    <textarea
                      rows={3}
                      value={data.notas}
                      onChange={(e) => updateData("notas", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                      placeholder="Requisitos especiales, seguros, urgencia, etc."
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i> Anterior
                </button>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    Siguiente <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 w-full md:w-auto mx-auto md:mx-0"
                  >
                    <i className="fas fa-calculator mr-2"></i> Obtener Cotización IA
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
