"use client";

import { useEffect, useState, useMemo } from "react";
import { CandlestickChart, Plus, X, Search, ChevronDown, TrendingUp } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import api from "../../libs/api";

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number | null;
  changePercent: number | null;
}

const MARKET_SUFFIXES: Record<string, string> = {
  "Wall Street": "",
  BYMA: ".BA",
  Bovespa: ".SA",
  "IBEX 35": ".MC",
  TSX: ".TO",
  LSE: ".L",
  Xetra: ".DE",
};

type MarketKey = keyof typeof MARKET_SUFFIXES;

const CURATED_SYMBOLS: Record<MarketKey, { sym: string; name: string }[]> = {
  "Wall Street": [
    { sym: "AAPL", name: "Apple Inc." }, { sym: "MSFT", name: "Microsoft Corp." },
    { sym: "GOOGL", name: "Alphabet Inc." }, { sym: "AMZN", name: "Amazon.com Inc." },
    { sym: "META", name: "Meta Platforms" }, { sym: "NVDA", name: "NVIDIA Corp." },
    { sym: "TSLA", name: "Tesla Inc." }, { sym: "JPM", name: "JPMorgan Chase" },
    { sym: "V", name: "Visa Inc." }, { sym: "WMT", name: "Walmart Inc." },
    { sym: "JNJ", name: "Johnson & Johnson" }, { sym: "PG", name: "Procter & Gamble" },
    { sym: "MA", name: "Mastercard Inc." }, { sym: "UNH", name: "UnitedHealth Group" },
    { sym: "HD", name: "Home Depot Inc." }, { sym: "DIS", name: "Disney Co." },
    { sym: "NFLX", name: "Netflix Inc." }, { sym: "BA", name: "Boeing Co." },
    { sym: "KO", name: "Coca-Cola Co." }, { sym: "PEP", name: "PepsiCo Inc." },
    { sym: "AMD", name: "AMD Inc." }, { sym: "INTC", name: "Intel Corp." },
    { sym: "IBM", name: "IBM Corp." }, { sym: "ORCL", name: "Oracle Corp." },
    { sym: "CSCO", name: "Cisco Systems" }, { sym: "QCOM", name: "Qualcomm Inc." },
  ],
  BYMA: [
    { sym: "GGAL", name: "Grupo Galicia" }, { sym: "YPFD", name: "YPF S.A." },
    { sym: "PAMP", name: "Pampa Energía" }, { sym: "TXAR", name: "Ternium Argentina" },
    { sym: "ALUA", name: "Aluar" }, { sym: "CRES", name: "Cresud" },
    { sym: "CVH", name: "Cablevisión Holding" }, { sym: "EDN", name: "Edenor" },
    { sym: "HARG", name: "Holcim Argentina" }, { sym: "MIRG", name: "Mirgor" },
    { sym: "SUPV", name: "Grupo Supervielle" }, { sym: "TGSU4", name: "Transportadora Gas Sur" },
    { sym: "TRAN", name: "Transener" }, { sym: "VALO", name: "Valor S.A." },
    { sym: "COME", name: "Soc. Com. del Plata" }, { sym: "MOLA", name: "Molino Río Plata" },
    { sym: "PATA", name: "Patagonia Energy" }, { sym: "TECO", name: "Telecom Argentina" },
    { sym: "CEJO", name: "Central Puerto" }, { sym: "METR", name: "Metrogas" },
  ],
  Bovespa: [
    { sym: "PETR4", name: "Petrobras PN" }, { sym: "VALE3", name: "Vale ON" },
    { sym: "ITUB4", name: "Itaú Unibanco PN" }, { sym: "BBDC4", name: "Bradesco PN" },
    { sym: "ABEV3", name: "Ambev ON" }, { sym: "WEGE3", name: "WEG ON" },
    { sym: "BBAS3", name: "Banco do Brasil ON" }, { sym: "ELET3", name: "Eletrobrás ON" },
    { sym: "B3SA3", name: "B3 ON" }, { sym: "RENT3", name: "Localiza ON" },
    { sym: "JBSS3", name: "JBS ON" }, { sym: "SUZB3", name: "Suzano ON" },
    { sym: "GGBR4", name: "Gerdau PN" }, { sym: "CSNA3", name: "CSN ON" },
    { sym: "LREN3", name: "Lojas Renner ON" }, { sym: "HYPE3", name: "Hypera ON" },
    { sym: "EQTL3", name: "Equatorial ON" }, { sym: "VIVT3", name: "Telefônica Brasil ON" },
    { sym: "USIM5", name: "Usiminas PNA" }, { sym: "RADL3", name: "Raia Drogasil ON" },
  ],
  "IBEX 35": [
    { sym: "SAN", name: "Banco Santander" }, { sym: "BBVA", name: "BBVA" },
    { sym: "TEF", name: "Telefónica" }, { sym: "IBE", name: "Iberdrola" },
    { sym: "REP", name: "Repsol" }, { sym: "ITX", name: "Inditex" },
    { sym: "FER", name: "Ferrovial" }, { sym: "ACS", name: "ACS" },
    { sym: "ENG", name: "Enagás" }, { sym: "MAP", name: "Mapfre" },
    { sym: "ANA", name: "Acciona" }, { sym: "CABK", name: "CaixaBank" },
    { sym: "ELE", name: "Endesa" }, { sym: "IAG", name: "IAG" },
    { sym: "MEL", name: "Meliá Hotels" }, { sym: "MTS", name: "ArcelorMittal" },
  ],
  TSX: [
    { sym: "RY", name: "Royal Bank of Canada" }, { sym: "TD", name: "TD Bank" },
    { sym: "BNS", name: "Bank of Nova Scotia" }, { sym: "BMO", name: "Bank of Montreal" },
    { sym: "CNR", name: "Canadian National Railway" }, { sym: "SHOP", name: "Shopify Inc." },
    { sym: "ENB", name: "Enbridge Inc." }, { sym: "TRP", name: "TC Energy" },
    { sym: "SU", name: "Suncor Energy" }, { sym: "CP", name: "Canadian Pacific Railway" },
  ],
  LSE: [
    { sym: "HSBA", name: "HSBC Holdings" }, { sym: "SHEL", name: "Shell plc" },
    { sym: "AZN", name: "AstraZeneca" }, { sym: "BP", name: "BP plc" },
    { sym: "GSK", name: "GSK plc" }, { sym: "ULVR", name: "Unilever plc" },
    { sym: "RIO", name: "Rio Tinto" }, { sym: "BARC", name: "Barclays" },
    { sym: "LLOY", name: "Lloyds Banking Group" }, { sym: "VOD", name: "Vodafone Group" },
  ],
  Xetra: [
    { sym: "SAP", name: "SAP SE" }, { sym: "SIE", name: "Siemens AG" },
    { sym: "ALV", name: "Allianz SE" }, { sym: "DTE", name: "Deutsche Telekom" },
    { sym: "MBG", name: "Mercedes-Benz Group" }, { sym: "BAYN", name: "Bayer AG" },
    { sym: "BMW", name: "BMW AG" }, { sym: "VOW3", name: "Volkswagen AG" },
    { sym: "ADS", name: "Adidas AG" }, { sym: "MUV2", name: "Münchener Rück" },
    { sym: "DB1", name: "Deutsche Börse" }, { sym: "IFX", name: "Infineon Technologies" },
  ],
};

const MARKET_NAMES: MarketKey[] = Object.keys(MARKET_SUFFIXES) as MarketKey[];

export default function MercadoPage() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState<MarketKey>("Wall Street");
  const [showMarketPicker, setShowMarketPicker] = useState(false);

  const loadFavorites = async () => {
    try {
      const res = await api.get("/api/preferences");
      const stored = res.data.preferences?.favoriteStocks as string[] | undefined;
      if (stored && stored.length > 0) setFavorites(stored);
    } catch {}
  };

  const fetchQuotes = async () => {
    if (favorites.length === 0) return;
    setLoadingQuotes(true);
    try {
      const res = await api.post("/api/market/stocks/batch", { symbols: favorites });
      setQuotes(res.data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => { loadFavorites() }, []);
  useEffect(() => { if (favorites.length > 0) fetchQuotes() }, [favorites]);

  const suffix = MARKET_SUFFIXES[market];
  const curated = CURATED_SYMBOLS[market];

  const filteredCurated = useMemo(() => {
    if (!search.trim()) return curated;
    const q = search.toLowerCase();
    return curated.filter(s => s.sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [search, curated]);

  const fullSymbol = (sym: string) => sym + suffix;

  const addFavorite = async (sym: string) => {
    const full = fullSymbol(sym);
    if (favorites.includes(full)) return;
    const updated = [...favorites, full];
    setFavorites(updated);
    try { await api.post("/api/market/favorites", { favoriteStocks: updated }); } catch {}
  };

  const removeFavorite = async (sym: string) => {
    const updated = favorites.filter(s => s !== sym);
    setFavorites(updated);
    setQuotes(prev => prev.filter(q => q.symbol !== sym));
    try { await api.post("/api/market/favorites", { favoriteStocks: updated }); } catch {}
  };

  const favQuotesMap = useMemo(() => {
    const map = new Map<string, StockQuote>();
    quotes.forEach(q => map.set(q.symbol, q));
    return map;
  }, [quotes]);

  return (
    <DashboardShell>
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Mercado</h1>
          <p className="text-sm text-label-secondary mt-0.5">Buscá y seleccioná tus acciones favoritas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CandlestickChart className="w-4 h-4 text-accent" />
            <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Explorar</p>
          </div>

          <div className="relative mb-3">
            <button
              onClick={() => setShowMarketPicker(!showMarketPicker)}
              className="flex items-center gap-1.5 h-8 rounded-lg bg-fill px-3 text-xs font-medium text-label-secondary hover:text-label transition-colors w-full"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              {market}
            </button>
            {showMarketPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMarketPicker(false)} />
                <div className="absolute top-full left-0 mt-1 w-full bg-[#1C1C1E] rounded-xl border border-[#38383A] shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
                  {MARKET_NAMES.map(mk => (
                    <button
                      key={mk}
                      onClick={() => { setMarket(mk); setShowMarketPicker(false); }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#2C2C2E] transition-colors ${mk === market ? "text-accent font-semibold" : "text-label-secondary"}`}
                    >
                      {mk}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-label-secondary/50 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar símbolo..."
              className="w-full h-9 rounded-lg bg-fill pl-8 pr-3 text-sm outline-none placeholder:text-label-secondary/50"
            />
          </div>

          {filteredCurated.length > 0 ? (
            <div className="space-y-0.5 max-h-[360px] overflow-y-auto scrollbar-thin">
              {filteredCurated.map(s => {
                const full = fullSymbol(s.sym);
                const isFav = favorites.includes(full);
                return (
                  <div key={s.sym} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-fill/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{s.sym}</p>
                      <p className="text-[11px] text-label-secondary truncate">{s.name}</p>
                    </div>
                    {isFav ? (
                      <button onClick={() => removeFavorite(full)} className="w-7 h-7 rounded-lg flex items-center justify-center text-system-red/60 hover:text-system-red hover:bg-system-red/10 transition-all" title="Quitar de favoritos">
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => addFavorite(s.sym)} className="w-7 h-7 rounded-lg flex items-center justify-center text-accent/60 hover:text-accent hover:bg-accent/10 transition-all" title="Agregar a favoritos">
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-label-secondary text-center py-8">No se encontraron símbolos</p>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-system-green" />
              <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Favoritos</p>
            </div>
            {favorites.length > 0 && (
              <button onClick={fetchQuotes} className="p-1.5 rounded-lg text-label-secondary hover:bg-fill transition-colors" disabled={loadingQuotes}>
                <TrendingUp className={`w-3.5 h-3.5 ${loadingQuotes ? 'animate-pulse' : ''}`} />
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <p className="text-sm text-label-secondary text-center py-8">Elegí acciones del panel de la izquierda</p>
          ) : loadingQuotes ? (
            <div className="space-y-2">
              {favorites.map((s, i) => (
                <div key={i} className="h-12 bg-fill rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin">
              {favorites.map(full => {
                const q = favQuotesMap.get(full);
                return (
                  <div key={full} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-fill/50 transition-colors group">
                    {q ? (
                      <>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold">{q.symbol}</p>
                            <span className="text-[11px] text-label-secondary truncate">{q.name}</span>
                          </div>
                          <p className="text-[11px] text-label-secondary">{q.currency}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold tabular-nums">
                              {q.currency === "ARS" ? "$" : "US$"} {q.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                            </p>
                            <p className={`text-[11px] font-medium tabular-nums ${(q.change ?? 0) >= 0 ? "text-system-green" : "text-system-red"}`}>
                              {(q.change ?? 0) >= 0 ? "+" : ""}{q.change?.toFixed(2) ?? "0.00"} ({q.changePercent?.toFixed(2) ?? "0.00"}%)
                            </p>
                          </div>
                          <button onClick={() => removeFavorite(q.symbol)} className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-medium">{full}</p>
                        <button onClick={() => removeFavorite(full)} className="w-6 h-6 rounded flex items-center justify-center text-label-secondary hover:text-system-red transition-colors">
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
