"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Pencil, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { TransactionDialog } from "../components/TransactionDialog";
import { DashboardShell } from "../components/DashboardShell";
import { ClientWidgetGrid } from "../components/widgets/ClientWidgetGrid";
import { WidgetConfig, Account, Reserve, getDefaultWidgets } from "../components/widgets/types";
import { useAuth } from "./layout";
import api from "../libs/api";

const CURRENCY_CONFIG: Record<string, { symbol: string, name: string, flag: string, perUSD: number }> = {
  ARS:  { symbol: '$',   name: 'Peso Argentino', flag: '🇦🇷', perUSD: 1245.50 },
  USD:  { symbol: 'US$', name: 'Dólar',          flag: '🇺🇸', perUSD: 1 },
  USDT: { symbol: 'USDT', name: 'Tether',        flag: '💎', perUSD: 1 },
  EUR:  { symbol: '€',   name: 'Euro',           flag: '🇪🇺', perUSD: 0.93 },
  BRL:  { symbol: 'R$',  name: 'Real',           flag: '🇧🇷', perUSD: 5.72 },
  GBP:  { symbol: '£',   name: 'Libra Esterlina', flag: '🇬🇧', perUSD: 0.79 },
}

function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = CURRENCY_CONFIG[from]?.perUSD
  const toRate = CURRENCY_CONFIG[to]?.perUSD
  if (!fromRate || !toRate) return amount
  return (amount / fromRate) * toRate
}

function getCurrencySymbol(currency: string): string {
  return CURRENCY_CONFIG[currency]?.symbol || '$'
}

interface Transaction {
  uuid: string
  amount: number
  type: string
  date: string
}

export default function LoadAccount() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshKey, setRefreshKey] = useState(0)
  const [widgets, setWidgets] = useState<WidgetConfig[]>(getDefaultWidgets());
  const [editingWidgets, setEditingWidgets] = useState(false);

  const loadAccounts = async () => {
    try {
      const response = await api.get("/api/accounts");
      setAccounts(response.data.accounts || []);
    } catch {
      setAccounts([])
    }
  }

  const loadReserves = async () => {
    try {
      const response = await api.get("/api/reserves");
      setReserves(response.data.reserves || []);
    } catch {
      setReserves([])
    }
  }

  const loadTransactions = async () => {
    try {
      const response = await api.get("/api/transactions");
      setTransactions(response.data.transactions || []);
    } catch {
      setTransactions([])
    }
  }

  const loadWidgetLayout = async () => {
    try {
      const response = await api.get("/api/preferences");
      const layout = response.data.preferences?.widgetLayout;
      if (layout && Array.isArray(layout) && layout.length > 0) {
        setWidgets(layout as WidgetConfig[]);
      }
    } catch {}
  }

  const saveWidgetLayout = async (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    try {
      await api.post("/api/preferences", { widgetLayout: newWidgets });
    } catch {}
  }

  useEffect(() => {
    loadAccounts();
    loadReserves();
    loadTransactions();
    loadWidgetLayout();
  }, [refreshKey]);

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const widgetData = { accounts, reserves, CURRENCY_CONFIG, convertCurrency, getCurrencySymbol };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Resumen</h1>
            <p className="text-sm text-label-secondary mt-0.5">
              {user ? `Bienvenido de nuevo, ${user.username}` : "Resumen financiero"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 rounded-xl text-xs h-9 transition-all ${editingWidgets ? 'bg-accent text-white hover:bg-accent/90 border-accent' : ''}`}
              onClick={() => setEditingWidgets(!editingWidgets)}
            >
              {editingWidgets ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
              {editingWidgets ? 'Listo' : 'Personalizar'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-9" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="w-3.5 h-3.5" />
              Sincronizar
            </Button>
            <TransactionDialog accounts={accounts} onSuccess={() => setRefreshKey(k => k + 1)} />
          </div>
        </div>

        <ClientWidgetGrid
          widgets={widgets}
          widgetData={widgetData}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          onReorder={saveWidgetLayout}
          editing={editingWidgets}
          onWidgetsChange={saveWidgetLayout}
        />
      </div>
    </DashboardShell>
  )
}
