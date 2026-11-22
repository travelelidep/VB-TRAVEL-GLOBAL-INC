export default function ComoFunciona() {
  const pasos = [
    {
      numero: "01",
      titulo: "Abre tu Casillero Gratis",
      descripcion: "Completa el formulario con tus datos. Te asignamos una dirección única en nuestro almacén de Guangzhou, China.",
      icon: "fa-box-open",
      color: "from-orange-500 to-orange-600",
    },
    {
      numero: "02",
      titulo: "Compra en Tiendas Chinas",
      descripcion: "Usa tu dirección de casillero en Taobao, 1688, Alibaba, Tmall, JD.com, Pinduoduo. Recibimos tus paquetes gratis por 30 días.",
      icon: "fa-cart-shopping",
      color: "from-blue-500 to-blue-600",
    },
    {
      numero: "03",
      titulo: "Consolidamos tus Paquetes",
      descripcion: "Recibimos de múltiples proveedores, inspeccionamos, reempaquetamos y consolidamos en un solo envío. Ahorras hasta 40% en flete.",
      icon: "fa-boxes-stacked",
      color: "from-green-500 to-green-600",
    },
    {
      numero: "04",
      titulo: "Elige tu Envío",
      descripcion: "Aéreo Express 24-48h o Marítimo LCL/FCL 25-35 días. Cotización instantánea con IA. Todo incluido: aduanas, impuestos, entrega.",
      icon: "fa-plane",
      color: "from-purple-500 to-purple-600",
    },
    {
      numero: "05",
      titulo: "Despacho Aduanal y Entrega",
      descripcion: "Gestionamos DUA SENIAT, pago IVA/aranceles, licencias. Entregamos en tu puerta en toda Venezuela. Tracking 24/7 por WhatsApp.",
      icon: "fa-truck",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Cómo Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Tu Casillero China-Venezuela en 5 Pasos
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Simple, transparente y sin sorpresas. Nosotros nos ocupamos de todo el proceso logístico.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-purple-500 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {pasos.map((paso, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row md:items-center gap-8">
                {/* Step number & icon */}
                <div className={`relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${paso.color} flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 ${idx % 2 === 0 ? "md:order-1" : "md:order-3"}`}>
                  <span className="text-white font-bold text-2xl md:text-3xl">{paso.numero}</span>
                </div>

                {/* Content */}
                <div className={`flex-1 p-6 md:p-8 bg-slate-50 rounded-2xl border border-slate-100 ${idx % 2 === 0 ? "md:order-2" : "md:order-2"}`}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br {paso.color} flex items-center justify-center mb-4">
                    <i className={`fas ${paso.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{paso.titulo}</h3>
                  <p className="text-slate-600 leading-relaxed">{paso.descripcion}</p>
                </div>

                {/* Spacer for even items */}
                <div className="w-20 md:w-24 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://wa.me/58416111157?text=Hola%2C%20quiero%20abrir%20mi%20casillero%20en%20China%20con%20VB%20TRAVEL%20GLOBAL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition"
          >
            <i className="fab fa-whatsapp text-xl"></i> Abrir mi Casillero Gratis
          </a>
        </div>
      </div>
    </section>
  );
}
