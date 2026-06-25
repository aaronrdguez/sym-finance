"use client";

import { useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { DashboardShell } from "../../components/DashboardShell";

const suggestions = [
  "¿Cómo puedo ahorrar más este mes?",
  "Analizá mis gastos de la última semana",
  "¿Qué inversiones me recomendás?",
  "Mostrame mi progreso de metas",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "¡Hola! Soy tu asistente financiero. Podés preguntarme sobre tus finanzas, inversiones, o pedirme consejos para ahorrar." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: "Entendido. Estoy procesando tu consulta. Esta funcionalidad estará disponible próximamente." }]);
    }, 800);
  };

  return (
    <DashboardShell contentClassName="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Asistente IA</h1>
          <p className="text-sm text-label-secondary mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-system-green inline-block" />
            En línea
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <GlassCard className="flex-1 flex flex-col">
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[480px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-fill rounded-bl-md"
                }`}>
                  {msg.role === "assistant" && idx === 0 && (
                    <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-accent -mt-0.5" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="px-5 pb-4">
              <p className="text-[11px] text-label-secondary mb-2">Sugerencias:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(s); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-fill text-label-secondary hover:text-label hover:bg-fill-secondary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 pt-3 border-t border-separator">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribí un mensaje..."
                className="flex-1 h-11 rounded-xl bg-input-background border-0 px-4 text-sm outline-none placeholder:text-label-secondary/60"
              />
              <Button onClick={handleSend} size="icon" className="h-11 w-11 rounded-xl bg-accent hover:bg-accent/90 shrink-0">
                <Zap className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
