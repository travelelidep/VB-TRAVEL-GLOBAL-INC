"use client";

import { useEffect, useRef, useState } from "react";

interface Fuente {
  id: string;
  titulo: string;
  categoria: string;
}

interface Mensaje {
  rol: "usuario" | "asesor";
  texto: string;
  fuentes?: Fuente[];
}

const BIENVENIDA: Mensaje = {
  rol: "asesor",
  texto:
    "¡Hola! 👋 Soy el asesor de VB TRAVEL GLOBAL.\n\nTe explico trámites, documentos, impuestos y normas para importar desde China a Venezuela. Pregúntame lo que necesites.",
};

const SUGERENCIAS_INICIALES = [
  "¿Qué documentos necesito para importar?",
  "¿Qué impuestos pago en Venezuela?",
  "¿Aéreo o marítimo, qué conviene?",
  "¿Puedo importar baterías?",
];

function Texto({ contenido }: { contenido: string }) {
  return (
    <>
      {contenido.split("\n").map((linea, indice) => {
        if (!linea.trim()) return <div key={indice} className="h-2" />;

        if (linea.startsWith("_") && linea.endsWith("_")) {
          return (
            <p key={indice} className="text-[11px] italic text-slate-400 leading-snug">
              {linea.slice(1, -1)}
            </p>
          );
        }

        return (
          <p key={indice} className="leading-relaxed">
            {linea.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((parte, j) =>
              parte.startsWith("**") && parte.endsWith("**") ? (
                <strong key={j} className="font-semibold">
                  {parte.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{parte}</span>
              )
            )}
          </p>
        );
      })}
    </>
  );
}

export default function AsesorIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [sugerencias, setSugerencias] = useState(SUGERENCIAS_INICIALES);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto, cargando]);

  const enviar = async (texto: string) => {
    const pregunta = texto.trim();
    if (!pregunta || cargando) return;

    setMensajes((prev) => [...prev, { rol: "usuario", texto: pregunta }]);
    setEntrada("");
    setCargando(true);

    try {
      const respuesta = await fetch("/api/asesor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: pregunta }),
      });
      const datos = await respuesta.json();
      setMensajes((prev) => [
        ...prev,
        { rol: "asesor", texto: datos.respuesta ?? "No pude responder ahora mismo.", fuentes: datos.fuentes },
      ]);
      if (Array.isArray(datos.sugerencias) && datos.sugerencias.length > 0) {
        setSugerencias(datos.sugerencias);
      }
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          rol: "asesor",
          texto: "Se cortó la conexión. Escríbenos por WhatsApp al +58 416 111157 y te atendemos de inmediato.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-label={abierto ? "Cerrar asesor IA" : "Abrir asesor IA"}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-orange-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-orange-600"
      >
        <i className={`fas ${abierto ? "fa-xmark" : "fa-comments"} text-2xl`} />
        {!abierto && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
        )}
      </button>

      {abierto && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[400px] h-[560px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
          <header className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
              <i className="fas fa-robot" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Asesor de importación</p>
              <p className="text-xs text-slate-300 truncate">Aduanas · China · Venezuela</p>
            </div>
            <a
              href="https://wa.me/58416111157?text=Hola%2C%20necesito%20asesor%C3%ADa%20para%20importar%20desde%20China"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hablar con un asesor por WhatsApp"
              className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
            >
              <i className="fab fa-whatsapp" />
            </a>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center"
            >
              <i className="fas fa-xmark" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {mensajes.map((mensaje, indice) => (
              <div
                key={indice}
                className={`flex ${mensaje.rol === "usuario" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    mensaje.rol === "usuario"
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <Texto contenido={mensaje.texto} />
                  {mensaje.fuentes && mensaje.fuentes.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {mensaje.fuentes.map((fuente) => (
                        <span
                          key={fuente.id}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                        >
                          {fuente.categoria}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={finRef} />
          </div>

          {sugerencias.length > 0 && !cargando && (
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 bg-white border-t border-slate-100">
              {sugerencias.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  onClick={() => enviar(sugerencia)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              enviar(entrada);
            }}
            className="p-3 bg-white flex items-center gap-2"
          >
            <input
              value={entrada}
              onChange={(evento) => setEntrada(evento.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Pregunta al asesor"
              maxLength={600}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-900"
            />
            <button
              type="submit"
              disabled={cargando || entrada.trim().length < 2}
              aria-label="Enviar pregunta"
              className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-orange-600 transition"
            >
              <i className="fas fa-paper-plane text-sm" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
