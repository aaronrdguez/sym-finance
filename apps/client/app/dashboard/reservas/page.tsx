"use client";

import { motion } from "motion/react";
import { PiggyBank, Plus, Trash2, TrendingUp, Clock, CheckCircle2, Circle, HandCoins } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useEffect, useState } from 'react'
import api from '../../libs/api'

interface Reserve {
  uuid: string
  name: string
  targetAmount: number
  currentAmount: number
  category: string
  currency: string
  deadline: string | null
  completed: boolean
  completedAt: string | null
}

const categories = [
  { value: "emergencia", label: "Emergencia" },
  { value: "ahorro", label: "Ahorro" },
  { value: "viaje", label: "Viaje" },
  { value: "inversion", label: "Inversión" },
  { value: "educacion", label: "Educación" },
  { value: "salud", label: "Salud" },
  { value: "otros", label: "Otros" },
]

const currencies = [
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "USD", label: "USD (US$)", symbol: "US$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
]

const categoryLabels: Record<string, string> = Object.fromEntries(categories.map(c => [c.value, c.label]))

export default function ReservasPage() {
  const [reserves, setReserves] = useState<Reserve[]>([])
  const [open, setOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState("")
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")
  const [category, setCategory] = useState("ahorro")
  const [currency, setCurrency] = useState("ARS")
  const [deadline, setDeadline] = useState("")
  const [error, setError] = useState("")

  const loadReserves = async () => {
    try {
      const response = await api.get('/api/reserves', { method: 'GET' })
      if (response.data.ok) {
        setReserves(response.data.reserves)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadReserves()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount) || 0;
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setError("El monto objetivo debe ser mayor a 0");
      return;
    }
    try {
      const response = await api.post('/api/reserves', {
        name, targetAmount: parsedTarget, currentAmount: parsedCurrent,
        category, currency, deadline: deadline || undefined
      })

      if (response.data.ok) {
        setOpen(false)
        setName("")
        setTargetAmount("")
        setCurrentAmount("")
        setCategory("ahorro")
        setCurrency("ARS")
        setDeadline("")
        loadReserves()
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }

  const handleDeposit = async (uuid: string) => {
    const parsed = parseFloat(depositAmount)
    if (isNaN(parsed) || parsed <= 0) return

    try {
      const response = await api.patch(`/api/reserves/${uuid}/deposit`, { amount: parsed })
      if (response.data.ok) {
        setDepositOpen(null)
        setDepositAmount("")
        loadReserves()
      }
    } catch {
      // ignore
    }
  }

  const handleToggleComplete = async (reserve: Reserve) => {
    try {
      await api.put(`/api/reserves/${reserve.uuid}`, { completed: !reserve.completed })
      loadReserves()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (uuid: string) => {
    try {
      const response = await api.delete(`/api/reserves/${uuid}`)
      if (response.data.ok) {
        loadReserves()
      }
    } catch {
      // ignore
    }
  }

  const activeReserves = reserves.filter(r => !r.completed)
  const completedReserves = reserves.filter(r => r.completed)
  const totalReserved = activeReserves.reduce((sum, r) => sum + r.currentAmount, 0)
  const totalTarget = activeReserves.reduce((sum, r) => sum + r.targetAmount, 0)
  const overallProgress = totalTarget > 0 ? Math.min((totalReserved / totalTarget) * 100, 100) : 0
  const overdue = activeReserves.filter(r => r.deadline && new Date(r.deadline) < new Date())

  const daysLeft = (d: string) => {
    const diff = new Date(d).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Reservas</h1>
          <p className="text-sm text-label-secondary mt-0.5">Tus objetivos financieros</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 rounded-xl text-xs h-9 bg-accent hover:bg-accent/90">
              <Plus className="w-3.5 h-3.5" />
              Nueva reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
            <div className="p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Nueva reserva</DialogTitle>
                <DialogDescription className="text-sm text-label-secondary">
                  Definí un objetivo de ahorro.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="ej. Fondo de emergencia, Viaje a Europa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Monto objetivo
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAmount" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Monto inicial <span className="text-label-secondary/60">(opcional)</span>
                </Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Categoría
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Divisa
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Fecha límite <span className="text-label-secondary/60">(opcional)</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-system-red text-center"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 rounded-xl text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl text-sm bg-accent hover:bg-accent/90"
                >
                  Crear reserva
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider mb-1">Total reservado</p>
          <p className="text-2xl font-bold tabular-nums">
            ${totalReserved.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2 text-accent">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{activeReserves.length} activas</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider mb-1">Objetivo total</p>
          <p className="text-2xl font-bold tabular-nums">
            ${totalTarget.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-label-secondary mt-2">Meta acumulada</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider mb-1">Progreso general</p>
          <p className="text-2xl font-bold tabular-nums">{overallProgress.toFixed(1)}%</p>
          <div className="mt-3 h-1.5 bg-fill rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider mb-1">Completadas</p>
          <p className="text-2xl font-bold tabular-nums">{completedReserves.length}</p>
          <p className="text-xs text-label-secondary mt-2">
            {completedReserves.length > 0
              ? `De ${reserves.length} reservas totales`
              : "Aún no completaste ninguna"}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="px-5 py-3.5 border-b border-separator flex items-center justify-between">
          <h2 className="text-xs font-semibold text-label-secondary uppercase tracking-wider">Reservas activas</h2>
          <div className="flex items-center gap-2">
            {overdue.length > 0 && (
              <span className="text-[10px] text-system-red font-medium">{overdue.length} vencidas</span>
            )}
            <span className="text-xs text-label-secondary">{activeReserves.length}</span>
          </div>
        </div>
        {activeReserves.length === 0 ? (
          <div className="p-10 text-center">
            <PiggyBank className="w-8 h-8 mx-auto text-label-tertiary mb-3" />
            <p className="text-sm text-label-secondary">No tenés reservas activas</p>
            <p className="text-xs text-label-secondary/60 mt-1">Agregá una para empezar a ahorrar</p>
          </div>
        ) : (
          <div className="divide-y divide-separator">
            {activeReserves.map((reserve, idx) => {
              const progress = reserve.targetAmount > 0 ? Math.min((reserve.currentAmount / reserve.targetAmount) * 100, 100) : 0
              const isOverdue = reserve.deadline && new Date(reserve.deadline) < new Date()
              const dLeft = reserve.deadline ? daysLeft(reserve.deadline) : null

              return (
                <motion.div
                  key={reserve.uuid}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.03 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-fill transition-colors gap-4"
                >
                  <button
                    onClick={() => handleToggleComplete(reserve)}
                    className="shrink-0 mt-0.5"
                    title="Marcar como completada"
                  >
                    <Circle className="w-5 h-5 text-label-tertiary hover:text-system-green transition-colors" />
                  </button>

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{reserve.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-label-secondary">
                        <span className="capitalize">{categoryLabels[reserve.category] || reserve.category}</span>
                        {reserve.deadline && (
                          <>
                            <span>·</span>
                            <span className={`flex items-center gap-1 ${isOverdue ? 'text-system-red' : ''}`}>
                              <Clock className="w-3 h-3" />
                              {isOverdue ? "Vencida" : `${dLeft} días`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right min-w-[100px]">
                      <p className="text-sm font-semibold tabular-nums">
                        ${Number(reserve.currentAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        <span className="text-[10px] text-label-secondary ml-0.5">{reserve.currency}</span>
                      </p>
                      <p className="text-[10px] text-label-secondary tabular-nums">
                        meta: ${Number(reserve.targetAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="w-16">
                      <div className="h-1.5 bg-fill rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + idx * 0.05 }}
                        />
                      </div>
                      <p className="text-[10px] text-label-secondary text-right mt-0.5 tabular-nums">{progress.toFixed(0)}%</p>
                    </div>

                    <Dialog open={depositOpen === reserve.uuid} onOpenChange={(o) => { setDepositOpen(o ? reserve.uuid : null); if (!o) setDepositAmount("") }}>
                      <DialogTrigger asChild>
                        <button
                          className="w-7 h-7 rounded-lg hover:bg-accent/10 flex items-center justify-center text-label-secondary hover:text-accent transition-colors"
                          title="Agregar dinero"
                        >
                          <HandCoins className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden rounded-[20px]">
                        <div className="p-6 pb-0">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Agregar dinero</DialogTitle>
                            <DialogDescription className="text-sm text-label-secondary">
                              ¿Cuánto querés sumar a <strong>{reserve.name}</strong>?
                            </DialogDescription>
                          </DialogHeader>
                        </div>
                        <div className="p-6 pt-5 space-y-5">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-label-secondary uppercase tracking-wider">Monto</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                              autoFocus
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => { setDepositOpen(null); setDepositAmount("") }}
                              className="flex-1 h-11 rounded-xl text-sm"
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeposit(reserve.uuid)}
                              className="flex-1 h-11 rounded-xl text-sm bg-accent hover:bg-accent/90"
                            >
                              Depositar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <button
                      onClick={() => handleDelete(reserve.uuid)}
                      className="w-7 h-7 rounded-lg hover:bg-fill flex items-center justify-center text-label-secondary hover:text-system-red transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>

      {completedReserves.length > 0 && (
        <div className="mt-6">
          <GlassCard className="overflow-hidden">
            <div className="px-5 py-3.5 border-b border-separator flex items-center justify-between">
              <h2 className="text-xs font-semibold text-label-secondary uppercase tracking-wider">Completadas</h2>
              <span className="text-xs text-label-secondary">{completedReserves.length}</span>
            </div>
            <div className="divide-y divide-separator">
              {completedReserves.map((reserve, idx) => (
                <motion.div
                  key={reserve.uuid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.03 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-fill transition-colors gap-4"
                >
                  <button
                    onClick={() => handleToggleComplete(reserve)}
                    className="shrink-0"
                    title="Reabrir"
                  >
                    <CheckCircle2 className="w-5 h-5 text-system-green" />
                  </button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-system-green/10 text-system-green flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-through text-label-secondary">{reserve.name}</p>
                      <p className="text-[11px] text-label-secondary/60 capitalize">
                        {categoryLabels[reserve.category] || reserve.category}
                        {reserve.completedAt && ` · Completada ${new Date(reserve.completedAt).toLocaleDateString("es-AR")}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-system-green tabular-nums">
                      ${Number(reserve.currentAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </DashboardShell>
  );
}
