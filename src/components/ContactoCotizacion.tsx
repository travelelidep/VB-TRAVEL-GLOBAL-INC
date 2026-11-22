"use client";
import { useState } from "react";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  tipoCarga: string;
  modalidad: string;
  origen: string;
  destino: string;
  peso: string;
  dimensiones: string;
  valor: string;
  contenido: string;
  notas: string;
}

const initialForm: FormData = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  tipoCarga: "carga_suelta",
  modalidad: "maritima",
  origen: "Guangzhou (almacén VB TRAVEL GLOBAL)",
  destino: "",
  peso: "",
  dimensiones: "",
  valor: "",
  contenido: "",
  notas: "",
};

const WHATSAPP_NUMBER = "58416111157";
const EMAIL_CONTACT = "vbtravelglobal@gmail.com";

export default function ContactoCotizacion() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/agents/cotizador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
    
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData(initialForm); }, 5000);
  };

  const whatsappMessage = `Hola, quiero cotizar un envío China-Venezuela:%0A%0A` +
    `👤 Nombre: ${formData.nombre}%0A` +
    `📧 Email: ${formData.email}%0A` +
    `📱 Tel: ${formData.telefono}%0A` +
    `🏢 Empresa: ${formData.empresa || "Personal"}%0A%0A` +
    `📦 Tipo: ${formData.tipoCarga}%0A` +
    `✈️/🚢 Modalidad: ${formData.modalidad}%0A` +
    `📍 Origen: ${formData.origen}%0A` +
    `🎯 Destino: ${formData.destino}%0A` +
    `⚖️ Peso: ${formData.peso} kg%0A` +
    `📏 Dimensiones: ${formData.dimensiones}%0A` +
    `💰 Valor: $${formData.valor} USD%0A` +
    `📋 Contenido: ${formData.contenido}%0A%0A` +
    `📝 Notas: ${formData.notas || "Ninguna"}`;

  if (submitted) {
    return (
      <div className="text-center py-16 animate-fade-in-up bg-green-50 rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-green-500 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Solicitud Enviada!</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Recibirás tu cotización detallada en email y WhatsApp en menos de 15 minutos.
          Nuestro agente IA ya está calculando la mejor ruta y precio.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
        >
          <i className="fab fa-whatsapp"></i> Seguir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <section id="contacto" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-6">
                <i className="fas fa-headset mr-2"></i> Asesoría Personalizada
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Prefieres Cotizar por WhatsApp?
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-lg">
                Nuestro equipo especializado en comercio China-Venezuela te atiende 24/7.
                Envía los datos de tu carga y recibe cotización con opciones aérea/marítima,
                tránsit time, documentos requeridos y costo total puerta a puerta.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                    <i className="fab fa-whatsapp text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp Directo</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                      +58 416 111157
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <i className="fas fa-envelope text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href={`mailto:${EMAIL_CONTACT}`} className="text-blue-400 hover:underline">
                      {EMAIL_CONTACT}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <i className="fas fa-clock text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Horario</p>
                    <p className="text-slate-400">Lun-Sáb: 8am-6pm (VE) • 24/7 Urgencias</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20cotizar%20un%20env%C3%ADo%20China-Venezuela%20con%20VB%20TRAVEL%20GLOBAL`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl"
              >
                <i className="fab fa-whatsapp text-2xl"></i> Cotizar por WhatsApp Ahora
              </a>
            </div>
          </div>

          {/* Form Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
                Formulario de Cotización
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Detalla tu Envío
              </h3>
              <p className="text-slate-500 mt-2">
                Completa los campos y nuestro agente IA te enviará la mejor opción en minutos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="+58 4XX XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Empresa (opcional)</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Carga *</label>
                  <select
                    name="tipoCarga"
                    value={formData.tipoCarga}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="paqueteria">Paquetería (hasta 30kg/caja)</option>
                    <option value="carga_suelta">Carga Suelta (varias cajas)</option>
                    <option value="paletizada">Paletizada (en paletas)</option>
                    <option value="contenedor">Contenedor Completo (FCL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Modalidad *</label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="aerea">Aéreo Express (24-48h)</option>
                    <option value="maritima">Marítimo LCL/FCL (25-35 días)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Origen en China</label>
                  <select
                    name="origen"
                    value={formData.origen}
                    onChange={handleChange}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Destino en Venezuela *</label>
                  <input
                    type="text"
                    name="destino"
                    required
                    value={formData.destino}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Caracas, Valencia, Maracaibo..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Peso Total (kg) *</label>
                  <input
                    type="number"
                    name="peso"
                    step="0.1"
                    required
                    value={formData.peso}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dimensiones (L×A×H cm)</label>
                  <input
                    type="text"
                    name="dimensiones"
                    value={formData.dimensiones}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="60×40×30 por caja"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Valor Carga (USD) *</label>
                  <input
                    type="number"
                    name="valor"
                    step="0.01"
                    required
                    value={formData.valor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Contenido de la Carga *</label>
                <input
                  type="text"
                  name="contenido"
                  required
                  value={formData.contenido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Ej: Electrónicos, ropa, repuestos, maquinaria, juguetes..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notas Adicionales</label>
                <textarea
                  name="notas"
                  rows={3}
                  value={formData.notas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Seguro todo riesgo, urgencia, documentos especiales, entrega en zona remota..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Enviando...
                  </span>
                ) : (
                  <>
                    <i className="fas fa-calculator"></i> Enviar y Obtener Cotización IA
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Al enviar, aceptas nuestra <a href="#" className="text-orange-500 hover:underline">Política de Privacidad</a> y autorizas contacto por WhatsApp/email.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
