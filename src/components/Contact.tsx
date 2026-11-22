"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "cotizacion",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email API / n8n webhook
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest">
              Contáctanos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              ¿Listo para tu próximo viaje?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Escríbenos y un agente especializado te contactará en menos de 24
              horas con las mejores opciones para tu viaje.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <i className="fas fa-envelope text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <a href="mailto:info@mdtravelglobal.com" className="text-[var(--color-primary)] hover:underline">
                    info@mdtravelglobal.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                  <i className="fab fa-whatsapp text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <a href="https://wa.me/1234567890" className="text-green-600 hover:underline">
                    +1 (234) 567-890
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Respuesta inmediata</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                  <i className="fas fa-phone text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Teléfono</h4>
                  <a href="tel:+1234567890" className="text-gray-700 hover:underline">
                    +1 (234) 567-890
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Lun - Sáb: 9am - 8pm</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                  <i className="fas fa-clock text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Horario</h4>
                  <p className="text-gray-600">Lunes a Sábado: 9:00 AM - 8:00 PM</p>
                  <p className="text-xs text-gray-500 mt-1">Emergencias 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-green-500 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gray-500">
                  Un agente te contactará en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition bg-white"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition bg-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition bg-white"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ¿Qué necesitas?
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="cotizacion">Cotización de viaje</option>
                    <option value="paquete">Paquete vacacional</option>
                    <option value="grupo">Viaje en grupo</option>
                    <option value="corporativo">Viaje corporativo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition bg-white resize-none"
                    placeholder="Cuéntanos sobre tu viaje ideal: destino, fechas, número de viajeros..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
