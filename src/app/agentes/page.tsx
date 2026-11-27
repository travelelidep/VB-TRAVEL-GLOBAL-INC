"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface AgentMetric {
  ejecuciones: number;
  conLLM: number;
  deterministas: number;
  latenciaTotalMs: number;
  errores: number;
}

interface AgentInfo {
  id: string;
  nombre: string;
  rol: string;
  emoji: string;
  descripcion: string;
  capacidades: string[];
  herramientas: string[];
  automatico: boolean;
  metricas: AgentMetric;
}

interface Task {
  id: string;
  agentId: string;
  titulo: string;
  estado: string;
  prioridad: string;
  dueAt: string;
  resultado?: string;
}

interface EventItem {
  id: string;
  agentId: string;
  tipo: string;
  mensaje: string;
  nivel: string;
  createdAt: string;
}

interface StateResponse {
  ok: boolean;
  llm: boolean;
  persistencia: boolean;
  agentes: AgentInfo[];
  resumen: {
    tareasPendientes: number;
    tareasCompletadas: number;
    leads: number;
    envios: number;
  };
  tareas: Task[];
  eventos: EventItem[];
}

interface ChatMessage {
  role: "user" | "agent";
  text: string;
  agentId?: string;
  acciones?: string[];
}

const SUGERENCIAS = [
  "Cotiza 25 kg de electrónicos a Caracas, valor $900, aéreo",
  "¿Qué documentos necesito para importar ropa a Valencia?",
  "Rastrea la guía VBG123456",
  "Quiero abrir mi casillero",
];

const estadoColor: Record<string, string> = {
  pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  ejecutando: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  completada: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  fallida: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const nivelColor: Record<string, string> = {
  info: "text-slate-400",
  exito: "text-emerald-400",
  alerta: "text-amber-400",
  error: "text-rose-400",
};

export default function AgentesPage() {
  const [state, setState] = useState<StateResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [tick, setTick] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch("/api/agents", { cache: "no-store" });
      if (res.ok) setState(await res.json());
    } catch {
      /* reintenta en el próximo ciclo */
    }
  }, []);

  useEffect(() => {
    const inicial = setTimeout(() => void cargar(), 0);
    const timer = setInterval(() => void cargar(), 15000);
    return () => {
      clearTimeout(inicial);
      clearInterval(timer);
    };
  }, [cargar]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function enviar(texto: string) {
    const mensaje = texto.trim();
    if (!mensaje || enviando) return;

    setMessages((prev) => [...prev, { role: "user", text: mensaje }]);
    setInput("");
    setEnviando(true);

    try {
      const res = await fetch("/api/agents/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mensaje, canal: "web" }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.respuesta ?? data.error ?? "No pude procesar la solicitud.",
          agentId: data.agente,
          acciones: data.acciones,
        },
      ]);
      void cargar();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Error de conexión con la célula de agentes." },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  async function ejecutarTick() {
    setTick("ejecutando…");
    try {
      const res = await fetch("/api/agents/tick", { method: "POST" });
      const data = await res.json();
      setTick(data.resumen ?? data.error ?? "Sin resultado");
      void cargar();
    } catch {
      setTick("Error ejecutando la automatización");
    }
  }

  const agentes = state?.agentes ?? [];
  const resumen = state?.resumen;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              VB Travel Global · Célula de IA
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Centro de agentes autónomos</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Nueve agentes coordinan cotizaciones, documentos, aduanas, rastreo, ventas y
              operaciones. El supervisor enruta cada mensaje y la automatización procesa la cola
              de tareas sin intervención humana.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-3 py-1 ${state?.llm ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-amber-500/40 bg-amber-500/10 text-amber-300"}`}>
              {state?.llm ? "LLM conectado" : "Modo reglas (sin API key)"}
            </span>
            <span className={`rounded-full border px-3 py-1 ${state?.persistencia ? "border-sky-500/40 bg-sky-500/10 text-sky-300" : "border-slate-600 bg-slate-800/60 text-slate-300"}`}>
              {state?.persistencia ? "Estado en Redis" : "Estado en memoria"}
            </span>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Tareas pendientes", value: resumen?.tareasPendientes ?? 0 },
            { label: "Tareas completadas", value: resumen?.tareasCompletadas ?? 0 },
            { label: "Leads activos", value: resumen?.leads ?? 0 },
            { label: "Envíos monitoreados", value: resumen?.envios ?? 0 },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Agentes</h2>
              <span className="text-xs text-slate-500">{agentes.length} activos</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {agentes.map((agent) => {
                const m = agent.metricas;
                const promedio = m.ejecuciones ? Math.round(m.latenciaTotalMs / m.ejecuciones) : 0;
                return (
                  <article
                    key={agent.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-orange-500/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{agent.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold">{agent.nombre}</p>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">{agent.rol}</p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] ${agent.automatico ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-slate-700 text-slate-400"}`}>
                        {agent.automatico ? "auto" : "manual"}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">{agent.descripcion}</p>
                    <div className="mt-3 flex gap-3 text-[11px] text-slate-500">
                      <span>{m.ejecuciones} ejec.</span>
                      <span>{m.conLLM} con IA</span>
                      <span>{promedio} ms</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Consola de agentes</h2>
              <button
                onClick={ejecutarTick}
                className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-500/20"
              >
                Ejecutar automatización
              </button>
            </div>

            <div ref={feedRef} className="mb-3 h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              {messages.length === 0 && (
                <div className="space-y-2 text-sm text-slate-400">
                  <p>Escribe una solicitud y el supervisor elegirá al agente adecuado.</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGERENCIAS.map((s) => (
                      <button
                        key={s}
                        onClick={() => void enviar(s)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-orange-500/50 hover:text-orange-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-orange-500/20 text-orange-100"
                        : "border border-slate-800 bg-slate-900 text-slate-200"
                    }`}
                  >
                    {m.role === "agent" && m.agentId && (
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-emerald-400">
                        agente: {m.agentId}
                      </p>
                    )}
                    {m.text}
                    {m.acciones && m.acciones.length > 0 && (
                      <ul className="mt-2 space-y-0.5 text-[11px] text-slate-500">
                        {m.acciones.map((a, idx) => (
                          <li key={idx}>• {a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
              {enviando && <p className="text-xs text-slate-500">Los agentes están trabajando…</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void enviar(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: cotiza 30 kg a Maracaibo"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-orange-500/60"
              />
              <button
                type="submit"
                disabled={enviando}
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Enviar
              </button>
            </form>
            {tick && <p className="mt-2 text-xs text-slate-400">{tick}</p>}
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-lg font-semibold">Cola de tareas</h2>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {(state?.tareas ?? []).length === 0 && (
                <p className="text-sm text-slate-500">Sin tareas todavía. Genera una cotización o solicita un casillero.</p>
              )}
              {(state?.tareas ?? []).map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-200">{t.titulo}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${estadoColor[t.estado] ?? "border-slate-700 text-slate-400"}`}>
                      {t.estado}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t.agentId} · prioridad {t.prioridad} · vence{" "}
                    {new Date(t.dueAt).toLocaleString("es-VE")}
                  </p>
                  {t.resultado && <p className="mt-1 text-[11px] text-slate-400">{t.resultado}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-lg font-semibold">Actividad en vivo</h2>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {(state?.eventos ?? []).length === 0 && (
                <p className="text-sm text-slate-500">Sin actividad registrada aún.</p>
              )}
              {(state?.eventos ?? []).map((e) => (
                <div key={e.id} className="flex gap-2 text-xs">
                  <span className="shrink-0 text-slate-600">
                    {new Date(e.createdAt).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={nivelColor[e.nivel] ?? "text-slate-400"}>
                    <span className="font-semibold">[{e.agentId}]</span> {e.mensaje}
                  </span>                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>API: /api/agents · /api/agents/orchestrator · /api/automation/tick · /api/health</span>
          <Link href="/" className="text-orange-400 hover:text-orange-300">
            ← Volver al sitio
          </Link>
        </footer>
      </div>
    </div>
  );
}
