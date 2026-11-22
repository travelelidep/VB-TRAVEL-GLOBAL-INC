"use client";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  supplier: string;
  moq: string;
  shipping: string;
  rating: number;
  orders: number;
  category: string;
  weight?: string;
  dimensions?: string;
  source: "alibaba" | "1688" | "taobao" | "tmall" | "jd" | "pinduoduo";
  url: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Smartphone Android 128GB 6.5\" Pantalla Completa 5G Dual SIM",
    price: "$89.00",
    originalPrice: "$129.00",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Smartphone",
    supplier: "Shenzhen Tech Electronics Co., Ltd",
    moq: "10 piezas",
    shipping: "Envío a Guangzhou gratis",
    rating: 4.8,
    orders: 1250,
    category: "Electrónicos",
    weight: "0.35 kg",
    dimensions: "16×8×1 cm",
    source: "alibaba",
    url: "https://www.alibaba.com/product-detail/Smartphone-Android-128GB_1600123456789.html",
  },
  {
    id: "2",
    title: "Ropa Deportiva Conjunto Hombre/Mujer Poliéster Transpirable Gym Running",
    price: "$4.50",
    originalPrice: "$7.90",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Ropa+Deportiva",
    supplier: "Guangzhou Fashion Wholesale Market",
    moq: "50 conjuntos",
    shipping: "Listo para enviar 24h",
    rating: 4.6,
    orders: 3420,
    category: "Ropa",
    weight: "0.28 kg",
    dimensions: "30×25×3 cm",
    source: "1688",
    url: "https://detail.1688.com/offer/1234567890.html",
  },
  {
    id: "3",
    title: "Auriculares Bluetooth 5.3 TWS Cancelación Ruido 30h Batería",
    price: "$12.80",
    originalPrice: "$19.90",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Auriculares",
    supplier: "Dongguan Audio Technology Factory",
    moq: "20 piezas",
    shipping: "Envío gratis >100 unidades",
    rating: 4.7,
    orders: 890,
    category: "Electrónicos",
    weight: "0.12 kg",
    dimensions: "6×5×3 cm",
    source: "taobao",
    url: "https://item.taobao.com/item.htm?id=1234567890",
  },
  {
    id: "4",
    title: "Zapatillas Running Hombre Knit Ligero Suela Air Amortiguación",
    price: "$15.60",
    originalPrice: "$24.90",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Zapatillas",
    supplier: "Putian Shoes Manufacturing Co.",
    moq: "30 pares",
    shipping: "Stock en Guangzhou",
    rating: 4.5,
    orders: 2100,
    category: "Calzado",
    weight: "0.85 kg",
    dimensions: "32×20×12 cm",
    source: "1688",
    url: "https://detail.1688.com/offer/2345678901.html",
  },
  {
    id: "5",
    title: "Reloj Inteligente Smartwatch 1.9\" Llamadas Bluetooth Monitor Salud",
    price: "$18.90",
    originalPrice: "$29.90",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Smartwatch",
    supplier: "Shenzhen Wearable Tech Ltd",
    moq: "15 piezas",
    shipping: "Envío 48h a almacén",
    rating: 4.6,
    orders: 1680,
    category: "Electrónicos",
    weight: "0.18 kg",
    dimensions: "4×4×1.5 cm",
    source: "alibaba",
    url: "https://www.alibaba.com/product-detail/Smartwatch-1.9-inch_1600234567890.html",
  },
  {
    id: "6",
    title: "Mochila Escolar Universitaria Impermeable USB Carga Portátil 15.6\"",
    price: "$6.20",
    originalPrice: "$9.80",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Mochila",
    supplier: "Quanzhou Bags Factory Direct",
    moq: "40 piezas",
    shipping: "Envío gratis a Guangzhou",
    rating: 4.7,
    orders: 2890,
    category: "Accesorios",
    weight: "0.55 kg",
    dimensions: "45×30×15 cm",
    source: "pinduoduo",
    url: "https://mobile.pinduoduo.com/goods.html?goods_id=1234567890",
  },
  {
    id: "7",
    title: "Cocina Eléctrica Portátil 2 Hornillas Control Temperatura 2000W",
    price: "$22.50",
    originalPrice: "$35.00",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Cocina+El%C3%A9ctrica",
    supplier: "Zhongshan Kitchen Appliance Co.",
    moq: "8 piezas",
    shipping: "Stock en almacén VB",
    rating: 4.4,
    orders: 560,
    category: "Hogar",
    weight: "3.2 kg",
    dimensions: "50×30×10 cm",
    source: "tmall",
    url: "https://detail.tmall.com/item.htm?id=1234567890",
  },
  {
    id: "8",
    title: "Set Herramientas Eléctricas Taladro Sierra Lijadora 20V Litio",
    price: "$45.00",
    originalPrice: "$68.00",
    image: "https://via.placeholder.com/300x300/0f172a/ffffff?text=Herramientas",
    supplier: "Ningbo Power Tools Manufacturing",
    moq: "5 sets",
    shipping: "Envío pesado marítimo",
    rating: 4.8,
    orders: 340,
    category: "Herramientas",
    weight: "8.5 kg",
    dimensions: "40×35×20 cm",
    source: "alibaba",
    url: "https://www.alibaba.com/product-detail/Power-Tools-Set_1600345678901.html",
  },
];

const SOURCE_CONFIG = {
  alibaba: { label: "Alibaba", color: "bg-orange-500", icon: "🏪" },
  "1688": { label: "1688", color: "bg-red-500", icon: "🏭" },
  taobao: { label: "Taobao", color: "bg-blue-500", icon: "🛍️" },
  tmall: { label: "Tmall", color: "bg-black", icon: "🏬" },
  jd: { label: "JD.com", color: "bg-red-600", icon: "📦" },
  pinduoduo: { label: "Pinduoduo", color: "bg-orange-600", icon: "🍊" },
};

export default function BuscadorProductos() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ["all", "Electrónicos", "Ropa", "Calzado", "Accesorios", "Hogar", "Herramientas", "Belleza", "Deportes", "Juguetes", "Automóvil"];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = MOCK_PRODUCTS;
      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      if (category !== "all") {
        filtered = filtered.filter(p => p.category === category);
      }
      setResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const cotizadorSection = document.getElementById("cotizar");
    if (cotizadorSection) {
      cotizadorSection.scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem("vb_selected_product", JSON.stringify({
      ...product,
      valorCarga: product.price.replace("$", ""),
      contenido: product.title,
      peso: product.weight,
      dimensiones: product.dimensions,
    }));
  };

  return (
    <section id="buscador" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Buscador de Productos China
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Encuentra, Cotiza y Envía en Un Solo Lugar
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Busca en Alibaba, 1688, Taobao, Tmall, JD.com y Pinduoduo. 
            Selecciona un producto y nuestra IA calcula el envío puerta a puerta a Venezuela al instante.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="¿Qué quieres comprar? Ej: smartphone, ropa, herramientas, zapatillas..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white min-w-[180px] text-lg"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c !== "all").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><i className="fas fa-spinner fa-spin"></i> Buscando...</span>
                ) : (
                  <>
                    <i className="fas fa-magnifying-glass"></i> Buscar
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {["smartphone", "ropa deportiva", "zapatillas", "auriculares", "mochila", "herramientas", "relojes inteligentes", "cocina eléctrica"].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setQuery(tag); }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-orange-100 hover:text-orange-600 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["alibaba", "1688", "taobao", "tmall", "jd", "pinduoduo"].map(source => {
            const config = SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG];
            return (
              <a
                key={source}
                href={`https://www.${source === "1688" ? "1688.com" : source === "taobao" ? "taobao.com" : source === "tmall" ? "tmall.com" : source === "jd" ? "jd.com" : source === "pinduoduo" ? "pinduoduo.com" : "alibaba.com"}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 ${config.color} text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg`}
              >
                <span>{config.icon}</span> {config.label}
              </a>
            );
          })}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {results.length} producto{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
            </h3>
            {selectedProduct && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
                ✅ Producto seleccionado: <strong>{selectedProduct.title.substring(0, 40)}...</strong> → Ve al cotizador
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => {
              const config = SOURCE_CONFIG[product.source];
              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.color} text-white`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                        title="Seleccionar para cotizar envío"
                      >
                        <i className="fas fa-plus text-orange-500 group-hover:text-white"></i>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-orange-500 transition-colors text-sm">
                      {product.title}
                    </h4>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-orange-500">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <i className="fas fa-star text-yellow-400"></i>
                      <span>{product.rating}</span>
                      <span>·</span>
                      <span>{product.orders.toLocaleString()} vendidos</span>
                    </div>

                    <div className="text-xs text-slate-500 line-clamp-1">
                      {product.supplier}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        MOQ: {product.moq}
                      </span>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-500 hover:underline flex items-center gap-1"
                      >
                        Ver en {config.label} <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-lg p-2">
                      <div>
                        <span className="text-slate-400">Peso: </span>
                        <span className="font-medium text-slate-700">{product.weight}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Dims: </span>
                        <span className="font-medium text-slate-700">{product.dimensions}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {results.length === 0 && (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-slate-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No se encontraron productos</h3>
              <p className="text-slate-500">Intenta con otros términos de búsqueda o categorías</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">¿Cómo Funciona la Compra + Envío Integrado?</h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-search text-orange-400 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-1">1. Busca</h4>
              <p className="text-slate-400 text-sm">Encuentra productos en Alibaba, 1688, Taobao...</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-calculator text-blue-400 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-1">2. Selecciona</h4>
              <p className="text-slate-400 text-sm">Click en + y la IA pre-calcula peso, dims, valor</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-box-open text-green-400 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-1">3. Cotiza</h4>
              <p className="text-slate-400 text-sm">Recibe precio total puerta a puerta en segundos</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-truck text-purple-400 text-2xl"></i>
              </div>
              <h4 className="font-semibold mb-1">4. Recibe</h4>
              <p className="text-slate-400 text-sm">Casillero gratis + entrega en tu puerta Venezuela</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
