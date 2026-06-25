"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw, X, ExternalLink } from "lucide-react";
import { GlassCard } from "../GlassCard";
import api from "../../libs/api";
import Link from "next/link";

interface CryptoPrice {
  id: string;
  price: number | null;
  change24h: number | null;
}

const COIN_LABELS: Record<string, string> = {
  bitcoin: "Bitcoin", ethereum: "Ethereum", solana: "Solana",
  cardano: "Cardano", polkadot: "Polkadot", ripple: "XRP",
  dogecoin: "Dogecoin", polygon: "Polygon", avalanche: "Avalanche",
  chainlink: "Chainlink", binancecoin: "BNB", "the-open-network": "Toncoin",
  tron: "TRON", "shiba-inu": "Shiba Inu", litecoin: "Litecoin",
  near: "NEAR Protocol", aptos: "Aptos", pepe: "Pepe",
};

export function WidgetCrypto() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const load = async () => {
    try {
      const res = await api.get("/api/preferences");
      const stored = res.data.preferences?.favoriteCryptos as string[] | undefined;
      if (stored && stored.length > 0) {
        setFavorites(stored);
        setLoading(true);
        const pRes = await api.post("/api/market/crypto/batch", { coins: stored });
        setPrices(pRes.data.prices || []);
      } else {
        setFavorites([]);
        setPrices([]);
      }
    } catch {
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  const removeCoin = async (id: string) => {
    const updated = favorites.filter(c => c !== id);
    setFavorites(updated);
    setPrices(prev => prev.filter(p => p.id !== id));
    try { await api.post("/api/market/favorites", { favoriteCryptos: updated }); } catch {}
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-system-purple" />
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Cripto</p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/cripto"
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
      ) : prices.length > 0 ? (
        <div className="space-y-1">
          {prices.map(c => {
            const isUp = (c.change24h ?? 0) >= 0;
            return (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-fill/50 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{COIN_LABELS[c.id] || c.id}</p>
                  <p className="text-[10px] text-label-secondary">{c.id}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-xs font-semibold tabular-nums">
                      {c.price !== null ? `US$ ${c.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : '—'}
                    </p>
                    {c.change24h !== null && (
                      <p className={`text-[10px] font-medium tabular-nums ${isUp ? 'text-system-green' : 'text-system-red'}`}>
                        {isUp ? '+' : ''}{c.change24h.toFixed(2)}%
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeCoin(c.id)} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-all">
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
          <Link href="/dashboard/cripto" className="text-xs text-accent hover:underline mt-1 inline-block">
            Elegir cripto
          </Link>
        </div>
      )}
    </GlassCard>
  );
}
