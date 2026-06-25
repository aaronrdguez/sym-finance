"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";
import { GlassCard } from "../GlassCard";
import api from "../../libs/api";

interface RateEntry {
  from: string;
  to: string;
  rate: number;
}

const PAIRS = [
  { from: "USD", to: "ARS" },
  { from: "EUR", to: "ARS" },
  { from: "BRL", to: "ARS" },
  { from: "GBP", to: "ARS" },
];

const FALLBACK_RATES: RateEntry[] = [
  { from: "USD", to: "ARS", rate: 1245.50 },
  { from: "EUR", to: "ARS", rate: 1352.80 },
  { from: "BRL", to: "ARS", rate: 218.30 },
  { from: "GBP", to: "ARS", rate: 1578.20 },
];

export function WidgetExchangeRates() {
  const [rates, setRates] = useState<RateEntry[]>(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/api/market/exchange-rates");
      const allRates = res.data.rates as Record<string, number>;
      if (allRates) {
        const entries = PAIRS.map(p => ({
          from: p.from,
          to: p.to,
          rate: allRates[p.from] ? allRates[p.to] / allRates[p.from] : 0,
        }));
        setRates(entries);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates() }, [fetchRates]);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-system-green" />
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Tipo de cambio</p>
        </div>
        <button onClick={fetchRates} className="p-1.5 rounded-lg text-label-secondary hover:bg-fill transition-colors" disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {loading && !rates.length ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 bg-fill rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {error && (
            <p className="text-[10px] text-system-red mb-2">No se pudo actualizar. Mostrando datos anteriores.</p>
          )}
          <div className="space-y-3">
            {rates.map((fx, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold w-8">{fx.from}</span>
                  <span className="text-[11px] text-label-secondary">→</span>
                  <span className="text-xs font-semibold w-8">{fx.to}</span>
                </div>
                <p className="text-sm font-semibold tabular-nums">
                  $ {fx.rate.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </GlassCard>
  );
}
