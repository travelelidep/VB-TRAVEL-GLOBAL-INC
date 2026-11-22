"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const quickReplies = [
  "Quiero cotizar un vuelo",
  "Busco hotel en Cancún",
  "¿Tienen paquetes?",
  "Hablar con un agente",
];

const botResponses: Record<string, string> = {
  default:
    "¡Hola! 👋 Soy el asistente virtual de MD Travel Global. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte con:\n✈️ Cotización de vuelos\n🏨 Reserva de hoteles\n📦 Paquetes vacacionales\n📞 Conectarte con un agente",
  vuelo:
    "✈️ ¡Genial! Para cotizarte un vuelo necesito:\n\n1. Ciudad de origen\n2. Ciudad de destino\n3. Fechas de viaje\n4. Número de pasajeros\n\nTambién puedes buscar directamente en nuestro motor de reservas. ¿Quieres que te pase el enlace?",
  hotel:
    "🏨 ¡Excelente elección! Para buscar hoteles necesito:\n\n1. Ciudad o destino\n2. Fechas de check-in y check-out\n3. Número de huéspedes\n4. Presupuesto aproximado\n\n¿Me compartes estos datos?",
  paquete:
    "📦 ¡Claro! Tenemos paquetes increíbles:\n\n🌴 Cancún desde $299\n🏖️ Punta Cana desde $349\n🏰 Europa desde $799\n🗽 New York desde $399\n\n¿Cuál te interesa? También podemos armar un paquete personalizado.",
  agente:
    "📞 ¡Por supuesto! Te conecto con un agente humano.\n\nMientras tanto, puedes:\n• 📧 Escribir a info@mdtravelglobal.com\n• 📱 WhatsApp: +1 (234) 567-890\n• ☎️ Llamar: +1 (234) 567-890\n\nUn agente te responderá en menos de 15 minutos.",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("vuelo") || lower.includes("volar") || lower.includes("avión")) return botResponses.vuelo;
  if (lower.includes("hotel") || lower.includes("hospedaje") || lower.includes("alojamiento")) return botResponses.hotel;
  if (lower.includes("paquete") || lower.includes("todo incluido") || lower.includes("vacacion")) return botResponses.paquete;
  if (lower.includes("agente") || lower.includes("humano") || lower.includes("persona") || lower.includes("hablar")) return botResponses.agente;
  return "Gracias por tu mensaje. 😊 Un agente revisará tu consulta pronto.\n\n¿Hay algo más en lo que pueda ayudarte? Puedo cotizarte vuelos, hoteles o paquetes.";
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar mensaje de bienvenida en useEffect para evitar new Date() en prerender
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: botResponses.default,
        sender: "bot",
        time: getCurrentTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: "user",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        sender: "bot",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-red-500 rotate-0" : "gradient-primary"
        }`}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-comments"} text-white text-xl`}></i>
      </button>

      {/* Notification badge */}
      {!isOpen && (
        <div className="fixed bottom-[5.5rem] right-6 z-50 chat-bubble bg-white rounded-xl shadow-lg p-3 max-w-[220px] animate-fade-in-up">
          <p className="text-sm text-gray-700">
            👋 ¡Hola! ¿Necesitas ayuda con tu viaje?
          </p>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up">
          {/* Header */}
          <div className="gradient-primary p-4 flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-headset text-white"></i>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[var(--color-primary)]"></div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">MD Travel Asistente</h4>
              <p className="text-blue-200 text-xs">En línea • Responde al instante</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ maxHeight: "320px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === "user"
                      ? "bg-[var(--color-primary)] text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-gray-50 border-t border-gray-100">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white hover:opacity-90 transition shrink-0"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
