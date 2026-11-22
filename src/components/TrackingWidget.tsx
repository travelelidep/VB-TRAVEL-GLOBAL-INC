"use client";
import { useState } from "react";

interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

const mockTrackingData: Record<string, TrackingEvent[]> = {
  "VBG123456": [
    { date: "2024-01-15 14:30", location: "Guangzhou, China", status: "Recibido en Almacén VB", description: "Paquetes recibidos en almacén VB TRAVEL GLOBAL Guangzhou. Pendiente consolidación.", icon: "fa-warehouse", completed: true, current: false },
    { date: "2024-01-16 09:00", location: "Guangzhou, China", status: "Consolidado", description: "Paquetes consolidados en contenedor LCL. Documentación preparada.", icon: "fa-boxes-stacked", completed: true, current: false },
    { date: "2024-01-17 16:00", location: "Guangzhou, China", status: "Despacho Aduanal China", description: "Export declaration aceptada. Contenedor sellado en origen.", icon: "fa-file-export", completed: true, current: false },
    { date: "2024-01-18 10:00", location: "Puerto Huangpu", status: "Embarcado", description: "Cargado en vessel COSCO SHIPPING VIRGO v.045E. ETD: 2024-01-19.", icon: "fa-ship", completed: true, current: false },
    { date: "2024-02-10 08:00", location: "Puerto La Guaira", status: "Llegada a Puerto", description: "Buque atracado. Iniciando descarga y trámites aduanales Venezuela.", icon: "fa-anchor", completed: true, current: false },
    { date: "2024-02-12 14:00", location: "La Guaira, Venezuela", status: "Despacho Aduanal SENIAT", description: "DUA presentado. Pago IVA/aranceles. Inspección física completada.", icon: "fa-file-import", completed: true, current: false },
    { date: "2024-02-13 09:00", location: "La Guaira → Caracas", status: "En Tránsito Nacional", description: "Carga liberada. En ruta hacia almacén Caracas para entrega final.", icon: "fa-truck", completed: true, current: false },
    { date: "2024-02-14 10:30", location: "Caracas, Venezuela", status: "Entregado", description: "Entregado en destino final. Firmado por: Juan Pérez. Estado: Buen estado.", icon: "fa-check-circle", completed: true, current: true },
  ],
  "VBG789012": [
    { date: "2024-01-20 10:00", location: "Guangzhou, China", status: "Recibido en Almacén VB", description: "Paquetería aérea recibida. Peso: 45kg. Dims: 60x40x30cm.", icon: "fa-warehouse", completed: true, current: false },
    { date: "2024-01-20 18:00", location: "Guangzhou, China", status: "Despacho Express", description: "Documentación aérea lista. Programado en vuelo CA867 (Air China).", icon: "fa-plane", completed: true, current: false },
    { date: "2024-01-21 06:00", location: "Guangzhou → Caracas", status: "En Vuelo", description: "Vuelo CA867 despegado. ETA Caracas: 2024-01-21 14:30 (hora local).", icon: "fa-plane-departure", completed: true, current: false },
    { date: "2024-01-21 15:00", location: "Aeropuerto Maiquetía", status: "Llegada Aeropuerto", description: "Vuelo aterrizado. Carga en terminal de carga. Iniciando trámites.", icon: "fa-plane-arrival", completed: true, current: false },
    { date: "2024-01-21 18:00", location: "Maiquetía, Venezuela", status: "Despacho Aduanal", description: "DUA aéreo procesado. Liberado sin inspección. Listo para entrega.", icon: "fa-file-import", completed: true, current: false },
    { date: "2024-01-22 09:00", location: "Caracas, Venezuela", status: "En Reparto", description: "En vehículo de última milla. ETA entrega: 11:00-13:00.", icon: "fa-truck", completed: false, current: true },
    { date: "2024-01-22", location: "Caracas, Venezuela", status: "Pendiente Entrega", description: "Programado para hoy.", icon: "fa-clock", completed: false, current: false },
  ],
};

export default function TrackingWidget() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingEvent[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      const data = mockTrackingData[trackingNumber.toUpperCase()];
      if (data) {
        setTrackingData(data);
      } else {
        setError("Número de guía no encontrado. Verifica tu tracking VBGXXXXXX");
      }
      setLoading(false);
    }, 800);
  };

  const getStatusColor = (completed: boolean, current: boolean) => {
    if (completed) return "text-green-500 bg-green-100";
    if (current) return "text-orange-500 bg-orange-100 animate-pulse";
    return "text-slate-400 bg-slate-100";
  };

  const getLineColor = (index: number, data: TrackingEvent[]) => {
    if (index === data.length - 1) return "transparent";
    return data[index + 1].completed ? "green-500" : "slate-200";
  };

  return (
    <section id="rastreo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Rastreo de Envíos VB TRAVEL GLOBAL
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Tracking en Tiempo Real
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Ingresa tu número de guía (VBG + 6 dígitos) y consulta el estado completo de tu envío.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => { setTrackingNumber(e.target.value.toUpperCase()); setError(""); }}
                placeholder="VBG123456"
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !trackingNumber}
              className="mt-4 w-full btn-primary py-3 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Buscando...
                </span>
              ) : (
                "Rastrear Envío"
              )}
            </button>
          </form>
        </div>

        {trackingData && (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm">Guía</p>
                  <p className="font-bold text-xl">{trackingNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Estado Actual</p>
                  <p className="font-bold text-xl text-orange-400">
                    {trackingData.find(d => d.current)?.status || "En tránsito"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Última Actualización</p>
                  <p className="font-bold text-xl">
                    {trackingData[trackingData.length - 1]?.date.split(" ")[0]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Próximo Paso</p>
                  <p className="font-bold text-xl">
                    {trackingData.find(d => !d.completed && !d.current)?.status || "Entrega"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  <i className="fas fa-ship mr-1"></i> Marítimo LCL
                </span>
                <span className="px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm">
                  <i className="fas fa-check mr-1"></i> Aduanas OK
                </span>
                <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  <i className="fas fa-truck mr-1"></i> Última milla
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-history text-orange-500"></i> Historial Completo
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {trackingData.map((event, idx) => (
                  <div
                    key={idx}
                    className="relative pl-10 pb-8 tracking-timeline"
                    style={{ borderLeftColor: getLineColor(idx, trackingData) } as React.CSSProperties}
                  >
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 bg-white"
                         style={{ borderColor: getStatusColor(event.completed, event.current).replace("text-", "").replace("bg-", "border-") } as React.CSSProperties}>
                      <i className={`fas ${event.icon} text-xs`} style={{ color: getStatusColor(event.completed, event.current).replace("bg-", "text-") } as React.CSSProperties}></i>
                    </div>
                    <div className={`bg-slate-50/50 rounded-xl p-4 ml-4 ${event.current ? "ring-2 ring-orange-200" : ""}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{event.status}</span>
                            {event.current && <span className="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded">ACTUAL</span>}
                            {event.completed && !event.current && <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded">COMPLETADO</span>}
                          </div>
                          <p className="text-slate-600 text-sm">{event.description}</p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="text-sm font-medium text-slate-700">{event.location}</p>
                          <p className="text-xs text-slate-500">{event.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <a
                href={`https://wa.me/58416111157?text=Consulta%20tracking%20${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
              >
                <i className="fab fa-whatsapp"></i> Consultar por WhatsApp
              </a>
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
                <i className="fas fa-bell"></i> Activar Notificaciones
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
