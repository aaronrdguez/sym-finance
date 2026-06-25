"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw, X, ExternalLink } from "lucide-react";
import { GlassCard } from "../GlassCard";
import api from "../../libs/api";
import Link from "next/link";

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number | null;
  changePercent: number | null;
}

export function WidgetMarket() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const load = async () => {
    try {
      const res = await api.get("/api/preferences");
      const stored = res.data.preferences?.favoriteStocks as string[] | undefined;
      if (stored && stored.length > 0) {
        setFavorites(stored);
        setLoading(true);
        const qRes = await api.post("/api/market/stocks/batch", { symbols: stored });
        setQuotes(qRes.data.quotes || []);
      } else {
        setFavorites([]);
        setQuotes([]);
      }
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  const removeFavorite = async (sym: string) => {
    const updated = favorites.filter(s => s !== sym);
    setFavorites(updated);
    setQuotes(prev => prev.filter(q => q.symbol !== sym));
    try { await api.post("/api/market/favorites", { favoriteStocks: updated }); } catch {}
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Mercado</p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/mercado"
            className="p-1.5 rounded-lg text-label-secondary hover:bg-fill transition-colors"
            title="Administrar favoritos"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button onClick={load} className="p-1.5 rounded-lg text-label-secondary hover:bg-fill transition-colors" disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-fill rounded-lg animate-pulse" />)}
        </div>
      ) : quotes.length > 0 ? (
        <div className="space-y-1">
          {quotes.map(q => {
            const isUp = (q.change ?? 0) >= 0;
            return (
              <div key={q.symbol} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-fill/50 transition-colors group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold">{q.symbol}</p>
                    <span className="text-[10px] text-label-secondary truncate">{q.name}</span>
                  </div>
                  <p className="text-[10px] text-label-secondary">{q.currency}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-xs font-semibold tabular-nums">
                      {q.currency === 'ARS' ? '$' : 'US$'} {q.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-[10px] font-medium tabular-nums ${isUp ? 'text-system-green' : 'text-system-red'}`}>
                      {isUp ? '+' : ''}{q.change?.toFixed(2) ?? '0.00'} ({q.changePercent?.toFixed(2) ?? '0.00'}%)
                    </p>
                  </div>
                  <button onClick={() => removeFavorite(q.symbol)} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-label-secondary">Sin favoritos</p>
          <Link href="/dashboard/mercado" className="text-xs text-accent hover:underline mt-1 inline-block">
            Elegir acciones
          </Link>
        </div>
      )}
    </GlassCard>
  );
}
