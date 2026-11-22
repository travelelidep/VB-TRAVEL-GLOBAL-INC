export default function Destinations() {
  const destinations = [
    {
      name: "Cancún",
      country: "México",
      price: "Desde $299",
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80",
      tag: "Popular",
    },
    {
      name: "Punta Cana",
      country: "República Dominicana",
      price: "Desde $349",
      image: "https://images.unsplash.com/photo-1580237541049-2d715a09486e?w=600&q=80",
      tag: "Todo Incluido",
    },
    {
      name: "Madrid",
      country: "España",
      price: "Desde $499",
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80",
      tag: "Europa",
    },
    {
      name: "Miami",
      country: "Estados Unidos",
      price: "Desde $149",
      image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&q=80",
      tag: "Ofertas",
    },
    {
      name: "Bogotá",
      country: "Colombia",
      price: "Desde $199",
      image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&q=80",
      tag: "Sudamérica",
    },
    {
      name: "París",
      country: "Francia",
      price: "Desde $549",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
      tag: "Romántico",
    },
  ];

  return (
    <section id="destinos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest">
            Explora el mundo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Destinos Populares
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Los destinos más solicitados por nuestros viajeros, con tarifas exclusivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {dest.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                <p className="text-gray-300 text-sm">{dest.country}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[var(--color-accent-light)] font-bold text-lg">
                    {dest.price}
                  </span>
                  <button className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition">
                    Ver más →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
