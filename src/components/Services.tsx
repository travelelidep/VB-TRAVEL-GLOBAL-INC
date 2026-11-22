export default function Services() {
  const services = [
    {
      icon: "fa-plane",
      title: "Vuelos",
      description: "Tarifas mayoristas en más de 90 aerolíneas. Domésticos e internacionales con los mejores precios.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "fa-hotel",
      title: "Hoteles",
      description: "Acceso a más de 1 millón de propiedades en todo el mundo. Desde económicos hasta 5 estrellas.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "fa-car",
      title: "Autos",
      description: "Renta de vehículos en los principales destinos. Todas las categorías y compañías.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: "fa-umbrella-beach",
      title: "Paquetes",
      description: "Paquetes todo incluido personalizados. Vuelo + hotel + actividades al mejor precio.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: "fa-shield-alt",
      title: "Seguros",
      description: "Seguros de viaje completos. Cobertura médica, cancelación y equipaje.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: "fa-map-marked-alt",
      title: "Tours",
      description: "Excursiones y actividades en destino. Experiencias únicas con guías locales.",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest">
            Lo que ofrecemos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Nuestros Servicios
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Todo lo que necesitas para tu viaje perfecto, en un solo lugar y con
            atención personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <i className={`fas ${service.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
