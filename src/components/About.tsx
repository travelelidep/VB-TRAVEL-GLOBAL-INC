export default function About() {
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side */}
          <div>
            <span className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest">
              Sobre nosotros
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Tu viaje perfecto comienza con{" "}
              <span className="text-[var(--color-primary)]">MD Travel Global</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Somos una agencia de viajes comprometida con ofrecer las mejores
              experiencias de viaje a precios competitivos. Con acceso a tarifas
              mayoristas exclusivas y tecnología de punta, hacemos que planificar
              tu viaje sea fácil y seguro.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Nuestro equipo de agentes especializados está disponible 24/7 para
              ayudarte a encontrar las mejores opciones para tu presupuesto y
              preferencias.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-check text-[var(--color-primary)]"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Precios Garantizados</h4>
                  <p className="text-sm text-gray-500">Las mejores tarifas del mercado</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-lock text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pagos Seguros</h4>
                  <p className="text-sm text-gray-500">Transacciones 100% protegidas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-star text-amber-500"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">+5 Años</h4>
                  <p className="text-sm text-gray-500">De experiencia en el sector</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Miles de Clientes</h4>
                  <p className="text-sm text-gray-500">Satisfechos en todo el mundo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side — testimonials */}
          <div className="space-y-6">
            {[
              {
                text: "Excelente servicio. Conseguí un vuelo a Madrid por mucho menos de lo que encontré en otras páginas. ¡100% recomendado!",
                name: "María García",
                role: "Viajera frecuente",
                stars: 5,
              },
              {
                text: "El equipo de MD Travel me ayudó a planificar mis vacaciones familiares a Cancún. Todo perfecto, desde el vuelo hasta el hotel.",
                name: "Carlos Rodríguez",
                role: "Vacaciones familiares",
                stars: 5,
              },
              {
                text: "Rápidos, profesionales y con los mejores precios. Mi agencia de viajes de confianza para todos mis viajes de negocio.",
                name: "Ana Martínez",
                role: "Viajera de negocios",
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <i key={i} className="fas fa-star text-sm"></i>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
