export default function Servicios() {
  const servicios = [
    {
      icon: "fa-box-open",
      titulo: "Apertura de Casillero Gratis",
      descripcion: "Te asignamos una dirección física en nuestro almacén de Guangzhou. Úsala para tus compras en Taobao, 1688, Alibaba, Tmall, JD.com, Pinduoduo.",
      caracteristicas: ["Dirección única personal", "Almacén gratis 30 días", "Recepción ilimitada", "Notificación por WhatsApp"],
      modalidad: "Casillero",
      desde: "Gratis",
    },
    {
      icon: "fa-plane",
      titulo: "Envío Aéreo Express 24-48h",
      descripcion: "Ideal para compras urgentes, electrónicos, ropa, muestras, repuestos. Vuelos directos Guangzhou → Maiquetía. Entrega puerta a puerta en 2-3 días hábiles.",
      caracteristicas: ["24-48h tránsito", "Tracking en vivo", "Seguro opcional", "Despacho express"],
      modalidad: "Aéreo",
      desde: "$14.50/kg",
    },
    {
      icon: "fa-ship",
      titulo: "Envío Marítimo LCL 25-35 días",
      descripcion: "Consolidamos tus paquetes en contenedor compartido. Ideal para volúmenes >100kg, muebles, mercancía pesada, stock para negocio. Salidas semanales desde Huangpu.",
      caracteristicas: ["Desde 50kg / 0.5 CBM", "Consolidación semanal", "Puerta a puerta", "Mejor precio/volumen"],
      modalidad: "Marítimo LCL",
      desde: "$5.20/kg",
    },
    {
      icon: "fa-container-storage",
      titulo: "Contenedor Completo FCL",
      descripcion: "Contenedor 20ft/40ft/40HQ exclusivo para tu carga. Máxima seguridad, sin manipulación intermedia, sellado en origen. Ideal para importadores mayoristas.",
      caracteristicas: ["20ft / 40ft / 40HQ", "Carga directa fábrica", "Sellado en origen", "Tarifa fija garantizada"],
      modalidad: "Marítimo FCL",
      desde: "Desde $3,200/20ft",
    },
    {
      icon: "fa-warehouse",
      titulo: "Consolidación y Reempaque",
      descripcion: "Recibimos de múltiples proveedores, inspeccionamos, consolidamos en menos bultos, paletizamos y preparamos documentación. Ahorra hasta 40% en flete.",
      caracteristicas: ["Almacén 2000m² Guangzhou", "Recepción multi-proveedor", "Inspección visual gratis", "Paletizado incluido"],
      modalidad: "Value Added",
      desde: "Incluido",
    },
    {
      icon: "fa-file-contract",
      titulo: "Despacho Aduanal Venezuela",
      descripcion: "Gestionamos todo: DUA SENIAT, clasificación arancelaria, pago IVA/aranceles, licencias SAIA/INSAI/MPPS. Entregamos en tu puerta con impuestos pagados.",
      caracteristicas: ["DUA pre-llenado", "Clasificación HS Code", "Pago impuestos online", "Canal verde prioritario"],
      modalidad: "Compliance",
      desde: "Incluido",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Servicios VB TRAVEL GLOBAL
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Tu Puente China-Venezuela
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Almacén propio en Guangzhou. Compras en cualquier tienda china y recibe en tu puerta
            en Venezuela. Aéreo 24-48h | Marítimo 25-35 días. Todo incluido: aduanas, impuestos, entrega.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, idx) => (
            <div
              key={idx}
              className="group card-hover p-8 rounded-2xl bg-white border border-slate-100 hover:border-orange-200"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className={`fas ${servicio.icon} text-white text-xl`}></i>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                  {servicio.modalidad}
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-600 rounded-full">
                  Desde {servicio.desde}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {servicio.titulo}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-4">
                {servicio.descripcion}
              </p>
              <ul className="space-y-2">
                {servicio.caracteristicas.map((car, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <i className="fas fa-check text-orange-500 text-xs"></i>
                    {car}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
