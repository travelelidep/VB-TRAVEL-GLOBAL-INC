"use client";
import { useState } from "react";

interface CasilleroFormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
}

const ESTADOS_VENEZUELA = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
  "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
];

export default function Hero() {
  const [formData, setFormData] = useState<CasilleroFormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codigoCasillero, setCodigoCasillero] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let codigo = "";
    try {
      const res = await fetch("/api/leads/casillero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.ok && data.codigo) {
        codigo = data.codigo;
        setCodigoCasillero(data.codigo);
      }
    } catch (error) {
      console.error("Error registrando casillero:", error);
    }

    const whatsappMessage = `📦 NUEVA SOLICITUD DE CASILLERO - VB TRAVEL GLOBAL INC%0A%0A` +
      (codigo ? `🔑 Código: ${codigo}%0A` : "") +
      `👤 Nombre: ${formData.nombre}%0A` +
      `📧 Email: ${formData.email}%0A` +
      `📱 Tel/WhatsApp: ${formData.telefono}%0A%0A` +
      `🏠 Dirección: ${formData.direccion}%0A` +
      `📮 Código Postal: ${formData.codigoPostal}%0A` +
      `🏙️ Ciudad: ${formData.ciudad}%0A` +
      `📍 Estado: ${formData.estado}%0A%0A` +
      `✅ Solicitud desde web - Casillero China-Venezuela`;

    setLoading(false);
    setSubmitted(true);

    window.open(`https://wa.me/58416111157?text=${whatsappMessage}`, "_blank");

    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      setCodigoCasillero(null);
      setFormData({ nombre: "", email: "", telefono: "", direccion: "", codigoPostal: "", ciudad: "", estado: "" });
    }, 8000);
  };

  const nextStep = () => {
    if (step === 1 && formData.nombre && formData.email && formData.telefono) setStep(2);
    if (step === 2 && formData.direccion && formData.codigoPostal && formData.ciudad && formData.estado) {
      const form = document.querySelector("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const prevStep = () => setStep(1);

  if (submitted) {
    return (
      <section className="relative min-h-screen gradient-hero flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-md w-full mx-auto px-4 animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 md:p-12 border border-white/10 text-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-green-400 text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">¡Casillero Solicitado!</h2>
            {codigoCasillero && (
              <p className="mb-3 inline-block rounded-xl bg-orange-500/20 px-4 py-2 font-mono text-lg text-orange-300">
                {codigoCasillero}
              </p>
            )}
            <p className="text-slate-300 mb-6">
              Recibirás tus etiquetas de envío y dirección de casillero en Guangzhou
              por WhatsApp en los próximos minutos.
            </p>
            <a
              href="https://wa.me/58416111157"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
            >
              <i className="fab fa-whatsapp"></i> Seguir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <i className="fas fa-box-open text-white text-2xl"></i>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest">VB TRAVEL GLOBAL INC</div>
                <div className="text-sm text-slate-300">Casillero China → Venezuela</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Tu Casillero en China
              <br />
              <span className="text-orange-400">Compras Online → Tu Puerta</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-8">
              Compra en Taobao, 1688, Alibaba, Tmall, JD.com, Pinduoduo y recibe en Venezuela.
              Almacén propio en Guangzhou. Aéreo 24-48h | Marítimo 25-35 días. Puerta a puerta.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
              <span className="flex items-center gap-2 text-slate-300"><i className="fas fa-check text-green-400"></i> Almacén Guangzhou gratis 30 días</span>
              <span className="flex items-center gap-2 text-slate-300"><i className="fas fa-check text-green-400"></i> Consolidación de paquetes</span>
              <span className="flex items-center gap-2 text-slate-300"><i className="fas fa-check text-green-400"></i> Seguro todo riesgo opcional</span>
              <span className="flex items-center gap-2 text-slate-300"><i className="fas fa-check text-green-400"></i> Pago en VES o USD</span>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-200">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="mb-6 text-center">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold mb-3">
                  {step === 1 ? "Paso 1 de 2: Datos Personales" : "Paso 2 de 2: Dirección de Entrega"}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {step === 1 ? "Abre tu Casillero Gratis" : "¿Dónde entregamos en Venezuela?"}
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                  {step === 1 
                    ? "Solo 3 campos para crear tu casillero en Guangzhou" 
                    : "Dirección exacta para entrega puerta a puerta"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre y Apellido Completo *</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Juan Pérez García"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
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
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección Exacta de Entrega *</label>
                      <input
                        type="text"
                        name="direccion"
                        required
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Calle, edificio, apartamento, referencia..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Código Postal *</label>
                        <input
                          type="text"
                          name="codigoPostal"
                          required
                          value={formData.codigoPostal}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="1010"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Ciudad *</label>
                        <input
                          type="text"
                          name="ciudad"
                          required
                          value={formData.ciudad}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Caracas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Estado *</label>
                        <select
                          name="estado"
                          required
                          value={formData.estado}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                        >
                          <option value="">Seleccionar estado</option>
                          {ESTADOS_VENEZUELA.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                    >
                      ← Atrás
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={loading}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-lg transition ${
                      loading
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="fas fa-spinner fa-spin"></i> Procesando...
                      </span>
                    ) : step === 1 ? (
                      "Continuar →"
                    ) : (
                      <>
                        <i className="fab fa-whatsapp mr-2"></i> Crear Casillero y Recibir Etiquetas
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-center text-xs text-slate-500 mt-6">
                Al continuar, aceptas nuestros <a href="#" className="text-orange-500 hover:underline">Términos</a> y autorizas contacto por WhatsApp.
              </p>

              <a
                href="https://wa.me/58416111157?text=Hola%2C%20quiero%20abrir%20mi%20casillero%20en%20China%20con%20VB%20TRAVEL%20GLOBAL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition mt-4"
              >
                <i className="fab fa-whatsapp text-xl"></i> ¿Dudas? Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 animate-fade-in-up animate-delay-400">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">24-48h</div>
              <div className="text-slate-400 text-sm mt-1">Aéreo Express</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">25-35d</div>
              <div className="text-slate-400 text-sm mt-1">Marítimo LCL/FCL</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">30 días</div>
              <div className="text-slate-400 text-sm mt-1">Almacén Gratis</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-slate-400 text-sm mt-1">Puerta a Puerta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
