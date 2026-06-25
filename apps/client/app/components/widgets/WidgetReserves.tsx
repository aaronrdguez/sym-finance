"use client";

import { motion } from "motion/react";
import { PiggyBank } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "../GlassCard";
import type { ResolvedWidgetData } from "./types";

export function WidgetReserves({ reserves }: ResolvedWidgetData) {
  const activeReserves = reserves.filter(r => !r.completed);
  const completedReserves = reserves.filter(r => r.completed);
  const totalReserved = activeReserves.reduce((sum, r) => sum + r.currentAmount, 0);
  const totalTarget = activeReserves.reduce((sum, r) => sum + r.targetAmount, 0);
  const overallReserveProgress = totalTarget > 0 ? Math.min((totalReserved / totalTarget) * 100, 100) : 0;
  const overdue = activeReserves.filter(r => r.deadline && new Date(r.deadline) < new Date());

  return (
    <Link href="/dashboard/reservas">
      <GlassCard className="p-5 hover:bg-fill transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Reservas</p>
          <PiggyBank className="w-4 h-4 text-accent" />
        </div>
        <p className="text-xl font-bold tabular-nums">$ {totalReserved.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
        <div className="mt-3 h-1.5 bg-fill rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallReserveProgress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="text-[11px] text-label-secondary mt-2">
          {overallReserveProgress.toFixed(0)}% del objetivo total · {activeReserves.length} activas
          {overdue.length > 0 && <span className="text-system-red"> · {overdue.length} vencidas</span>}
          {completedReserves.length > 0 && <span> · {completedReserves.length} completadas</span>}
        </p>
      </GlassCard>
    </Link>
  );
}
