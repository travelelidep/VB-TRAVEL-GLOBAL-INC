import type {
  ActivityEvent,
  AgentId,
  AgentMetrics,
  AgentTask,
  Lead,
  Shipment,
  TaskStatus,
} from "./types";

const MAX_EVENTS = 300;
const MAX_TASKS = 400;
const STORE_KEY = "vbg:agents:state:v1";

interface StoreState {
  tasks: AgentTask[];
  leads: Lead[];
  shipments: Record<string, Shipment>;
  events: ActivityEvent[];
  metrics: Partial<Record<AgentId, AgentMetrics>>;
  persistedAt: string | null;
}

declare global {
  var __vbgAgentStore:
    | {
        state: StoreState;
        hydrated: boolean;
        hydrating: Promise<void> | null;
        timer: NodeJS.Timeout | null;
      }
    | undefined;
}

function emptyState(): StoreState {
  return { tasks: [], leads: [], shipments: {}, events: [], metrics: {}, persistedAt: null };
}

function store() {
  if (!globalThis.__vbgAgentStore) {
    globalThis.__vbgAgentStore = {
      state: emptyState(),
      hydrated: false,
      hydrating: null,
      timer: null,
    };
  }
  return globalThis.__vbgAgentStore;
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function persistenceEnabled(): boolean {
  return redisConfig() !== null;
}

async function redisGet(): Promise<StoreState | null> {
  const cfg = redisConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(STORE_KEY)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data?.result !== "string") return null;
    return JSON.parse(data.result) as StoreState;
  } catch (error) {
    console.warn("[store] No se pudo leer el estado remoto:", error);
    return null;
  }
}

async function redisSet(state: StoreState): Promise<void> {
  const cfg = redisConfig();
  if (!cfg) return;
  try {
    await fetch(`${cfg.url}/set/${encodeURIComponent(STORE_KEY)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  } catch (error) {
    console.warn("[store] No se pudo guardar el estado remoto:", error);
  }
}

export async function hydrate(): Promise<void> {
  const s = store();
  if (s.hydrated) return;
  if (s.hydrating) return s.hydrating;

  s.hydrating = (async () => {
    const remote = await redisGet();
    if (remote) s.state = { ...emptyState(), ...remote };
    s.hydrated = true;
    s.hydrating = null;
  })();

  return s.hydrating;
}

function schedulePersist() {
  const s = store();
  if (!persistenceEnabled()) return;
  if (s.timer) return;
  s.timer = setTimeout(() => {
    s.timer = null;
    s.state.persistedAt = new Date().toISOString();
    void redisSet(s.state);
  }, 1200);
  s.timer.unref?.();
}

export function getState(): StoreState {
  return store().state;
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function addEvent(event: Omit<ActivityEvent, "id" | "createdAt">): ActivityEvent {
  const state = getState();
  const full: ActivityEvent = {
    ...event,
    id: uid("evt"),
    createdAt: new Date().toISOString(),
  };
  state.events.unshift(full);
  if (state.events.length > MAX_EVENTS) state.events.length = MAX_EVENTS;
  schedulePersist();
  return full;
}

export interface CreateTaskInput {
  agentId: AgentId;
  tipo: string;
  titulo: string;
  payload?: Record<string, unknown>;
  prioridad?: "alta" | "media" | "baja";
  dueAt?: string;
  delayMinutes?: number;
}

export function createTask(input: CreateTaskInput): AgentTask {
  const state = getState();
  const now = Date.now();
  const dueAt =
    input.dueAt ?? new Date(now + (input.delayMinutes ?? 0) * 60_000).toISOString();

  const task: AgentTask = {
    id: uid("tsk"),
    agentId: input.agentId,
    tipo: input.tipo,
    titulo: input.titulo,
    payload: input.payload ?? {},
    estado: "pendiente",
    prioridad: input.prioridad ?? "media",
    createdAt: new Date(now).toISOString(),
    dueAt,
    intentos: 0,
  };

  state.tasks.unshift(task);
  if (state.tasks.length > MAX_TASKS) state.tasks.length = MAX_TASKS;

  addEvent({
    agentId: input.agentId,
    tipo: "tarea_creada",
    mensaje: input.titulo,
    nivel: "info",
    meta: { taskId: task.id, tipo: input.tipo },
  });

  schedulePersist();
  return task;
}

export function updateTask(
  id: string,
  patch: Partial<Pick<AgentTask, "estado" | "resultado" | "error" | "intentos">>
): AgentTask | null {
  const task = getState().tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, patch);
  schedulePersist();
  return task;
}

export function getTask(id: string): AgentTask | undefined {
  return getState().tasks.find((t) => t.id === id);
}

export function dueTasks(now = Date.now()): AgentTask[] {
  return getState()
    .tasks.filter((t) => t.estado === "pendiente" && new Date(t.dueAt).getTime() <= now)
    .sort((a, b) => {
      const weight = { alta: 0, media: 1, baja: 2 } as const;
      const byPriority = weight[a.prioridad] - weight[b.prioridad];
      return byPriority !== 0
        ? byPriority
        : new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });
}

export function tasksByStatus(estado: TaskStatus, limit = 50): AgentTask[] {
  return getState().tasks.filter((t) => t.estado === estado).slice(0, limit);
}

export function recordRun(
  agentId: AgentId,
  usedLLM: boolean,
  latencyMs: number,
  failed = false
): void {
  const state = getState();
  const current: AgentMetrics = state.metrics[agentId] ?? {
    ejecuciones: 0,
    conLLM: 0,
    deterministas: 0,
    latenciaTotalMs: 0,
    errores: 0,
  };

  current.ejecuciones += 1;
  current.latenciaTotalMs += latencyMs;
  if (usedLLM) current.conLLM += 1;
  else current.deterministas += 1;
  if (failed) current.errores += 1;

  state.metrics[agentId] = current;
  schedulePersist();
}

export function upsertLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notas" | "etapa"> & {
    id?: string;
    etapa?: Lead["etapa"];
    notas?: string[];
  }
): Lead {
  const state = getState();
  const now = new Date().toISOString();
  const existing = lead.email
    ? state.leads.find((l) => l.email?.toLowerCase() === lead.email?.toLowerCase())
    : lead.telefono
      ? state.leads.find((l) => l.telefono === lead.telefono)
      : undefined;

  if (existing) {
    Object.assign(existing, {
      ...lead,
      id: existing.id,
      etapa: lead.etapa ?? existing.etapa,
      updatedAt: now,
    });
    schedulePersist();
    return existing;
  }

  const created: Lead = {
    ...lead,
    id: lead.id ?? uid("lead"),
    etapa: lead.etapa ?? "nuevo",
    notas: lead.notas ?? [],
    createdAt: now,
    updatedAt: now,
  };
  state.leads.unshift(created);
  schedulePersist();
  return created;
}

export function addLeadNote(leadId: string, nota: string): void {
  const lead = getState().leads.find((l) => l.id === leadId);
  if (!lead) return;
  lead.notas.unshift(`[${new Date().toISOString()}] ${nota}`);
  lead.updatedAt = new Date().toISOString();
  schedulePersist();
}

export function setLeadStage(leadId: string, etapa: Lead["etapa"]): void {
  const lead = getState().leads.find((l) => l.id === leadId);
  if (!lead) return;
  lead.etapa = etapa;
  lead.updatedAt = new Date().toISOString();
  schedulePersist();
}

export function upsertShipment(
  tracking: string,
  patch: Partial<Omit<Shipment, "tracking" | "historial">> & {
    evento?: { evento: string; ubicacion: string };
  }
): Shipment {
  const state = getState();
  const key = tracking.toUpperCase();
  const existing: Shipment = state.shipments[key] ?? {
    tracking: key,
    estado: "REGISTRADO",
    ultimoEvento: "Guía creada",
    ubicacion: "Guangzhou, China",
    actualizado: new Date().toISOString(),
    historial: [],
  };

  const { evento, ...rest } = patch;
  Object.assign(existing, rest);
  existing.actualizado = new Date().toISOString();

  if (evento) {
    existing.historial.unshift({ ...evento, fecha: existing.actualizado });
    existing.ultimoEvento = evento.evento;
    existing.ubicacion = evento.ubicacion;
  }

  state.shipments[key] = existing;
  schedulePersist();
  return existing;
}

export function getShipment(tracking: string): Shipment | undefined {
  return getState().shipments[tracking.toUpperCase()];
}

export function getSnapshot() {
  const state = getState();
  return {
    tasks: state.tasks,
    leads: state.leads,
    events: state.events,
    metrics: state.metrics,
    shipments: Object.values(state.shipments),
    persistence: persistenceEnabled(),
    persistedAt: state.persistedAt,
  };
}
