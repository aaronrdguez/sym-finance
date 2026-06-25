"use client";

import { motion } from "motion/react";
import { BarChart3, PiggyBank } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "../GlassCard";
import type { ResolvedWidgetData } from "./types";

export function WidgetQuickStats({ accounts, reserves }: ResolvedWidgetData) {
  const activeReserves = reserves.filter(r => !r.completed);
  const completedReserves = reserves.filter(r => r.completed);
  const overdue = activeReserves.filter(r => r.deadline && new Date(r.deadline) < new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-semibold">Resumen rápido</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Cuentas", value: accounts.length.toString(), icon: "🏦" },
          { label: "Transacciones", value: "142", icon: "💳" },
          { label: "Reservas", value: activeReserves.length.toString(), icon: "🐷" },
          { label: "Completadas", value: completedReserves.length.toString(), icon: "✅" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
          >
            <GlassCard className="p-4">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-lg font-bold mt-1 tabular-nums">{stat.value}</p>
              <p className="text-[10px] text-label-secondary">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {activeReserves.length > 0 && (
        <Link href="/dashboard/reservas">
          <GlassCard className="p-5 hover:bg-fill transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-4">
              <PiggyBank className="w-4 h-4 text-accent" />
              <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Reservas activas</p>
              {overdue.length > 0 && (
                <span className="text-[10px] text-system-red font-medium ml-auto">{overdue.length} vencidas</span>
              )}
              <span className="text-[10px] text-label-secondary">{activeReserves.length}</span>
            </div>
            <div className="space-y-3">
              {activeReserves.slice(0, 3).map((r) => {
                const progress = r.targetAmount > 0 ? Math.min((r.currentAmount / r.targetAmount) * 100, 100) : 0;
                return (
                  <div key={r.uuid} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-xs font-medium truncate">{r.name}</p>
                      <p className="text-[10px] text-label-secondary tabular-nums">
                        ${Number(r.currentAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })} / ${Number(r.targetAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-20">
                      <div className="h-1.5 bg-fill rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <p className="text-[10px] text-label-secondary text-right mt-0.5 tabular-nums">{progress.toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {completedReserves.length > 0 && (
              <p className="text-[10px] text-label-secondary mt-3 text-center">{completedReserves.length} completadas</p>
            )}
          </GlassCard>
        </Link>
      )}
    </div>
  );
}
