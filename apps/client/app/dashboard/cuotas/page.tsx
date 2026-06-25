"use client";

import { motion } from "motion/react";
import { CreditCard, Plus, Trash2, CheckCircle } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useEffect, useState } from 'react'
import api from '../../libs/api'

interface Installment {
  uuid: string
  description: string
  totalAmount: number
  totalPaid: number
  installmentCount: number
  paidInstallments: number
  startDate: string
  frequency: string
  category: string
  currency: string
  completed: boolean
  notes: string
}

const frequencyLabels: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
  BIMONTHLY: "Bimestral",
  QUARTERLY: "Trimestral",
  SEMIANNUAL: "Semestral",
  YEARLY: "Anual",
}

const categoryLabels: Record<string, string> = {
  technology: "Tecnología",
  furniture: "Muebles",
  vehicle: "Vehículo",
  education: "Educación",
  health: "Salud",
  travel: "Viajes",
  clothing: "Indumentaria",
  home: "Hogar",
  other: "Otros",
}

const currencies = [
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "USD", label: "USD (US$)", symbol: "US$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
]

export default function CuotasPage() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [installmentCount, setInstallmentCount] = useState("3")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [frequency, setFrequency] = useState("MONTHLY")
  const [category, setCategory] = useState("other")
  const [currency, setCurrency] = useState("ARS")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const loadInstallments = async () => {
    try {
      const response = await api.get('/api/installments', { method: 'GET' })
      if (response.data.ok) {
        setInstallments(response.data.installments)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadInstallments()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedAmount = parseFloat(totalAmount)
    const parsedCount = parseInt(installmentCount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("El monto debe ser mayor a 0")
      return
    }
    if (isNaN(parsedCount) || parsedCount < 1) {
      setError("La cantidad de cuotas debe ser al menos 1")
      return
    }
    try {
      const response = await api.post('/api/installments', {
        description, totalAmount: parsedAmount, installmentCount: parsedCount,
        startDate, frequency, category, currency, notes
      })

      if (response.data.ok) {
        setOpen(false)
        setDescription("")
        setTotalAmount("")
        setInstallmentCount("3")
        setStartDate(new Date().toISOString().split("T")[0])
        setFrequency("MONTHLY")
        setCategory("other")
        setCurrency("ARS")
        setNotes("")
        loadInstallments()
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }

  const handlePay = async (uuid: string) => {
    try {
      const response = await api.put(`/api/installments/${uuid}/pay`)
      if (response.data.ok) {
        loadInstallments()
      }
    } catch {
      // ignore
    }
  }

  const handleDelete = async (uuid: string) => {
    try {
      const response = await api.delete(`/api/installments/${uuid}`)
      if (response.data.ok) {
        loadInstallments()
      }
    } catch {
      // ignore
    }
  }

  const totalPending = installments.filter(i => !i.completed).reduce((sum, i) => sum + (i.totalAmount - i.totalPaid), 0)
  const totalCompleted = installments.filter(i => i.completed).reduce((sum, i) => sum + i.totalAmount, 0)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Cuotas</h1>
          <p className="text-sm text-label-secondary mt-0.5">Gestioná tus pagos en cuotas</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 rounded-xl text-xs h-9 bg-accent hover:bg-accent/90">
              <Plus className="w-3.5 h-3.5" />
              Nueva cuota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
            <div className="p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Nueva compra en cuotas</DialogTitle>
                <DialogDescription className="text-sm text-label-secondary">
                  Registrá una compra que estás pagando en cuotas.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Descripción
                </Label>
                <Input
                  id="description"
                  placeholder="ej. TV Samsung, Notebook, Curso"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Monto total
                  </Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installmentCount" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Cant. cuotas
                  </Label>
                  <Input
                    id="installmentCount"
                    type="number"
                    min="1"
                    max="120"
                    value={installmentCount}
                    onChange={(e) => setInstallmentCount(e.target.value)}
                    className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                  />
                </div>
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
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
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
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Frecuencia
                  </Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(frequencyLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                    Fecha inicio
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Notas <span className="text-label-secondary/60">(opcional)</span>
                </Label>
                <Input
                  id="notes"
                  placeholder="ej. 12 cuotas sin interés"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="rounded-xl bg-accent/10 p-4 text-sm">
                <p className="text-label-secondary">Valor por cuota:</p>
                <p className="text-lg font-bold text-accent mt-0.5 tabular-nums">
                  {totalAmount && parseInt(installmentCount) > 0
                    ? `$${(parseFloat(totalAmount) / parseInt(installmentCount)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '$0.00'}
                </p>
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
                  Crear
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Pendiente</p>
          <p className="text-xl font-bold text-accent mt-1 tabular-nums">${totalPending.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Completado</p>
          <p className="text-xl font-bold text-system-green mt-1 tabular-nums">${totalCompleted.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[11px] font-medium text-label-secondary uppercase tracking-wider">Activas</p>
          <p className="text-xl font-bold mt-1 tabular-nums">{installments.filter(i => !i.completed).length}</p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="px-5 py-3.5 border-b border-separator flex items-center justify-between">
          <h2 className="text-xs font-semibold text-label-secondary uppercase tracking-wider">Tus cuotas</h2>
          <span className="text-xs text-label-secondary">{installments.length} registros</span>
        </div>
        {installments.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="w-8 h-8 mx-auto text-label-tertiary mb-3" />
            <p className="text-sm text-label-secondary">No tenés compras en cuotas registradas</p>
            <p className="text-xs text-label-secondary/60 mt-1">Agregá una para empezar a gestionarlas</p>
          </div>
        ) : (
          <div className="divide-y divide-separator">
            {installments.map((inst, idx) => {
              const installmentAmount = inst.totalAmount / inst.installmentCount
              const progress = inst.totalAmount > 0 ? (inst.totalPaid / inst.totalAmount) * 100 : 0
              return (
                <motion.div
                  key={inst.uuid}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.03 }}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-fill transition-colors ${inst.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${inst.completed ? 'bg-system-green/10 text-system-green' : 'bg-accent/10 text-accent'}`}>
                      {inst.completed ? <CheckCircle className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${inst.completed ? 'line-through' : ''}`}>
                        {inst.description}
                      </p>
                      <p className="text-[11px] text-label-secondary">
                        {categoryLabels[inst.category] || inst.category} · {inst.currency} ${inst.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        {inst.notes ? ` · ${inst.notes}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right min-w-[100px]">
                      <p className="text-xs font-semibold tabular-nums">
                        {inst.paidInstallments}/{inst.installmentCount} cuotas
                      </p>
                      <p className="text-[10px] text-label-secondary tabular-nums">
                        ${installmentAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })} c/u
                      </p>
                    </div>

                    <div className="w-16">
                      <div className="h-1.5 bg-fill rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${inst.completed ? 'bg-system-green' : 'bg-accent'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <p className="text-[10px] text-label-secondary text-right mt-0.5 tabular-nums">{progress.toFixed(0)}%</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!inst.completed && (
                        <button
                          onClick={() => handlePay(inst.uuid)}
                          className="w-7 h-7 rounded-lg hover:bg-accent/10 flex items-center justify-center text-label-secondary hover:text-accent transition-colors"
                          title="Pagar cuota"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inst.uuid)}
                        className="w-7 h-7 rounded-lg hover:bg-fill flex items-center justify-center text-label-secondary hover:text-system-red transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>
    </DashboardShell>
  );
}
