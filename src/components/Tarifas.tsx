export default function Tarifas() {
  const tarifasAereas = [
    { rango: "0.5 - 10 kg", precio: "$14.50/kg", tiempo: "24-48h", incluye: "Recogida Guangzhou + Fuel + Security + Entrega puerta a puerta" },
    { rango: "10 - 50 kg", precio: "$12.80/kg", tiempo: "24-48h", incluye: "Consolidación + Fuel surcharge + Seguro básico + Entrega" },
    { rango: "50 - 100 kg", precio: "$11.20/kg", tiempo: "24-48h", incluye: "Prioridad aduanal + Tracking GPS + Seguro + Entrega" },
    { rango: "100 - 300 kg", precio: "$9.80/kg", tiempo: "24-48h", incluye: "Tarifa volumen + Account manager + Entrega express" },
    { rango: "+300 kg", precio: "Consultar", tiempo: "24-48h", incluye: "Tarifa corporativa + Charter dedicado si aplica" },
  ];

  const tarifasMaritimas = [
    { rango: "50 - 200 kg (LCL)", precio: "$5.20/kg", tiempo: "25-35 días", incluye: "Consolidación semanal Huangpu + THC + DUA + Entrega" },
    { rango: "200 - 500 kg (LCL)", precio: "$4.50/kg", tiempo: "25-35 días", incluye: "Prioridad consolidación + Seguro 0.3% + Entrega" },
    { rango: "500 - 1000 kg (LCL)", precio: "$3.90/kg", tiempo: "25-35 días", incluye: "Consolidación dedicada + Canal verde + Entrega" },
    { rango: "1000 - 2000 kg (LCL)", precio: "$3.40/kg", tiempo: "25-35 días", incluye: "Tarifa mayorista + Gestión aduanal prioritaria" },
    { rango: "Contenedor 20ft (FCL)", precio: "Desde $3,200", tiempo: "25-35 días", incluye: "Flete marítimo + THC origen/destino + DUA + Entrega" },
    { rango: "Contenedor 40ft (FCL)", precio: "Desde $4,500", tiempo: "25-35 días", incluye: "Máximo volumen + Mejor precio/m³ + Entrega nacional" },
    { rango: "Contenedor 40HQ (FCL)", precio: "Desde $4,800", tiempo: "25-35 días", incluye: "76 CBM + Alto cubicaje + Entrega a todo Venezuela" },
  ];

  const incluidos = [
    "Almacén gratis 30 días en Guangzhou (VB TRAVEL GLOBAL)",
    "Recepción ilimitada de paquetes de múltiples proveedores",
    "Consolidación, inspección visual y reempaque profesional",
    "Documentación completa: Factura Comercial, Packing List, BL/AWB, Certificado Origen",
    "Despacho aduanal China (export) + Venezuela (import SENIAT)",
    "Pago IVA 16% y aranceles (5-20% según HS Code) por cuenta nuestra",
    "Entrega puerta a puerta en TODA Venezuela (incluye últimos 100km)",
    "Tracking 24/7 con notificaciones proactivas por WhatsApp",
    "Seguro opcional todo riesgo (0.3% valor declarado, mín $5)",
    "Factura fiscal legal con RIF, IVA desglosado, deducible",
  ];

  const noIncluidos = [
    "Licencias de importación especiales: SAIA, INSAI, MPPS, CONATEL, MINCOMERCIO",
    "Certificados sanitarios/fitosanitarios (alimentos, bebidas, agro, madera)",
    "Inspección física aduanal canal rojo/amarillo (honorarios perito, fotógrafo)",
    "Almacenaje en puerto/airport > 5 días libres (demoras aduanas/operativas)",
    "Entrega en zonas remotas de difícil acceso (Amazonas, Delta Amacuro, fronteras)",
    "Re-embalaje especial por daño en origen (cajas de madera, cajas de seguridad)",
    "Gastos bancarios de transferencia internacional (corresponsalía)",
  ];

  return (
    <section id="precios" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Tarifas 2024 - Referencia Mercado Alibaba/1688
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Precios Transparentes, Todo Incluido Puerta a Puerta
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Precios basados en tarifas reales Alibaba Logistics + flete Guangzhou→Venezuela.
            Incluyen: flete + fuel/THC + aduanas SENIAT + IVA/aranceles + entrega final.
            Sin sorpresas. Pagas en USD o VES al cambio BCV oficial.
          </p>
        </div>

        {/* Aéreo */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-plane text-white"></i>
            </div>
            Aéreo Express (Guangzhou → Maiquetía → Tu Puerta)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Peso Facturable</th>
                  <th className="px-6 py-4 text-left">Precio/kg USD</th>
                  <th className="px-6 py-4 text-left">Tránsito</th>
                  <th className="px-6 py-4 text-left">Incluye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tarifasAereas.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{t.rango}</td>
                    <td className="px-6 py-4 text-orange-500 font-bold text-lg">{t.precio}</td>
                    <td className="px-6 py-4 text-slate-600">{t.tiempo}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.incluye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            * Peso facturable = mayor entre peso real y peso volumétrico (L×A×H/6000). 
            Incluye: flete aéreo + Fuel Surcharge (15-20%) + Security Charge (5%) + Manejo aeropuerto + IVA 16% + entrega última milla.
            Mínimo facturable: 0.5 kg. Válido para carga general (no DG, no perecibles).
          </p>
        </div>

        {/* Marítimo */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-ship text-white"></i>
            </div>
            Marítimo LCL/FCL (Huangpu/Shekou → La Guaira/Puerto Cabello → Tu Puerta)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Volumen / Tipo</th>
                  <th className="px-6 py-4 text-left">Precio USD</th>
                  <th className="px-6 py-4 text-left">Tránsito</th>
                  <th className="px-6 py-4 text-left">Incluye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tarifasMaritimas.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{t.rango}</td>
                    <td className="px-6 py-4 text-orange-500 font-bold text-lg">{t.precio}</td>
                    <td className="px-6 py-4 text-slate-600">{t.tiempo}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.incluye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            * LCL: Precio por kg (peso facturable = max(real, volumétrico L×A×H/6000)). 
            Incluye: flete marítimo + THC origen/destino + documentación + DUA SENIAT + IVA 16% + aranceles + entrega nacional.
            FCL: Precio por contenedor completo. Mínimo LCL: 50 kg / 0.5 CBM. Salidas semanales fijas.
          </p>
        </div>

        {/* Calculadora rápida */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Calculadora Rápida de Referencia</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
                <i className="fas fa-plane text-blue-500"></i> Aéreo - Ejemplos
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Smartphone 0.35 kg</span>
                  <span className="font-bold text-orange-500">~$5.10</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Ropa 5 kg (volumétrico 8 kg)</span>
                  <span className="font-bold text-orange-500">~$102</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Zapatillas 2 kg (caja 30×20×12)</span>
                  <span className="font-bold text-orange-500">~$29</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Laptop 2.5 kg</span>
                  <span className="font-bold text-orange-500">~$36</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                <i className="fas fa-ship text-green-500"></i> Marítimo LCL - Ejemplos
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Electrónicos 100 kg</span>
                  <span className="font-bold text-orange-500">~$520</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Ropa 300 kg</span>
                  <span className="font-bold text-orange-500">~$1,350</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Muebles 500 kg (2 CBM)</span>
                  <span className="font-bold text-orange-500">~$1,950</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Maquinaria 1,500 kg</span>
                  <span className="font-bold text-orange-500">~$5,100</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            Valores estimados TODO INCLUIDO (flete + aduanas + impuestos + entrega). 
            Usa el cotizador IA arriba para precio exacto con tus medidas reales.
          </p>
        </div>

        {/* Qué incluye / No incluye */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-green-600">
              <i className="fas fa-check-circle"></i> Qué SÍ Incluye (Todo Incluido)
            </h3>
            <ul className="space-y-3">
              {incluidos.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-red-600">
              <i className="fas fa-times-circle"></i> Qué NO Incluye (Costo Extra)
            </h3>
            <ul className="space-y-3">
              {noIncluidos.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <i className="fas fa-times text-red-500 mt-1"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Formas de pago */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Formas de Pago</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Paga en Bolívares (VES) al cambio BCV oficial del día o en USD. Factura fiscal emitida con IVA desglosado.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl backdrop-blur">
              <i className="fas fa-university text-orange-400"></i>
              <span>Transferencia Bancaria (USD/VES)</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl backdrop-blur">
              <i className="fas fa-credit-card text-green-400"></i>
              <span>Tarjeta Crédito/Débito (Stripe)</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl backdrop-blur">
              <i className="fas fa-mobile-alt text-blue-400"></i>
              <span>Pago Móvil / Zelle</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl backdrop-blur">
              <i className="fas fa-wallet text-purple-400"></i>
              <span>Binance Pay / USDT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
