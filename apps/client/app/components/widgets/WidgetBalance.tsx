"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Eye, EyeOff, ChevronDown } from "lucide-react";
import { GlassCard } from "../GlassCard";
import type { ResolvedWidgetData } from "./types";

const ease = [0.16, 1, 0.3, 1] as const;

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease },
  },
};

export function WidgetBalance({ accounts, monthlyIncome, monthlyExpenses, CURRENCY_CONFIG, convertCurrency, getCurrencySymbol }: ResolvedWidgetData & { monthlyIncome: number; monthlyExpenses: number }) {
  const [showBalances, setShowBalances] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState("ARS");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const balancesByCurrency = accounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.currency] = (acc[a.currency] || 0) + a.balance;
    return acc;
  }, {});

  const converted = Object.entries(balancesByCurrency).reduce((sum, [currency, amount]) => {
    return sum + convertCurrency(amount, currency, displayCurrency);
  }, 0);

  const displaySymbol = getCurrencySymbol(displayCurrency);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">
          Balance total
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-label-secondary hover:text-label hover:bg-fill transition-colors"
            >
              {CURRENCY_CONFIG[displayCurrency]?.flag} {displayCurrency}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showCurrencyMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] bg-card rounded-xl shadow-lg border border-separator py-1 overflow-hidden">
                  {Object.entries(CURRENCY_CONFIG).map(([code, cfg]) => (
                    <button
                      key={code}
                      onClick={() => { setDisplayCurrency(code); setShowCurrencyMenu(false) }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors hover:bg-fill ${displayCurrency === code ? 'text-accent font-semibold' : 'text-label-secondary'}`}
                    >
                      <span>{cfg.flag}</span>
                      <span className="flex-1 text-left">{code}</span>
                      <span className="text-[10px] opacity-60">{cfg.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-1.5 rounded-lg text-label-secondary hover:text-label hover:bg-fill transition-colors"
          >
            {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <p className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight tabular-nums">
        {showBalances
          ? `${displaySymbol} ${converted.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '••••••••'}
      </p>

      {showBalances && Object.keys(balancesByCurrency).length > 1 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(balancesByCurrency).map(([currency, amount]) => (
            <span key={currency} className="text-[11px] text-label-secondary bg-fill px-2.5 py-1 rounded-lg tabular-nums">
              {CURRENCY_CONFIG[currency]?.flag || ''} {getCurrencySymbol(currency)}{amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <motion.div
          variants={scaleInVariants}
          className="rounded-xl bg-system-green/10 p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-system-green mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Ingresos</span>
          </div>
          <p className="text-lg font-bold tabular-nums">{showBalances ? `$ ${monthlyIncome.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : '••••••'}</p>
          <p className="text-[11px] text-label-secondary mt-0.5">Este mes</p>
        </motion.div>
        <motion.div
          variants={scaleInVariants}
          className="rounded-xl bg-system-red/10 p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-system-red mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Gastos</span>
          </div>
          <p className="text-lg font-bold tabular-nums">{showBalances ? `$ ${monthlyExpenses.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : '••••••'}</p>
          <p className="text-[11px] text-label-secondary mt-0.5">Este mes</p>
        </motion.div>
      </div>
    </GlassCard>
  );
}
