export interface Agent {
  id: string;
  email: string;
  nombre: string;
  especialidad: string[];
  activo: boolean;
  whatsapp?: string;
}

export const AGENTS: Agent[] = [
  {
    id: "maria.ventas",
    email: "maria@mdtravelglobal.com",
    nombre: "María González",
    especialidad: ["vacacional", "parejas", "luna-de-miel", "caribe", "europa"],
    activo: true,
    whatsapp: "+1234567890",
  },
  {
    id: "carlos.corporativo",
    email: "carlos@mdtravelglobal.com",
    nombre: "Carlos Rodríguez",
    especialidad: ["corporativo", "ejecutivo", "grupos-empresariales", "eventos"],
    activo: true,
    whatsapp: "+1234567891",
  },
  {
    id: "ana.grupos",
    email: "ana@mdtravelglobal.com",
    nombre: "Ana Martínez",
    especialidad: ["grupos", "estudiantes", "familias-numerosas", "bodas", "quinceaneras"],
    activo: true,
    whatsapp: "+1234567892",
  },
  {
    id: "soporte.24h",
    email: "soporte@mdtravelglobal.com",
    nombre: "Soporte 24/7",
    especialidad: ["emergencias", "cambios", "cancelaciones", "reembolsos", "asistencia-vuelo"],
    activo: true,
    whatsapp: "+1234567893",
  },
];

const DESTINO_ESPECIALIDAD: Record<string, string[]> = {
  cancun: ["vacacional", "parejas", "luna-de-miel"],
  "punta cana": ["vacacional", "parejas", "todo-incluido"],
  "riviera maya": ["vacacional", "familias", "luna-de-miel"],
  madrid: ["europa", "corporativo", "cultural"],
  barcelona: ["europa", "cultural", "parejas"],
  paris: ["luna-de-miel", "cultural", "parejas"],
  roma: ["cultural", "familias", "parejas"],
  londres: ["corporativo", "cultural", "estudiantes"],
  miami: ["vacacional", "compras", "familias"],
  "nueva york": ["corporativo", "cultural", "compras"],
  bogota: ["corporativo", "sudamerica", "familias"],
  medellin: ["vacacional", "cultural", "parejas"],
  cartagena: ["vacacional", "parejas", "luna-de-miel"],
  lima: ["cultural", "gastronomia", "familias"],
  "buenos aires": ["cultural", "parejas", "corporativo"],
  santiago: ["corporativo", "aventura", "familias"],
  "ciudad de mexico": ["corporativo", "cultural", "familias"],
  guadalajara: ["cultural", "familias", "corporativo"],
  monterrey: ["corporativo", "industrial", "familias"],
};

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type FormDataLike = FormData | Record<string, string | undefined>;

export function assignAgent(formData: FormDataLike): string {
  const getValue = (key: string): string => {
    if (formData instanceof FormData) {
      return (formData.get(key) as string) || "";
    }
    return formData[key] || "";
  };

  const destino = normalizarTexto(getValue("destino"));
  const tipoViaje = normalizarTexto(getValue("tipoViaje") || "vacacional");
  const pax = parseInt(getValue("pasajeros") || "1", 10);
  const origen = normalizarTexto(getValue("origen"));

  if (pax >= 10) {
    const agente = AGENTS.find((a) => a.id === "ana.grupos" && a.activo);
    if (agente) return agente.id;
  }

  if (["corporativo", "ejecutivo", "negocios", "empresarial"].includes(tipoViaje)) {
    const agente = AGENTS.find((a) => a.id === "carlos.corporativo" && a.activo);
    if (agente) return agente.id;
  }

  for (const [destinoKey, especialidades] of Object.entries(DESTINO_ESPECIALIDAD)) {
    if (destino.includes(destinoKey)) {
      for (const esp of especialidades) {
        const agente = AGENTS.find((a) => a.especialidad.includes(esp) && a.activo);
        if (agente) return agente.id;
      }
    }
  }

  const origenesCorporativos = [
    "ciudad de mexico",
    "monterrey",
    "guadalajara",
    "bogota",
    "lima",
    "santiago",
    "buenos aires",
    "madrid",
    "barcelona",
    "londres",
    "nueva york",
    "miami",
  ];
  if (origenesCorporativos.some((o) => origen.includes(o)) && tipoViaje !== "vacacional") {
    const agente = AGENTS.find((a) => a.id === "carlos.corporativo" && a.activo);
    if (agente) return agente.id;
  }

  const agentesDisponibles = AGENTS.filter((a) => a.activo && a.id !== "soporte.24h");
  if (agentesDisponibles.length > 0) {
    const idx = Math.floor(Math.random() * agentesDisponibles.length);
    return agentesDisponibles[idx].id;
  }

  return "maria.ventas";
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function getAgentEmail(id: string): string {
  const agente = getAgentById(id);
  return agente?.email || "ventas@mdtravelglobal.com";
}

export function getAgentWhatsApp(id: string): string | undefined {
  const agente = getAgentById(id);
  return agente?.whatsapp;
}

export function getAllActiveAgents(): Agent[] {
  return AGENTS.filter((a) => a.activo);
}
