"use client";

import { BarChart3, ArrowUpRight } from "lucide-react";
import { GlassCard } from "../GlassCard";

export function WidgetInvestments() {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Inversiones</p>
        <BarChart3 className="w-4 h-4 text-accent" />
      </div>
      <p className="text-xl font-bold tabular-nums">$ 12,890.00</p>
      <div className="flex items-center gap-1.5 mt-2 text-system-green">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">+8.2% este mes</span>
      </div>
    </GlassCard>
  );
}
