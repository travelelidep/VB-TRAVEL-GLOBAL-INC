"use client";
import { useState } from "react";

const faqs = [
  {
    categoria: "Casillero y Compras",
    preguntas: [
      {
        q: "¿Cuánto cuesta abrir el casillero?",
        a: "Es completamente GRATIS. No hay cuota de apertura ni mensualidad. Solo pagas cuando envíes tus paquetes.",
      },
      {
        q: "¿Cuánto tiempo puedo dejar mis paquetes en el almacén?",
        a: "30 días gratis a partir de la recepción del primer paquete. Después: $0.50/kg/día. Te notificamos por WhatsApp antes de vencer.",
      },
      {
        q: "¿Puedo comprar en varias tiendas y consolidar?",
        a: "Sí, es nuestra especialidad. Recibimos de Taobao, 1688, Alibaba, Tmall, JD.com, Pinduoduo, etc. Consolidamos todo en un solo envío y ahorras hasta 40% en flete.",
      },
      {
        q: "¿Cómo sé que llegaron mis paquetes?",
        a: "Recibes notificación por WhatsApp al instante con foto del paquete, peso y dimensiones. También tienes acceso al portal cliente.",
      },
    ],
  },
  {
    categoria: "Envíos y Tiempos",
    preguntas: [
      {
        q: "¿Cuánto tarda el envío aéreo?",
        a: "24-48 horas desde que sale de Guangzhou hasta tu puerta en Venezuela. Vuelos directos Guangzhou → Maiquetía.",
      },
      {
        q: "¿Cuánto tarda el envío marítimo?",
        a: "25-35 días puerta a puerta. Salidas semanales desde Puerto Huangpu. Incluye: navegación + descarga + aduanas + entrega nacional.",
      },
      {
        q: "¿Puedo enviar baterías, líquidos o aerosoles?",
        a: "Aéreo: Solo baterías instaladas en equipos (IATA PI967). Marítimo: Baterías, líquidos, aerosoles permitidos con embalaje UN certificado. Consulta antes.",
      },
      {
        q: "¿Hay peso o tamaño mínimo?",
        a: "Aéreo: 0.5 kg mínimo. Marítimo LCL: 50 kg / 0.5 CBM mínimo. FCL: contenedor completo 20ft/40ft.",
      },
    ],
  },
  {
    categoria: "Aduanas e Impuestos",
    preguntas: [
      {
        q: "¿Quién paga los impuestos en Venezuela?",
        a: "Nosotros. El precio TODO INCLUIDO cubre: IVA 16% + Aranceles (5-20%) + Tasa SENIAT + Flete nacional. Tú recibes en tu puerta sin pagos extra.",
      },
      {
        q: "¿Qué documentos necesito?",
        a: "Solo tu RUC/RIF y cédula. Nosotros preparamos: Factura Comercial, Packing List, BL/AWB, Certificado Origen, DUA SENIAT. Si tu producto requiere licencia (alimentos, medicinas, agro), te guiamos.",
      },
      {
        q: "¿Qué pasa si aduanas selecciona mi carga para inspección?",
        a: "Canal verde: Liberación automática. Canal amarillo: Revisión documental (1-2 días). Canal rojo: Inspección física (3-5 días). Te informamos en cada paso y gestionamos todo.",
      },
      {
        q: "¿Puedo importar mercancía restringida?",
        a: "Algunos productos requieren licencias previas: alimentos (MPPS/INSAI), medicinas (MPPS), agro (INIA), telecomunicaciones (CONATEL). Te asesoramos gratis antes de comprar.",
      },
    ],
  },
  {
    categoria: "Pagos y Facturación",
    preguntas: [
      {
        q: "¿En qué moneda pago?",
        a: "USD o VES (Bolivares) al cambio oficial BCV del día de la factura. Recibes factura fiscal con IVA desglosado.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Transferencia bancaria (Banesco, Mercantil, BOD, BNC), Tarjeta crédito/débito (Stripe), Pago Móvil, Zelle, Binance Pay/USDT.",
      },
      {
        q: "¿Cuándo pago?",
        a: "Aéreo: Pago antes del embarque. Marítimo: 50% al consolidar + 50% antes de la llegada a puerto. FCL: Según acuerdo.",
      },
      {
        q: "¿Emite factura fiscal?",
        a: "Sí, factura legal con RIF, IVA desglosado, válida para contabilidad y deducción de impuestos en Venezuela.",
      },
    ],
  },
  {
    categoria: "Seguros y Reclamos",
    preguntas: [
      {
        q: "¿Incluye seguro?",
        a: "Opcional. Seguro todo riesgo: 0.3% del valor declarado (mín $5). Cubre: pérdida total, daño, robo, humedad, demoras > 7 días. Recomendado para electrónicos y alto valor.",
      },
      {
        q: "¿Qué hago si mi paquete llega dañado?",
        a: "1) No lo recibas sin anotar \'dañado\' en la guía. 2) Fotografía todo. 3) Reporta en 24h por WhatsApp. 4) Gestionamos reclamo con seguro/transportista. Respuesta en 48h.",
      },
      {
        q: "¿Cubren demoras?",
        a: "Con seguro: Sí, demoras > 7 días hábiles. Sin seguro: No cubrimos demoras por aduanas, clima, force majeure. Te mantenemos informado proactivamente.",
      },
    ],
  },
];

export default function Preguntas() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    const next = new Set(openIndexes);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setOpenIndexes(next);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Todo lo que Necesitas Saber
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            ¿Tienes más dudas? Escríbenos por WhatsApp y te respondemos en minutos.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((cat, catIdx) => (
            <div key={catIdx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <h3 className="text-lg font-semibold">{cat.categoria}</h3>
              </div>
              <div className="p-4">
                {cat.preguntas.map((faq, qIdx) => {
                  const globalIdx = catIdx * 100 + qIdx;
                  const isOpen = openIndexes.has(globalIdx);
                  return (
                    <details
                      key={qIdx}
                      className="group bg-white rounded-xl border border-slate-200 mb-3 overflow-hidden"
                      open={isOpen}
                      onToggle={() => toggle(globalIdx)}
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-8">{faq.q}</span>
                        <i className={`fas fa-chevron-down text-orange-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}></i>
                      </summary>
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in-up">
                        {faq.a}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl font-bold mb-3">¿No Encontraste tu Respuesta?</h3>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Nuestro equipo te atiende 24/7 por WhatsApp. Sin bots, personas reales expertas en China-Venezuela.
            </p>
            <a
              href="https://wa.me/58416111157?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20mi%20env%C3%ADo%20China-Venezuela"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition"
            >
              <i className="fab fa-whatsapp"></i> Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
