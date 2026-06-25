"use client";

import { motion } from "motion/react";
import { Newspaper, BookOpen } from "lucide-react";
import { GlassCard } from "../GlassCard";

const magazineNews = [
  {
    title: "Forbes — Los 30 emprendedores menores de 30",
    summary: "Descubrí quiénes están revolucionando el mercado financiero argentino en 2026.",
    date: "Hace 2 horas",
    tag: "Tendencias",
    icon: "text-system-orange",
    badge: "bg-system-orange/10",
  },
  {
    title: "The Economist — El futuro de las fintech en Latinoamérica",
    summary: "Análisis profundo sobre cómo las billeteras digitales están transformando la región.",
    date: "Hace 5 horas",
    tag: "Fintech",
    icon: "text-accent",
    badge: "bg-accent/10",
  },
  {
    title: "Bloomberg — Bonos AR: oportunidad o riesgo",
    summary: "Expertos analizan el rendimiento de los bonos argentinos de cara al próximo trimestre.",
    date: "Ayer, 18:30",
    tag: "Inversiones",
    icon: "text-system-orange",
    badge: "bg-system-orange/10",
  },
  {
    title: "Financial Times — Cripto: la nueva era regulatoria",
    summary: "Cómo los cambios normativos en EE.UU. y Europa impactan en el mercado cripto global.",
    date: "Ayer, 14:00",
    tag: "Cripto",
    icon: "text-system-purple",
    badge: "bg-system-purple/10",
  },
  {
    title: "Expansión — Claves para invertir en 2026",
    summary: "Guía completa con los sectores y activos más prometedores para este año.",
    date: "Hace 2 días",
    tag: "Guía",
    icon: "text-system-green",
    badge: "bg-system-green/10",
  },
];

export function WidgetNews() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-semibold">Novedades de revistas</h2>
      </div>
      {magazineNews.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + idx * 0.04 }}
        >
          <GlassCard className="p-4 hover:bg-fill transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${item.badge} flex items-center justify-center shrink-0 mt-0.5`}>
                <BookOpen className={`w-4 h-4 ${item.icon}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${item.icon}`}>
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-label-secondary">·</span>
                  <span className="text-[10px] text-label-secondary">{item.date}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{item.title}</p>
                <p className="text-xs text-label-secondary mt-1 leading-relaxed line-clamp-2">{item.summary}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
