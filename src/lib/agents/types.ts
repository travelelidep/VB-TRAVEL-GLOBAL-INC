export type AgentId =
  | "supervisor"
  | "cotizador"
  | "documentos"
  | "aduanas"
  | "tracking"
  | "atencion"
  | "ventas"
  | "marketing"
  | "operaciones";

export type ToolName =
  | "cotizar"
  | "documentos"
  | "rastrear"
  | "crearLead"
  | "crearTarea"
  | "resumenOperacion";

export interface AgentDefinition {
  id: AgentId;
  nombre: string;
  rol: string;
  emoji: string;
  color: string;
  descripcion: string;
  capacidades: string[];
  herramientas: ToolName[];
  keywords: string[];
  systemPrompt: string;
  automatico: boolean;
}

export type TaskStatus = "pendiente" | "ejecutando" | "completada" | "fallida";

export interface AgentTask {
  id: string;
  agentId: AgentId;
  tipo: string;
  titulo: string;
  payload: Record<string, unknown>;
  estado: TaskStatus;
  prioridad: "alta" | "media" | "baja";
  createdAt: string;
  dueAt: string;
  intentos: number;
  resultado?: string;
  error?: string;
}

export interface Lead {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  estado?: string;
  origen: string;
  interes?: string;
  agentId: AgentId;
  etapa: "nuevo" | "contactado" | "cotizado" | "negociacion" | "cerrado";
  createdAt: string;
  updatedAt: string;
  notas: string[];
}

export interface Shipment {
  tracking: string;
  estado: string;
  ultimoEvento: string;
  ubicacion: string;
  actualizado: string;
  historial: Array<{ evento: string; ubicacion: string; fecha: string }>;
}

export interface ActivityEvent {
  id: string;
  agentId: AgentId;
  tipo: string;
  mensaje: string;
  nivel: "info" | "exito" | "alerta" | "error";
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface AgentMetrics {
  ejecuciones: number;
  conLLM: number;
  deterministas: number;
  latenciaTotalMs: number;
  errores: number;
}

export interface AgentReply {
  agentId: AgentId;
  reply: string;
  acciones: string[];
  tareasCreadas: string[];
  usadoLLM: boolean;
  latenciaMs: number;
}

export interface OrchestratorInput {
  message: string;
  agentId?: AgentId;
  canal?: "web" | "whatsapp" | "email" | "interno";
  cliente?: { nombre?: string; email?: string; telefono?: string; ciudad?: string };
  contexto?: Record<string, unknown>;
}
