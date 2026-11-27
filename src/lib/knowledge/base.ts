import type { EntradaConocimiento, TerminoGlosario } from "./tipos";

/**
 * Base de conocimiento del asesor: exportación desde China, importación a
 * Venezuela, documentos, transporte y aduanas. Contenido informativo, no
 * asesoría legal: las alícuotas y requisitos cambian y debe confirmarlos el
 * agente aduanal o el organismo competente.
 */
export const BASE_CONOCIMIENTO: EntradaConocimiento[] = [
  {
    id: "comprar-en-china",
    categoria: "China",
    titulo: "Cómo comprar en 1688, Taobao, Alibaba y Tmall sin cuenta china",
    claves: [
      "comprar", "1688", "taobao", "alibaba", "tmall", "pinduoduo", "cuenta china",
      "agente de compras", "alipay", "yuan", "proveedor", "mayorista", "dropshipping",
    ],
    resumen:
      "Las plataformas chinas piden cuenta local, teléfono chino y medios de pago chinos. El camino práctico es comprar a través de un agente o usar la dirección de tu casillero en China.",
    detalle: [
      "1688 y Taobao son mayoristas/minoristas para el mercado interno; Alibaba.com está en inglés y trabaja con exportación; Tmall es la vitrina de marcas.",
      "Sin cuenta china puedes pagar por agente de compras (te cobra una comisión sobre el valor de la mercancía) o pedirle al proveedor de Alibaba que acepte pago internacional.",
      "Compra siempre con factura: sin factura comercial el despacho en Venezuela se complica y el valor se estima por aforo.",
      "Verifica al proveedor: antigüedad, volumen de ventas, reseñas y si acepta muestras antes del pedido grande.",
      "Guarda el enlace del producto, la conversación con el proveedor y el comprobante de pago: son tu respaldo si hay diferencias en la mercancía.",
    ],
    fuentes: ["Práctica comercial", "Alibaba.com Buyer Central"],
    enlaces: [{ titulo: "Alibaba.com", url: "https://www.alibaba.com" }],
  },
  {
    id: "declaracion-exportacion-china",
    categoria: "China",
    titulo: "Declaración de exportación en China (报关单)",
    claves: [
      "declaracion", "exportacion", "aduana china", "gacc", "agente aduanal china",
      "despacho exportacion", "报关", "shipper", "exportador",
    ],
    resumen:
      "Toda salida legal de mercancía de China pasa por una declaración de exportación ante la Aduana china (GACC). La presenta el exportador o su agente aduanal, no el comprador.",
    detalle: [
      "La declaración incluye código HS, descripción, cantidad, valor, destino y régimen (exportación general, reexportación, etc.).",
      "El exportador debe estar registrado ante la aduana china y tener licencia de comercio exterior.",
      "Si compras a un proveedor que no exporta, normalmente un agente de carga (freight forwarder) consolida tu mercancía y aparece como exportador.",
      "La declaración china es un documento distinto de la declaración venezolana: una cubre la salida de China y la otra la entrada a Venezuela.",
      "Pide copia de la declaración: sirve para demostrar origen y valor si hay una verificación posterior.",
    ],
    fuentes: ["GACC — Administración General de Aduanas de China"],
    enlaces: [{ titulo: "GACC (Aduana de China)", url: "http://www.customs.gov.cn" }],
  },
  {
    id: "inspeccion-ciq",
    categoria: "China",
    titulo: "Inspección de mercancías (CIQ) y cuándo aplica",
    claves: [
      "ciq", "inspeccion", "cuarentena", "fitosanitario china", "sanitario china",
      "certificado inspeccion", "alimentos", "cosmeticos",
    ],
    resumen:
      "La inspección y cuarentena (CIQ) aplica sobre todo a alimentos, cosméticos, material vegetal y animal, y a mercancías sujetas a normas técnicas chinas.",
    detalle: [
      "El exportador solicita la inspección y obtiene un certificado que acompaña al embarque.",
      "Sin el certificado, la aduana china puede rechazar el despacho o el país de destino puede exigir análisis adicionales.",
      "Para productos perecederos el trámite incluye registro del fabricante y etiquetado en el idioma del destino cuando el destino lo exige.",
      "Si tu producto es electrónico o textil, normalmente no necesita CIQ, pero sí puede necesitar certificaciones de producto.",
    ],
    fuentes: ["GACC — Inspección y Cuarentena"],
  },
  {
    id: "iva-exportacion-china",
    categoria: "China",
    titulo: "IVA de exportación en China y devolución al exportador",
    claves: [
      "iva china", "devolucion iva", "reembolso impuesto", "export refund", "13%",
      "impuesto exportacion", "vat refund",
    ],
    resumen:
      "China aplica IVA a la venta interna y devuelve total o parcialmente ese IVA al exportar. La tasa de devolución depende del código HS del producto.",
    detalle: [
      "La devolución la gestiona el exportador chino, no el comprador venezolano; por eso algunos proveedores cotizan más barato si exportas a través de ellos.",
      "La tasa de reembolso varía por producto y puede ser menor que el IVA pagado, así que no siempre es un 13 % completo.",
      "Un agente de carga con licencia de exportación suele encargarse de este trámite cuando compras a varios proveedores pequeños.",
      "Este impuesto no se traslada a Venezuela: el IVA que pagas al importar es el venezolano.",
    ],
    fuentes: ["Administración Estatal de Impuestos de China (SAT)"],
  },
  {
    id: "embalaje-madera",
    categoria: "China",
    titulo: "Embalaje de madera y certificado de fumigación (ISPM-15)",
    claves: [
      "madera", "pallet", "paleta", "fumigacion", "ispm 15", "embalaje", "caja madera",
      "certificado fitosanitario",
    ],
    resumen:
      "Todo embalaje de madera maciza (pallets, cajas, tacos) debe estar tratado y marcado según la norma ISPM-15 o el país de destino lo rechaza.",
    detalle: [
      "El marcado IPPC va grabado en la madera e indica el tratamiento (calor o bromuro) y el país de origen.",
      "Si tu carga va sobre pallet de madera sin marca, la aduana puede ordenar reembalaje, fumigación o devolución, con costo a tu cargo.",
      "Alternativa: usar pallets de plástico o cartón, que no requieren tratamiento.",
      "Pide al proveedor o al almacén la foto del pallet marcado antes de consolidar.",
    ],
    fuentes: ["Convención Internacional de Protección Fitosanitaria (IPPC)"],
    enlaces: [{ titulo: "IPPC — ISPM 15", url: "https://www.ippc.int" }],
  },
  {
    id: "baterias-litio",
    categoria: "Restricciones",
    titulo: "Baterías de litio y mercancía peligrosa",
    claves: [
      "bateria", "litio", "power bank", "un38.3", "msds", "peligrosa", "dg",
      "iata", "imdg", "inflamable", "aerosol",
    ],
    resumen:
      "Las baterías de litio, los aerosoles y los líquidos inflamables son mercancía peligrosa: necesitan ficha de seguridad (MSDS), ensayo UN38.3 y embalaje homologado.",
    detalle: [
      "Sin UN38.3 y MSDS, las aerolíneas no aceptan la carga y el marítimo puede exigir declaración de mercancía peligrosa (IMDG).",
      "Las baterías sueltas suelen viajar solo por marítimo; los equipos con batería instalada pueden ir por aéreo con restricciones.",
      "Power banks y patinetes eléctricos tienen límites de vatios-hora y requieren embalaje específico.",
      "Declara siempre el contenido real: ocultar una batería en la declaración es la causa más común de rechazo y de sanción.",
    ],
    fuentes: ["IATA DGR", "Código IMDG (OMI)"],
  },
  {
    id: "certificaciones-electronica",
    categoria: "China",
    titulo: "Certificaciones para electrónica y juguetes (CE, FCC, RoHS, CCC)",
    claves: [
      "ce", "fcc", "rohs", "ccc", "certificacion", "electronica", "juguetes", "en71",
      "homologacion", "norma tecnica",
    ],
    resumen:
      "Muchos productos necesitan certificados de producto además de la factura: CE/FCC/RoHS para electrónica, EN71 para juguetes, CCC si se vende dentro de China.",
    detalle: [
      "El proveedor debe entregar el certificado y el informe de ensayo del laboratorio; una foto del logo no es prueba suficiente.",
      "En Venezuela, los equipos de telecomunicaciones requieren homologación ante CONATEL antes de comercializarse.",
      "Los juguetes y artículos infantiles suelen requerir certificación de normas de seguridad ante SENCAMER.",
      "Si el producto no tiene certificado, el riesgo es que la aduana lo retenga o que no puedas venderlo legalmente.",
    ],
    fuentes: ["CONATEL", "SENCAMER"],
    enlaces: [
      { titulo: "CONATEL", url: "https://www.conatel.gob.ve" },
      { titulo: "SENCAMER", url: "http://www.sencamer.gob.ve" },
    ],
  },
  {
    id: "productos-restringidos-china",
    categoria: "Restricciones",
    titulo: "Productos con licencia de exportación en China",
    claves: [
      "licencia exportacion", "restringido", "dual use", "doble uso", "cifrado",
      "drones", "quimicos", "metales", "tierra rara", "prohibido china",
    ],
    resumen:
      "China exige licencia de exportación para productos de doble uso, drones, equipos de cifrado, ciertos químicos, metales y tecnologías sensibles.",
    detalle: [
      "La lista de control de exportación se actualiza con frecuencia; verifica el producto y su código HS antes de pagar.",
      "Los equipos de radiofrecuencia y cifrado pueden requerir autorización adicional aunque sean de uso civil.",
      "Los drones y sus repuestos tienen controles específicos por potencia y alcance.",
      "Si el proveedor dice que 'no se puede exportar', no insistas con otro proveedor: el problema es del producto, no del vendedor.",
    ],
    fuentes: ["MOFCOM — Control de exportaciones de China"],
  },
  {
    id: "almacen-guangzhou",
    categoria: "China",
    titulo: "Almacén y consolidación en Guangzhou, Shenzhen y Yiwu",
    claves: [
      "almacen", "consolidacion", "guangzhou", "shenzhen", "yiwu", "casillero china",
      "bodega", "reempaque", "recepcion",
    ],
    resumen:
      "Comprar en varios proveedores significa recibir en un almacén en China, revisar, reempacar y consolidar en un solo embarque.",
    detalle: [
      "Cada paquete que llega al almacén se identifica con tu código de casillero (VBG) y se registra con peso y medidas.",
      "La consolidación reduce costo: pagas un solo flete en vez de varios envíos pequeños.",
      "Revisa el estado de los bultos al recibir: golpes, cajas abiertas o faltantes se reportan en el momento, no después del embarque.",
      "El almacén puede retirar embalaje innecesario para bajar peso volumétrico, siempre que no comprometa la mercancía.",
    ],
    fuentes: ["Operación VB Travel Global"],
  },

  {
    id: "quien-puede-importar",
    categoria: "Venezuela",
    titulo: "Quién puede importar a Venezuela",
    claves: [
      "quien puede importar", "persona natural", "empresa", "importador", "rif",
      "requisitos importar", "particular",
    ],
    resumen:
      "Puede importar una persona natural con RIF o una empresa. Para volúmenes comerciales se necesita además estar registrado como sujeto aduanero y declarar ante el SENIAT.",
    detalle: [
      "Para uso personal o menaje doméstico existe el régimen de envíos familiares y equipaje, con límites de valor y cantidad.",
      "Para importación comercial necesitas RIF activo, registro de importador y un agente aduanal que firme la declaración.",
      "Importar sin declarar es contrabando; la responsabilidad es del importador aunque el error lo cometa el transportista.",
      "El servicio puerta a puerta con casillero funciona bajo el régimen de envíos por courier, que es distinto de la importación comercial formal.",
    ],
    fuentes: ["SENIAT — Aduanas"],
    enlaces: [{ titulo: "SENIAT", url: "https://www.seniat.gob.ve" }],
  },
  {
    id: "rif-rusad",
    categoria: "Venezuela",
    titulo: "RIF y RUSAD: los registros que pide el SENIAT",
    claves: [
      "rif", "rusad", "registro unico", "sujeto aduanero", "seniat", "registro importador",
      "solvencia", "inscripcion",
    ],
    resumen:
      "El RIF identifica al contribuyente y el RUSAD es el registro de sujetos aduaneros y tributarios que habilita operar ante la aduana.",
    detalle: [
      "El RIF se tramita en el portal del SENIAT y debe estar activo y con datos actualizados.",
      "El RUSAD registra la actividad aduanera del importador/exportador y se solicita en línea ante el SENIAT.",
      "Los datos de la factura comercial deben coincidir con el RIF: nombre, razón social y domicilio.",
      "Cambios de domicilio o de actividad deben reflejarse antes de declarar la carga.",
    ],
    fuentes: ["SENIAT"],
    enlaces: [{ titulo: "SENIAT — RIF / RUSAD", url: "https://www.seniat.gob.ve" }],
  },
  {
    id: "declaracion-aduanas-venezuela",
    categoria: "Venezuela",
    titulo: "Declaración de aduanas y despacho en Venezuela",
    claves: [
      "declaracion aduanas", "dua", "despacho", "agente aduanal", "aduanas venezuela",
      "desaduanaje", "liquidacion", "importacion formal",
    ],
    resumen:
      "La declaración se presenta por el sistema aduanero con los documentos de la carga y la firma de un agente aduanal autorizado; de ahí sale la liquidación de tributos.",
    detalle: [
      "El agente aduanal clasifica la mercancía por código HS, calcula la base imponible y presenta la declaración.",
      "La base imponible suele ser el valor CIF: mercancía + flete + seguro.",
      "La aduana puede pedir reconocimiento físico o documental antes de liberar la carga.",
      "Con la declaración pagada se obtiene el levante y la carga puede salir del recinto aduanero.",
      "Guarda la declaración y los comprobantes de pago: los necesitas para deducir costos y para cualquier fiscalización posterior.",
    ],
    fuentes: ["SENIAT — Aduanas", "Ley Orgánica de Aduanas"],
  },
  {
    id: "arancel-iva",
    categoria: "Venezuela",
    titulo: "Arancel, IVA e IGTF de una importación",
    claves: [
      "arancel", "impuesto importacion", "iva", "igtf", "tributos", "ad valorem",
      "cuanto pago", "impuestos aduana", "16%",
    ],
    resumen:
      "Sobre una importación se paga arancel según el código HS, IVA de importación y, cuando aplica, el IGTF por pagos en divisas. Confirma las alícuotas vigentes antes de calcular.",
    detalle: [
      "El arancel se aplica sobre el valor CIF y depende del código HS: hay productos exonerados y otros con alícuotas altas.",
      "El IVA de importación usa la alícuota general vigente (16 % en los últimos años) sobre CIF + arancel.",
      "El IGTF grava ciertos pagos en moneda extranjera; su aplicación depende de la condición del contribuyente y del medio de pago.",
      "Arancel, IVA e IGTF se liquidan con la declaración; no los cobra el transportista por separado.",
      "Venezuela y China no tienen tratado de libre comercio, así que la mercancía china paga arancel general, no preferencial.",
    ],
    fuentes: ["SENIAT", "Arancel de Aduanas (Gaceta Oficial)"],
  },
  {
    id: "regimen-courier",
    categoria: "Venezuela",
    titulo: "Régimen de envíos por courier y tráfico postal",
    claves: [
      "courier", "puerta a puerta", "envio familiar", "trafico postal", "casillero",
      "paquete personal", "limite valor", "limite", "cantidad", "pares", "comercial", "repetida", "aduanas express",
    ],
    resumen:
      "Los envíos puerta a puerta con casillero se despachan bajo el régimen de courier o tráfico postal, pensado para paquetes y no para carga comercial.",
    detalle: [
      "Este régimen tiene límites de valor, peso y cantidad por envío; superarlos obliga a una importación formal.",
      "El courier declara la carga ante la aduana y paga los tributos que correspondan por tu cuenta.",
      "Mercancía comercial repetida en cantidad (por ejemplo 100 pares del mismo modelo) puede ser reclasificada como importación comercial.",
      "No todo se puede enviar por courier: mercancía peligrosa, perecederos y productos con permiso previo requieren otra vía.",
    ],
    fuentes: ["SENIAT — Régimen de tráfico postal y courier"],
  },
  {
    id: "permisos-previos",
    categoria: "Venezuela",
    titulo: "Permisos previos por tipo de mercancía",
    claves: [
      "permiso", "sacs", "conatel", "insai", "mpps", "sencamer", "darfa", "registro sanitario",
      "alimentos", "medicinas", "fitosanitario", "armas", "cosmeticos", "telecomunicaciones",
    ],
    resumen:
      "Algunos rubros no se despachan solo con la declaración: necesitan autorización previa del organismo competente.",
    detalle: [
      "Alimentos, bebidas y cosméticos: registro y contraloría sanitaria (SACS).",
      "Medicamentos y dispositivos médicos: autorización del MPPS.",
      "Equipos de telecomunicaciones y radiofrecuencia: homologación de CONATEL.",
      "Productos y material vegetal o animal: certificado fitosanitario o zoosanitario de INSAI.",
      "Juguetes, textiles y bienes de consumo: normas y certificación de SENCAMER.",
      "Armas, municiones y explosivos: permiso de DARFA. No se transportan por courier.",
    ],
    fuentes: ["SACS", "MPPS", "CONATEL", "INSAI", "SENCAMER", "DARFA"],
  },
  {
    id: "certificado-origen",
    categoria: "Documentos",
    titulo: "Certificado de origen y por qué China no paga arancel preferencial",
    claves: [
      "certificado origen", "origen", "tratado libre comercio", "preferencia arancelaria",
      "alcance parcial", "aladi",
    ],
    resumen:
      "El certificado de origen acredita dónde se fabricó la mercancía. Venezuela y China no tienen tratado de libre comercio, así que no genera descuento arancelario.",
    detalle: [
      "Sirve para verificar origen en una investigación de dumping o para cumplir reglas de etiquetado.",
      "En algunos acuerdos (ALADI, CAN) el certificado sí reduce el arancel, pero China no forma parte de esos acuerdos con Venezuela.",
      "Si el producto se fabricó en China pero se despacha desde otro país, el origen sigue siendo China.",
      "No confundas certificado de origen con la declaración de exportación china: son documentos distintos.",
    ],
    fuentes: ["SENIAT", "ALADI"],
  },
  {
    id: "zona-franca",
    categoria: "Venezuela",
    titulo: "Zonas francas y regímenes especiales",
    claves: [
      "zona franca", "zolic", "zofat", "regimen especial", "puerto libre",
      "deposito aduanero", "admision temporal",
    ],
    resumen:
      "Las zonas francas y los depósitos aduaneros permiten almacenar o procesar mercancía con suspensión de tributos hasta que salga al mercado nacional.",
    detalle: [
      "La mercancía entra sin pagar arancel mientras permanece en la zona franca; al ingresar al territorio aduanero nacional se causan los tributos.",
      "El régimen de admisión temporal permite traer mercancía para transformación y reexportarla.",
      "No todos los productos admiten estos regímenes: hay listas de exclusiones.",
      "Para operar en zona franca hace falta autorización del organismo administrador y cumplir el control aduanero.",
    ],
    fuentes: ["SENIAT", "Ley Orgánica de Aduanas"],
  },

  {
    id: "documentos-importacion",
    categoria: "Documentos",
    titulo: "Documentos que necesitas para importar desde China",
    claves: [
      "documento", "documentos", "papeles", "requisito", "requisitos", "expediente",
      "carpeta", "tramite", "tramites", "importar", "importacion", "documentacion",
      "que necesito", "lista de documentos",
    ],
    resumen:
      "La carpeta base son seis documentos: factura comercial, packing list, guía de carga (BL o AWB), certificado de origen, seguro y la declaración de aduanas. Según el producto se suman permisos y certificados.",
    detalle: [
      "1. Factura comercial: valor real, descripción específica, Incoterm y datos del comprador.",
      "2. Packing list: bultos numerados, contenido por caja, peso bruto y neto, medidas.",
      "3. Documento de transporte: BL si es marítimo, AWB si es aéreo.",
      "4. Certificado de origen: acredita que la mercancía se fabricó en China.",
      "5. Seguro de carga, sobre todo cuando el valor es alto.",
      "6. Declaración de aduanas (DUA) con RIF y RUSAD del importador, firmada por el agente aduanal.",
      "Según el rubro: registro sanitario (SACS), homologación (CONATEL), certificado fitosanitario (INSAI), normas (SENCAMER), autorización (MPPS, DARFA).",
      "Del lado chino: declaración de exportación y, cuando aplica, inspección CIQ y certificado de fumigación del embalaje de madera.",
    ],
    fuentes: ["SENIAT — Aduanas", "GACC"],
  },
  {
    id: "factura-comercial",
    categoria: "Documentos",
    titulo: "Factura comercial: qué debe decir",
    claves: [
      "factura", "factura comercial", "invoice", "documento compra", "valor declarado",
      "precio unitario", "datos factura",
    ],
    resumen:
      "Es el documento base del despacho: sin factura correcta no hay valor aduanero válido y la carga se afora por estimación.",
    detalle: [
      "Debe incluir nombre y dirección del vendedor y del comprador, número y fecha, descripción detallada, cantidad, precio unitario, valor total, moneda e Incoterm.",
      "La descripción tiene que ser específica: 'accesorios' no sirve, 'audífonos Bluetooth TWS modelo X' sí.",
      "Debe coincidir con el packing list y con lo que dice la guía de carga.",
      "Una factura inflada o subvaluada es una infracción aduanera; el valor debe ser el realmente pagado.",
      "Si el proveedor emite factura en chino, pide traducción al español o al inglés para el despacho.",
    ],
    fuentes: ["SENIAT", "Ley Orgánica de Aduanas"],
  },
  {
    id: "packing-list",
    categoria: "Documentos",
    titulo: "Packing list (lista de empaque)",
    claves: [
      "packing list", "lista de empaque", "bultos", "cajas", "peso bruto", "peso neto",
      "dimensiones", "contenido caja",
    ],
    resumen:
      "El packing list detalla cómo viene embalada la mercancía: número de bultos, contenido por caja, peso bruto y neto y medidas.",
    detalle: [
      "Es el documento que usa la aduana para el reconocimiento físico: si dice 10 cajas y llegan 12, hay discrepancia.",
      "Debe numerar los bultos (1/10, 2/10...) y describir el contenido de cada uno.",
      "Peso bruto incluye embalaje; peso neto es solo mercancía. El flete se cobra sobre el bruto o el volumétrico.",
      "Cuando consolidadas varios proveedores, el packing list del embarque debe reflejar cada bulto individual.",
    ],
    fuentes: ["Práctica aduanera"],
  },
  {
    id: "bl-awb",
    categoria: "Documentos",
    titulo: "BL, AWB y guía de carga: diferencias",
    claves: [
      "bl", "bill of lading", "awb", "air waybill", "guia aerea", "conocimiento embarque",
      "guia", "tracking", "master", "house",
    ],
    resumen:
      "El BL es el documento del transporte marítimo y el AWB el del aéreo. Ambos acreditan el contrato de transporte y quién puede retirar la carga.",
    detalle: [
      "BL marítimo: puede ser nominativo o a la orden; el original o el endoso es lo que permite retirar la carga en destino.",
      "AWB aéreo: es no negociable, va nominativo y llega con el vuelo.",
      "Existen documentos master (del transportista) y house (del agente de carga); al importador normalmente le llega el house.",
      "En el BL aparecen consignatario, puerto de origen y destino, descripción, peso, volumen y flete.",
      "El número de la guía es el que se usa para el tracking.",
    ],
    fuentes: ["Práctica de transporte internacional"],
  },
  {
    id: "seguro-carga",
    categoria: "Documentos",
    titulo: "Seguro de carga: qué cubre y cuándo conviene",
    claves: [
      "seguro", "seguro de carga", "cobertura", "siniestro", "perdida", "averia",
      "poliza", "reclamacion",
    ],
    resumen:
      "El seguro cubre pérdida o daño de la mercancía durante el trayecto. Sin póliza, la responsabilidad del transportista está limitada por el convenio internacional.",
    detalle: [
      "La cobertura 'todo riesgo' es la habitual para carga consolidada; la básica cubre solo accidentes mayores.",
      "El valor asegurado debe incluir mercancía + flete + arancel esperado, no solo el precio de compra.",
      "Un siniestro se reclama con fotos, packing list, factura, BL/AWB y acta de la transportista en destino.",
      "En marítimo, el límite legal del transportista suele ser muy inferior al valor real de la carga: el seguro no es opcional si el valor es alto.",
    ],
    fuentes: ["Práctica de transporte internacional"],
  },
  {
    id: "poder-agente-aduanal",
    categoria: "Documentos",
    titulo: "Poder para el agente aduanal",
    claves: [
      "poder", "poder notarial", "mandato", "agente aduanal", "autorizacion",
      "representacion", "firma",
    ],
    resumen:
      "El agente aduanal declara en tu nombre, así que necesita un poder o mandato que lo autorice a actuar por tu empresa.",
    detalle: [
      "El poder debe identificar al agente, la mercancía o el tipo de operación y el alcance de la autorización.",
      "Se otorga ante notaría cuando la aduana o el agente lo exigen por escrito.",
      "Debe estar firmado por el representante legal con facultades suficientes según el acta constitutiva.",
      "Revísalo cada año o cuando cambie el representante legal.",
    ],
    fuentes: ["SENIAT", "Código de Comercio"],
  },
  {
    id: "documentos-casillero",
    categoria: "Documentos",
    titulo: "Qué necesitas para usar el casillero",
    claves: [
      "casillero", "vbg", "codigo casillero", "direccion china", "registro casillero",
      "documentos cliente", "cedula", "rif cliente",
    ],
    resumen:
      "Para recibir compras en China y despachar a Venezuela necesitas tu código de casillero, datos de contacto y la información de cada paquete.",
    detalle: [
      "Al registrarte recibes una dirección en Guangzhou y un código VBG que debes poner como destinatario en tus compras.",
      "Por cada paquete conviene enviar número de guía, proveedor, descripción y valor declarado.",
      "Para el despacho en Venezuela se piden cédula o RIF, dirección de entrega y teléfono.",
      "Si el paquete supera el límite del régimen de courier, se gestiona como importación formal y necesitas documentos adicionales.",
    ],
    fuentes: ["Operación VB Travel Global"],
  },

  {
    id: "aereo-vs-maritimo",
    categoria: "Transporte",
    titulo: "Aéreo express o marítimo: cuál conviene",
    claves: [
      "aereo", "maritimo", "cuanto tarda", "tiempo de transito", "express",
      "lcl", "fcl", "cuando usar", "rapido", "barato",
    ],
    resumen:
      "El aéreo gana en tiempo (días) y el marítimo en costo por kilo cuando el volumen es alto. La decisión depende de urgencia, peso y valor.",
    detalle: [
      "Aéreo express: ideal para muestras, electrónica de alto valor y reposiciones urgentes; paga por peso volumétrico.",
      "Marítimo LCL: consolida tu carga con otras; conviene desde varios cientos de kilos.",
      "Marítimo FCL: contenedor completo; el costo por kilo baja mucho en volumen alto.",
      "Tránsito publicado por VB Travel: aéreo 24-48 h de vuelo; marítimo 25-35 días de tránsito.",
      "El puerta a puerta suma despacho aduanero y entrega interna, así que el total es mayor que el tránsito.",
      "Compara siempre costo total, no solo la tarifa por kilo.",
    ],
    fuentes: ["Operación VB Travel Global"],
  },
  {
    id: "peso-volumetrico",
    categoria: "Transporte",
    titulo: "Peso volumétrico: por qué te cobran más kilos de los que pesa",
    claves: [
      "peso volumetrico", "peso facturable", "cobro por volumen", "kilos", "dimensiones",
      "5000", "6000", "caja grande",
    ],
    resumen:
      "El flete aéreo cobra el mayor entre peso real y peso volumétrico (largo × ancho × alto ÷ factor). Cajas grandes y livianas pagan como si pesaran más.",
    detalle: [
      "El factor típico aéreo es 1 m³ ≈ 167 kg (o largo×ancho×alto en cm ÷ 6000); en marítimo LCL se cobra por metro cúbico o por tonelada, el mayor.",
      "Reducir embalaje y consolidar bien baja el peso volumétrico y por tanto el costo.",
      "Un colchón o una caja de peluches pueden costar más de flete que de mercancía.",
      "Pide siempre el cálculo con medidas reales de la caja, no con las del producto.",
    ],
    fuentes: ["Práctica de transporte internacional"],
  },
  {
    id: "incoterms",
    categoria: "Transporte",
    titulo: "Incoterms: EXW, FOB, CIF y DDP",
    claves: [
      "incoterm", "fob", "cif", "exw", "ddp", "dap", "responsabilidad", "quien paga flete",
    ],
    resumen:
      "Los Incoterms definen hasta dónde llega la responsabilidad del vendedor y quién paga flete, seguro y aduana.",
    detalle: [
      "EXW: el vendedor solo pone la mercancía en su fábrica; tú pagas todo lo demás.",
      "FOB: el vendedor entrega a bordo en el puerto/aeropuerto de origen; desde ahí es tu costo.",
      "CIF: el vendedor paga flete y seguro hasta destino, pero el riesgo pasa antes.",
      "DDP: el vendedor entrega con impuestos pagados en destino; es el más cómodo y el más caro.",
      "El Incoterm debe aparecer en la factura comercial y coincidir con el valor declarado.",
    ],
    fuentes: ["Cámara de Comercio Internacional (ICC)"],
    enlaces: [{ titulo: "ICC — Incoterms", url: "https://iccwbo.org" }],
  },
  {
    id: "consolidacion",
    categoria: "Transporte",
    titulo: "Consolidación y desconsolidación de carga",
    claves: [
      "consolidacion", "desconsolidacion", "grupaje", "varios proveedores", "una sola guia",
      "deconsolidado", "reparto",
    ],
    resumen:
      "Consolidar es juntar varias compras en un solo embarque para pagar un flete; desconsolidar es separarlas en destino para entregar a cada cliente.",
    detalle: [
      "En origen se arma el contenedor o la paleta con mercancía de varios clientes; en destino se separa por dueño.",
      "Cada bulto debe estar etiquetado con su código de casillero para no perderlo en el reparto.",
      "La consolidación ahorra flete pero añade días de espera hasta completar el cupo.",
      "El packing list consolidado es la base del reparto y del despacho.",
    ],
    fuentes: ["Operación VB Travel Global"],
  },

  {
    id: "marco-legal",
    categoria: "Aduanas",
    titulo: "Leyes y organismos que regulan la importación",
    claves: [
      "ley", "leyes", "legal", "norma", "normas", "normativa", "legislacion", "marco legal", "reglamento", "exigencia",
      "gaceta", "gaceta oficial", "cumplir", "obligacion", "organismo", "autoridad",
      "prohibicion", "sancion", "codigo",
    ],
    resumen:
      "En Venezuela la importación se rige por la Ley Orgánica de Aduanas y su Reglamento, el Arancel de Aduanas, la ley de IVA y el Código Orgánico Tributario. En China, por la Ley de Aduanas de la RPC y las normas de comercio exterior y control de exportaciones.",
    detalle: [
      "Venezuela: Ley Orgánica de Aduanas y su Reglamento (despacho, regímenes, infracciones).",
      "Venezuela: Arancel de Aduanas publicado en Gaceta Oficial (clasificación y alícuotas) y la ley de IVA.",
      "Venezuela: Código Orgánico Tributario (obligaciones, sanciones e intereses) y normas del SENIAT.",
      "Venezuela: reglamentos técnicos y sanitarios por rubro (SENCAMER, SACS, CONATEL, INSAI, MPPS, DARFA).",
      "China: Ley de Aduanas de la República Popular China y reglamentos de la GACC (declaración, inspección, cuarentena).",
      "China: Ley de Comercio Exterior y listas de control de exportación para productos de doble uso y tecnología sensible.",
      "Los textos oficiales se publican en Gaceta Oficial (Venezuela) y en el sitio de la GACC y del MOFCOM (China); verifica siempre la versión vigente.",
    ],
    fuentes: ["Ley Orgánica de Aduanas", "Gaceta Oficial", "GACC", "MOFCOM"],
    enlaces: [
      { titulo: "SENIAT", url: "https://www.seniat.gob.ve" },
      { titulo: "GACC", url: "http://www.customs.gov.cn" },
    ],
  },
  {
    id: "desaduanaje-paso-a-paso",
    categoria: "Aduanas",
    titulo: "Desaduanaje paso a paso",
    claves: [
      "desaduanaje", "pasos", "proceso", "levante", "recinto aduanero", "retiro carga",
      "tramite aduana",
    ],
    resumen:
      "Llegada de la carga, presentación de documentos, clasificación y liquidación, pago de tributos, reconocimiento y levante para retirar.",
    detalle: [
      "1. Llegada y aviso: el transportista informa la carga y entrega el BL/AWB.",
      "2. Documentos: factura, packing list, BL/AWB, certificados y permisos si aplican.",
      "3. Clasificación y declaración: el agente aduanal asigna código HS y presenta.",
      "4. Liquidación y pago de tributos.",
      "5. Reconocimiento: documental o físico según el canal asignado.",
      "6. Levante y retiro del recinto; luego transporte a destino final.",
    ],
    fuentes: ["SENIAT — Aduanas"],
  },
  {
    id: "canal-verde-amarillo-rojo",
    categoria: "Aduanas",
    titulo: "Canales de verificación aduanera",
    claves: [
      "canal verde", "canal amarillo", "canal rojo", "reconocimiento", "aforo",
      "verificacion", "inspeccion aduana",
    ],
    resumen:
      "La aduana asigna un canal de control: verde (liberación documental), amarillo (revisión de documentos) o rojo (reconocimiento físico).",
    detalle: [
      "Verde: se libera con revisión documental; es el más rápido.",
      "Amarillo: la aduana revisa documentos y puede pedir aclaraciones.",
      "Rojo: reconocimiento físico de la mercancía, con apertura de bultos.",
      "El canal se define con criterios de riesgo: historial, tipo de mercancía, valor declarado.",
      "Una declaración inconsistente aumenta la probabilidad de canal rojo.",
    ],
    fuentes: ["SENIAT — Aduanas"],
  },
  {
    id: "sanciones-declaracion",
    categoria: "Aduanas",
    titulo: "Sanciones por declarar mal la mercancía",
    claves: [
      "sancion", "multa", "ilegal", "contrabando", "subvaluacion", "declarar", "declaro", "menos valor", "ocultar", "declaracion falsa",
      "ilícito", "consecuencias",
    ],
    resumen:
      "Declarar de menos el valor, cambiar la descripción o esconder mercancía es una infracción aduanera que puede terminar en retención, multa o procedimiento penal.",
    detalle: [
      "La subvaluación y el cambio de clasificación para pagar menos arancel son infracciones.",
      "Las consecuencias van de multa y reembarque hasta retención definitiva y responsabilidad penal.",
      "El importador responde aunque el error venga del proveedor o del transportista.",
      "Declarar bien es más barato que corregir: una diferencia de arancel rara vez compensa el costo de un expediente.",
    ],
    fuentes: ["Ley Orgánica de Aduanas", "SENIAT"],
  },
  {
    id: "mercancia-prohibida",
    categoria: "Restricciones",
    titulo: "Mercancía prohibida o de envío limitado",
    claves: [
      "prohibid", "prohibido", "prohibida", "producto", "productos", "no se puede enviar", "restringido", "droga", "arma", "perecible",
      "animales", "dinero", "medicamentos", "alcohol", "tabaco",
    ],
    resumen:
      "Hay mercancía que no se puede importar o que requiere autorización: drogas, armas, explosivos, residuos peligrosos, especies protegidas, perecederos sin cadena de frío.",
    detalle: [
      "Prohibido: estupefacientes, armas y municiones sin permiso, material pornográfico ilegal, residuos peligrosos, especies en extinción (CITES).",
      "Con permiso: medicamentos, alimentos, cosméticos, agroquímicos, equipos de radio, vehículos.",
      "Perecederos necesitan cadena de frío y no van en consolidado normal.",
      "Ante la duda, pregunta antes de comprar: rechazar una carga en origen es más barato que perderla en destino.",
    ],
    fuentes: ["SENIAT", "CITES", "SACS"],
  },
  {
    id: "marcas-falsificadas",
    categoria: "Restricciones",
    titulo: "Réplicas, marcas y propiedad intelectual",
    claves: [
      "replica", "falsificacion", "marca", "propiedad intelectual", "pirata",
      "copyright", "aduanas retiene", "logo",
    ],
    resumen:
      "La mercancía con marcas falsificadas puede ser retenida y destruida, y el importador responde por la infracción.",
    detalle: [
      "La aduana puede retener mercancía sospechosa de infringir una marca registrada, incluso a petición del titular.",
      "Comprar 'réplicas' no es una zona gris: es falsificación si el producto usa una marca sin autorización.",
      "Pide autorización del titular de la marca o compra marca propia/genérica.",
      "Los productos sin marca ('no brand') son la vía habitual para evitar este riesgo.",
    ],
    fuentes: ["SENIAT", "OMPI"],
  },
];

export const GLOSARIO: TerminoGlosario[] = [
  {
    termino: "Código HS",
    definicion:
      "Sistema armonizado de clasificación de mercancías. Define el arancel, los permisos y las estadísticas. Un código mal asignado cambia el impuesto.",
    claves: ["hs", "codigo hs", "partida arancelaria", "clasificacion"],
  },
  {
    termino: "BL (Bill of Lading)",
    definicion:
      "Conocimiento de embarque marítimo. Acredita el contrato de transporte y quién puede retirar la carga en destino.",
    claves: ["bl", "bill of lading", "conocimiento"],
  },
  {
    termino: "AWB (Air Waybill)",
    definicion: "Guía aérea. Documento no negociable del transporte aéreo, nominativo y con el número de tracking.",
    claves: ["awb", "air waybill", "guia aerea"],
  },
  {
    termino: "FOB",
    definicion:
      "Free On Board: el vendedor entrega la mercancía a bordo en el puerto o aeropuerto de origen. Desde ahí, flete y riesgo son del comprador.",
    claves: ["fob"],
  },
  {
    termino: "CIF",
    definicion:
      "Cost, Insurance and Freight: el vendedor paga costo, seguro y flete hasta el puerto de destino. Es la base habitual del valor aduanero.",
    claves: ["cif"],
  },
  {
    termino: "EXW",
    definicion:
      "Ex Works: el vendedor solo deja la mercancía en su fábrica. El comprador asume carga, transporte y trámites desde el origen.",
    claves: ["exw"],
  },
  {
    termino: "DDP",
    definicion:
      "Delivered Duty Paid: el vendedor entrega en destino con todos los tributos pagados. El comprador no gestiona aduana.",
    claves: ["ddp"],
  },
  {
    termino: "MOQ",
    definicion:
      "Minimum Order Quantity: cantidad mínima que acepta el proveedor. Suele venir por referencia, color o talla.",
    claves: ["moq", "minimo pedido"],
  },
  {
    termino: "LCL",
    definicion:
      "Less than Container Load: carga marítima consolidada que comparte contenedor con otros clientes. Se cobra por metro cúbico.",
    claves: ["lcl", "grupaje", "consolidado"],
  },
  {
    termino: "FCL",
    definicion: "Full Container Load: contenedor completo para un solo cliente. Baja el costo por kilo en volumen alto.",
    claves: ["fcl", "contenedor completo"],
  },
  {
    termino: "DUA",
    definicion:
      "Documento Único Aduanero: declaración de importación o exportación que se presenta ante la aduana y genera la liquidación de tributos.",
    claves: ["dua", "documento unico aduanero", "declaracion"],
  },
  {
    termino: "RUSAD",
    definicion:
      "Registro Único de Sujetos Aduaneros y Tributarios del SENIAT. Habilita al importador o exportador a operar ante la aduana.",
    claves: ["rusad", "registro aduanero"],
  },
  {
    termino: "RIF",
    definicion:
      "Registro de Información Fiscal. Identifica al contribuyente ante el SENIAT y debe coincidir con los datos de la factura comercial.",
    claves: ["rif", "registro fiscal"],
  },
  {
    termino: "IGTF",
    definicion:
      "Impuesto a las Grandes Transacciones Financieras. Grava ciertos pagos en moneda extranjera según la condición del contribuyente.",
    claves: ["igtf", "grandes transacciones"],
  },
  {
    termino: "Arancel",
    definicion:
      "Tributo que se paga al importar, calculado sobre el valor CIF y según el código HS. Puede ser ad valorem (porcentaje) o específico.",
    claves: ["arancel", "ad valorem"],
  },
  {
    termino: "Valor CIF",
    definicion:
      "Base imponible de la importación: valor de la mercancía + flete + seguro hasta el puerto de destino.",
    claves: ["valor cif", "base imponible"],
  },
  {
    termino: "Peso volumétrico",
    definicion:
      "Peso calculado por volumen (largo × ancho × alto ÷ factor). El flete cobra el mayor entre peso real y volumétrico.",
    claves: ["peso volumetrico", "peso facturable"],
  },
  {
    termino: "Desaduanaje",
    definicion:
      "Conjunto de trámites para liberar la carga de la aduana: declaración, pago de tributos, reconocimiento y levante.",
    claves: ["desaduanaje", "nacionalizacion"],
  },
  {
    termino: "Levante",
    definicion: "Autorización de la aduana para retirar la mercancía del recinto aduanero una vez pagados los tributos.",
    claves: ["levante", "retiro"],
  },
  {
    termino: "Aforo",
    definicion:
      "Verificación que hace la aduana del valor y la clasificación declarada. Puede ser documental o físico.",
    claves: ["aforo", "verificacion"],
  },
  {
    termino: "Consolidación",
    definicion:
      "Agrupar compras de varios proveedores o clientes en un solo embarque para reducir el costo de flete.",
    claves: ["consolidacion", "consolidado"],
  },
  {
    termino: "MSDS",
    definicion:
      "Hoja de datos de seguridad del material. Obligatoria para sustancias peligrosas; sin ella no se acepta la carga.",
    claves: ["msds", "ficha de seguridad", "sds"],
  },
  {
    termino: "UN38.3",
    definicion:
      "Ensayo obligatorio de baterías de litio para transporte. Sin el informe, la aerolínea o la naviera rechazan la carga.",
    claves: ["un38.3", "baterias litio"],
  },
  {
    termino: "ISPM-15",
    definicion:
      "Norma internacional que exige tratar y marcar el embalaje de madera maciza para evitar plagas.",
    claves: ["ispm", "ispm 15", "madera"],
  },
  {
    termino: "Incoterm",
    definicion:
      "Regla de la Cámara de Comercio Internacional que reparte costos y riesgos entre comprador y vendedor (EXW, FOB, CIF, DDP...).",
    claves: ["incoterm", "incoterms"],
  },
  {
    termino: "Casillero",
    definicion:
      "Dirección de recepción en China asignada al cliente para consolidar sus compras y despacharlas a Venezuela.",
    claves: ["casillero", "vbg"],
  },
  {
    termino: "CIQ",
    definicion:
      "Inspección y cuarentena de la aduana china. Aplica a alimentos, cosméticos y productos de origen vegetal o animal.",
    claves: ["ciq", "inspeccion china"],
  },
  {
    termino: "GACC",
    definicion:
      "Administración General de Aduanas de China. Autoridad que regula la exportación e importación china.",
    claves: ["gacc", "aduana china"],
  },
  {
    termino: "SENIAT",
    definicion:
      "Servicio Nacional Integrado de Administración Aduanera y Tributaria. Autoridad aduanera y fiscal de Venezuela.",
    claves: ["seniat", "aduana venezuela"],
  },
];
