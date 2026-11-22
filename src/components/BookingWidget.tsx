export default function BookingWidget() {
  return (
    <section id="reservar" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest">
            Motor de reservas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Reserva Ahora
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Accede a nuestro motor de reservas con tarifas mayoristas exclusivas.
            Busca y compara entre miles de opciones.
          </p>
        </div>

        {/* WINGS Booking Widget Integration */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center text-white mb-8">
              <i className="fas fa-globe-americas text-5xl mb-4 opacity-80"></i>
              <h3 className="text-2xl font-bold mb-2">Motor de Reservas WINGS</h3>
              <p className="text-blue-100 max-w-lg mx-auto">
                Busca vuelos, hoteles, autos y más con acceso a tarifas
                mayoristas de más de 90 aerolíneas y 1 millón de hoteles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <i className="fas fa-tag text-[var(--color-accent-light)] text-2xl mb-2"></i>
                <h4 className="text-white font-semibold">Precios Mayoristas</h4>
                <p className="text-blue-200 text-sm mt-1">Tarifas exclusivas no disponibles al público</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <i className="fas fa-bolt text-[var(--color-accent-light)] text-2xl mb-2"></i>
                <h4 className="text-white font-semibold">Reserva Instantánea</h4>
                <p className="text-blue-200 text-sm mt-1">Confirmación inmediata en tiempo real</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <i className="fas fa-headset text-[var(--color-accent-light)] text-2xl mb-2"></i>
                <h4 className="text-white font-semibold">Soporte 24/7</h4>
                <p className="text-blue-200 text-sm mt-1">Asistencia personalizada siempre disponible</p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://mdtravelgloballlc.mywingsbooking.com/es/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white px-10 py-4 rounded-full text-lg font-bold transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <i className="fas fa-search mr-3"></i>
                Buscar y Reservar Ahora
                <i className="fas fa-arrow-right ml-3"></i>
              </a>
              <p className="text-blue-200 text-xs mt-4">
                Serás redirigido a nuestro motor de reservas seguro powered by WINGS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
