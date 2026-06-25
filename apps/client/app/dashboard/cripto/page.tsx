"use client";

import { useEffect, useState, useMemo } from "react";
import { Bitcoin, Plus, X, Search, TrendingUp } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import api from "../../libs/api";

interface CryptoPrice {
  id: string;
  price: number | null;
  change24h: number | null;
}

const CURATED_COINS: { id: string; name: string; symbol: string }[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "tether", name: "Tether", symbol: "USDT" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "usd-coin", name: "USD Coin", symbol: "USDC" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "staked-ether", name: "Lido Staked Ether", symbol: "STETH" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "wrapped-bitcoin", name: "Wrapped Bitcoin", symbol: "WBTC" },
  { id: "polygon", name: "Polygon", symbol: "POL" },
  { id: "the-open-network", name: "Toncoin", symbol: "TON" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "dai", name: "Dai", symbol: "DAI" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "bitcoin-cash", name: "Bitcoin Cash", symbol: "BCH" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "cosmos", name: "Cosmos Hub", symbol: "ATOM" },
  { id: "ethereum-classic", name: "Ethereum Classic", symbol: "ETC" },
  { id: "leo-token", name: "LEO Token", symbol: "LEO" },
  { id: "near", name: "NEAR Protocol", symbol: "NEAR" },
  { id: "aptos", name: "Aptos", symbol: "APT" },
  { id: "cronos", name: "Cronos", symbol: "CRO" },
  { id: "pepe", name: "Pepe", symbol: "PEPE" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "internet-computer", name: "Internet Computer", symbol: "ICP" },
  { id: "filecoin", name: "Filecoin", symbol: "FIL" },
  { id: "algorand", name: "Algorand", symbol: "ALGO" },
  { id: "hedera-hashgraph", name: "Hedera", symbol: "HBAR" },
  { id: "vechain", name: "VeChain", symbol: "VET" },
  { id: "tezos", name: "Tezos", symbol: "XTZ" },
  { id: "elrond-erd-2", name: "MultiversX", symbol: "EGLD" },
  { id: "the-graph", name: "The Graph", symbol: "GRT" },
  { id: "aave", name: "Aave", symbol: "AAVE" },
  { id: "theta-token", name: "Theta Network", symbol: "THETA" },
  { id: "eos", name: "EOS", symbol: "EOS" },
  { id: "flow", name: "Flow", symbol: "FLOW" },
  { id: "quant-netwrok", name: "Quant", symbol: "QNT" },
  { id: "kucoin-shares", name: "KuCoin Token", symbol: "KCS" },
  { id: "maker", name: "Maker", symbol: "MKR" },
  { id: "neo", name: "Neo", symbol: "NEO" },
  { id: "injective-protocol", name: "Injective", symbol: "INJ" },
  { id: "fetch-ai", name: "Fetch.ai", symbol: "FET" },
  { id: "gala", name: "Gala", symbol: "GALA" },
];

export default function CriptoPage() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [search, setSearch] = useState("");

  const loadFavorites = async () => {
    try {
      const res = await api.get("/api/preferences");
      const stored = res.data.preferences?.favoriteCryptos as string[] | undefined;
      if (stored && stored.length > 0) setFavorites(stored);
    } catch {}
  };

  const fetchPrices = async () => {
    if (favorites.length === 0) return;
    setLoadingPrices(true);
    try {
      const res = await api.post("/api/market/crypto/batch", { coins: favorites });
      setPrices(res.data.prices || []);
    } catch {
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => { loadFavorites() }, []);
  useEffect(() => { if (favorites.length > 0) fetchPrices() }, [favorites]);

  const filteredCurated = useMemo(() => {
    if (!search.trim()) return CURATED_COINS;
    const q = search.toLowerCase();
    return CURATED_COINS.filter(c => c.id.includes(q) || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
  }, [search]);

  const addCoin = async (id: string) => {
    if (favorites.includes(id)) return;
    const updated = [...favorites, id];
    setFavorites(updated);
    try { await api.post("/api/market/favorites", { favoriteCryptos: updated }); } catch {}
  };

  const removeCoin = async (id: string) => {
    const updated = favorites.filter(c => c !== id);
    setFavorites(updated);
    setPrices(prev => prev.filter(p => p.id !== id));
    try { await api.post("/api/market/favorites", { favoriteCryptos: updated }); } catch {}
  };

  const favPricesMap = useMemo(() => {
    const map = new Map<string, CryptoPrice>();
    prices.forEach(p => map.set(p.id, p));
    return map;
  }, [prices]);

  return (
    <DashboardShell>
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Criptomonedas</h1>
          <p className="text-sm text-label-secondary mt-0.5">Buscá y seleccioná tus monedas favoritas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bitcoin className="w-4 h-4 text-system-purple" />
            <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Explorar</p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-label-secondary/50 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar moneda..."
              className="w-full h-9 rounded-lg bg-fill pl-8 pr-3 text-sm outline-none placeholder:text-label-secondary/50"
            />
          </div>

          {filteredCurated.length > 0 ? (
            <div className="space-y-0.5 max-h-[360px] overflow-y-auto scrollbar-thin">
              {filteredCurated.map(c => {
                const isFav = favorites.includes(c.id);
                return (
                  <div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-fill/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.symbol}</p>
                      <p className="text-[11px] text-label-secondary truncate">{c.name}</p>
                    </div>
                    {isFav ? (
                      <button onClick={() => removeCoin(c.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-system-red/60 hover:text-system-red hover:bg-system-red/10 transition-all" title="Quitar de favoritos">
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => addCoin(c.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-system-purple/60 hover:text-system-purple hover:bg-system-purple/10 transition-all" title="Agregar a favoritos">
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-label-secondary text-center py-8">No se encontraron monedas</p>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-system-green" />
              <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Favoritos</p>
            </div>
            {favorites.length > 0 && (
              <button onClick={fetchPrices} className="p-1.5 rounded-lg text-label-secondary hover:bg-fill transition-colors" disabled={loadingPrices}>
                <TrendingUp className={`w-3.5 h-3.5 ${loadingPrices ? 'animate-pulse' : ''}`} />
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <p className="text-sm text-label-secondary text-center py-8">Elegí monedas del panel de la izquierda</p>
          ) : loadingPrices ? (
            <div className="space-y-2">
              {favorites.map((c, i) => (
                <div key={i} className="h-12 bg-fill rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin">
              {favorites.map(id => {
                const p = favPricesMap.get(id);
                const coinData = CURATED_COINS.find(c => c.id === id);
                return (
                  <div key={id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-fill/50 transition-colors group">
                    {p && p.price !== null ? (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{coinData?.symbol || id}</p>
                          <p className="text-[11px] text-label-secondary">{coinData?.name || id}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold tabular-nums">
                              US$ {p.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                            </p>
                            {p.change24h !== null && (
                              <p className={`text-[11px] font-medium tabular-nums ${(p.change24h ?? 0) >= 0 ? "text-system-green" : "text-system-red"}`}>
                                {(p.change24h ?? 0) >= 0 ? "+" : ""}{p.change24h.toFixed(2)}%
                              </p>
                            )}
                          </div>
                          <button onClick={() => removeCoin(id)} className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-medium">{coinData?.symbol || id}</p>
                        <button onClick={() => removeCoin(id)} className="w-6 h-6 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
