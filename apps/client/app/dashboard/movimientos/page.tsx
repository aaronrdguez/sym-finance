"use client";

import { motion } from "motion/react";
import { ArrowLeftRight, ArrowUpRight, ArrowDownRight, Search, Pencil, Trash2, Plus } from "lucide-react";
import { detectBrand } from "../../libs/brand-map";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import { TransactionDialog } from "../../components/TransactionDialog";
import { Button } from "../../components/ui/button";
import { useEffect, useMemo, useState } from 'react'
import api from '../../libs/api'

interface Transaction {
  uuid: string
  name: string
  amount: number
  date: string
  category: string
  account: string
  type: "income" | "expense"
  description: string
  currency: string
  externalId: string | null
}

interface TransactionsProps {
  transactions: Transaction[]
  accounts: { name: string; icon: string; color: string }[]
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
  onCreateOpen: () => void
}

const categoryColors: Record<string, string> = {
  salary: "bg-system-green",
  freelance: "bg-sky-500",
  investments: "bg-system-purple",
  gifts: "bg-pink-500",
  other_income: "bg-system-green/70",
  food: "bg-system-orange",
  transport: "bg-blue-500",
  subscriptions: "bg-system-red",
  health: "bg-teal-500",
  entertainment: "bg-violet-500",
  shopping: "bg-rose-500",
  bills: "bg-amber-500",
  education: "bg-indigo-500",
  other_expense: "bg-stone-500",
  credit_card: "bg-blue-500",
  debit_card: "bg-cyan-500",
  transfer: "bg-violet-500",
  cash: "bg-emerald-500",
  withdrawal: "bg-orange-500",
  payment: "bg-stone-500",
}

const categoryLabels: Record<string, string> = {
  salary: "Salario",
  freelance: "Freelance",
  investments: "Inversiones",
  gifts: "Regalos",
  other_income: "Otros",
  food: "Alimentos",
  transport: "Transporte",
  subscriptions: "Suscripciones",
  health: "Salud",
  entertainment: "Entretenimiento",
  shopping: "Compras",
  bills: "Servicios",
  education: "Educación",
  other_expense: "Otros",
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  transfer: "Transferencia",
  cash: "Efectivo",
  withdrawal: "Extracción",
  payment: "Pago",
}

function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Hoy"
  if (date.toDateString() === yesterday.toDateString()) return "Ayer"

  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 7) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[date.getDay()]
  }

  return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

export default function LoadTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<{ name: string; icon: string; color: string }[]>([])
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  const loadData = async () => {
    try {
      const [txRes, accRes] = await Promise.all([
        api.get('/api/transactions', { method: 'GET' }),
        api.get('/api/accounts', { method: 'GET' })
      ])
      if (txRes.data.ok) setTransactions(txRes.data.transactions)
      if (accRes.data.ok) setAccounts(accRes.data.accounts)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (tx: Transaction) => {
    if (tx.externalId) return
    if (!confirm("¿Eliminar esta transacción?")) return
    try {
      await api.delete(`/api/transactions/${tx.uuid}`)
      loadData()
    } catch {}
  }

  return (
    <>
      <DashboardShell>
        <TransactionsContent
          transactions={transactions}
          accounts={accounts}
          onEdit={setEditTx}
          onDelete={handleDelete}
          onCreateOpen={() => setCreateOpen(true)}
          search={search}
          onSearchChange={setSearch}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
        />
      </DashboardShell>
      <TransactionDialog
        accounts={accounts}
        transaction={editTx}
        open={!!editTx}
        onOpenChange={(o) => { if (!o) setEditTx(null) }}
        onSuccess={() => { setEditTx(null); loadData() }}
      />
      <TransactionDialog
        accounts={accounts}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => { setCreateOpen(false); loadData() }}
      />
    </>
  )
}

function TransactionsContent({
  transactions, accounts, onEdit, onDelete, onCreateOpen,
  search, onSearchChange, filterType, onFilterTypeChange,
}: TransactionsProps & {
  search: string
  onSearchChange: (v: string) => void
  filterType: "all" | "income" | "expense"
  onFilterTypeChange: (v: "all" | "income" | "expense") => void
}) {
  const filtered = useMemo(() => {
    let list = transactions
    if (filterType === "income") list = list.filter(tx => tx.amount > 0)
    if (filterType === "expense") list = list.filter(tx => tx.amount < 0)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(tx =>
        tx.name.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.account.toLowerCase().includes(q) ||
        (tx.description || '').toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, search, filterType])

  const grouped = useMemo(() => {
    const groups: { label: string; transactions: Transaction[] }[] = []
    let currentGroup: { label: string; transactions: Transaction[] } | null = null
    for (const tx of filtered) {
      const label = formatDateGroup(tx.date)
      if (!currentGroup || currentGroup.label !== label) {
        currentGroup = { label, transactions: [] }
        groups.push(currentGroup)
      }
      currentGroup.transactions.push(tx)
    }
    return groups
  }, [filtered])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Movimientos</h1>
          <p className="text-sm text-label-secondary mt-0.5">Historial de transacciones</p>
        </div>
        <Button size="sm" className="gap-2 rounded-xl text-xs h-9 bg-accent hover:bg-accent/90" onClick={onCreateOpen}>
          <Plus className="w-3.5 h-3.5" />
          Nueva transacción
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-label-secondary" />
          <input
            type="text"
            placeholder="Buscá por nombre, categoría o cuenta..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-input-background border-0 text-sm outline-none placeholder:text-label-secondary/60"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as any)}
          className="h-11 px-3 rounded-xl bg-input-background border-0 text-sm outline-none text-label-secondary cursor-pointer"
        >
          <option value="all">Todos</option>
          <option value="expense">Gastos</option>
          <option value="income">Ingresos</option>
        </select>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <GlassCard>
            <div className="p-12 text-center">
              <ArrowLeftRight className="w-10 h-10 mx-auto text-label-tertiary mb-4" />
              <p className="text-sm font-medium text-label-secondary">No hay movimientos</p>
              <p className="text-xs text-label-secondary/60 mt-1">
                {search ? "No encontramos resultados para esa búsqueda" : "Todavía no registraste transacciones"}
              </p>
            </div>
          </GlassCard>
        ) : (
          grouped.map((group, gi) => (
            <motion.div
              key={group.label + "-" + group.transactions[0].uuid}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + gi * 0.04 }}
            >
              <div className="flex items-center gap-3 mb-3 px-1">
                <h3 className="text-xs font-semibold text-label-secondary uppercase tracking-wider">{group.label}</h3>
                <div className="h-px flex-1 bg-separator" />
                <span className="text-[10px] text-label-tertiary font-medium">
                  {group.transactions.length} {group.transactions.length === 1 ? "movimiento" : "movimientos"}
                </span>
              </div>

              <GlassCard className="overflow-hidden">
                <div className="divide-y divide-separator">
                  {group.transactions.map((tx, idx) => {
                    const brand = detectBrand(tx.description || tx.name)
                    const isIncome = tx.amount > 0
                    const catColor = categoryColors[tx.category] || "bg-stone-500"

                    return (
                      <motion.div
                        key={tx.uuid || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: idx * 0.02 }}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-fill transition-colors group cursor-default"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {brand ? (
                            brand.svg ? (
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `#${brand.hex}12` }}
                                title={brand.title}
                                dangerouslySetInnerHTML={{
                                  __html: brand.svg
                                    .replace('<svg ', `<svg width="20" height="20" fill="#${brand.hex}" `)
                                    .replace('<svg>', `<svg width="20" height="20" fill="#${brand.hex}">`)
                                }}
                              />
                            ) : brand.LucideIcon ? (
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `#${brand.hex}12`, color: `#${brand.hex}` }}
                                title={brand.title}
                              >
                                <brand.LucideIcon className="w-[18px] h-[18px]" />
                              </div>
                            ) : null
                          ) : (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? "bg-system-green/10 text-system-green"
                                : "bg-system-red/10 text-system-red"
                            }`}>
                              {isIncome ? <ArrowUpRight className="w-[18px] h-[18px]" /> : <ArrowDownRight className="w-[18px] h-[18px]" />}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{tx.name}</p>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${catColor}`} title={categoryLabels[tx.category] || tx.category} />
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-label-secondary mt-0.5">
                              {brand && <span className="font-medium">{brand.title}</span>}
                              {brand && <span>·</span>}
                              <span>{categoryLabels[tx.category] || tx.category}</span>
                              <span>·</span>
                              <span>{tx.account}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className={`text-sm font-semibold tabular-nums ${
                              isIncome ? "text-system-green" : "text-system-red"
                            }`}>
                              {isIncome ? "+" : ""}${Math.abs(tx.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-label-tertiary font-medium">{tx.currency}</p>
                          </div>

                          {!tx.externalId && (
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={() => onEdit(tx)}
                                className="w-8 h-8 rounded-lg hover:bg-fill flex items-center justify-center text-label-secondary hover:text-label transition-colors"
                                title="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDelete(tx)}
                                className="w-8 h-8 rounded-lg hover:bg-system-red/10 flex items-center justify-center text-label-secondary hover:text-system-red transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}
