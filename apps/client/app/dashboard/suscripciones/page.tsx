"use client";

import { motion } from "motion/react";
import { Repeat, Plus, Trash2 } from "lucide-react";
import { detectBrand } from "../../libs/brand-map";
import { GlassCard } from "../../components/GlassCard";
import { DashboardShell } from "../../components/DashboardShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useEffect, useState } from 'react'
import api from '../../libs/api'

interface Subscription {
  uuid: string
  amount: number
  currency: string
  description: string
  reason: string
  frequency: string
  nextPaymentDate: string
  active: boolean
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

function getNextPaymentDate(dateStr: string, frequency: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  switch (frequency) {
    case 'WEEKLY': date.setDate(date.getDate() + 7); break
    case 'BIWEEKLY': date.setDate(date.getDate() + 14); break
    case 'MONTHLY': date.setMonth(date.getMonth() + 1); break
    case 'BIMONTHLY': date.setMonth(date.getMonth() + 2); break
    case 'QUARTERLY': date.setMonth(date.getMonth() + 3); break
    case 'SEMIANNUAL': date.setMonth(date.getMonth() + 6); break
    case 'YEARLY': date.setFullYear(date.getFullYear() + 1); break
  }
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const currencies = [
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "USD", label: "USD (US$)", symbol: "US$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("ARS")
  const [description, setDescription] = useState("")
  const [reason, setReason] = useState("")
  const [frequency, setFrequency] = useState("MONTHLY")
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [error, setError] = useState("")
  const [dismissedBrand, setDismissedBrand] = useState<string | null>(null)

  const loadSubscriptions = async () => {
    try {
      const response = await api.get('/api/subscriptions', { method: 'GET' })
      if (response.data.ok) {
        setSubscriptions(response.data.subscriptions)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    try {
      const response = await api.post('/api/subscriptions', {
        amount: parsedAmount, currency, description, reason, frequency, nextPaymentDate
      })

      if (response.data.ok) {
        setOpen(false)
        setAmount("")
        setCurrency("ARS")
        setDescription("")
        setReason("")
        setFrequency("MONTHLY")
        setNextPaymentDate(new Date().toISOString().split("T")[0])
        setDismissedBrand(null)
        loadSubscriptions()
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }

  const handleDelete = async (uuid: string) => {
    try {
      const response = await api.delete(`/api/subscriptions/${uuid}`)
      if (response.data.ok) {
        loadSubscriptions()
      }
    } catch {
      // ignore
    }
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Suscripciones</h1>
          <p className="text-sm text-label-secondary mt-0.5">Gestioná tus pagos recurrentes</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 rounded-xl text-xs h-9 bg-accent hover:bg-accent/90">
              <Plus className="w-3.5 h-3.5" />
              Nueva suscripción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
            <div className="p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Nueva suscripción</DialogTitle>
                <DialogDescription className="text-sm text-label-secondary">
                  Registrá un pago recurrente.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Razón
                </Label>
                <Input
                  id="reason"
                  placeholder="ej. Netflix, Spotify, Gym"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
                {(() => {
                  const brand = detectBrand(reason);
                  if (!brand || dismissedBrand === brand.title) return null;
                  return (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                      style={{ backgroundColor: `#${brand.hex}12` }}
                    >
                      {brand.svg ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: brand.svg
                              .replace('<svg ', `<svg width="14" height="14" fill="#${brand.hex}" `)
                              .replace('<svg>', `<svg width="14" height="14" fill="#${brand.hex}">`)
                          }}
                        />
                      ) : brand.LucideIcon ? (
                        <brand.LucideIcon className="w-3.5 h-3.5" style={{ color: `#${brand.hex}` }} />
                      ) : null}
                      <span className="font-medium" style={{ color: `#${brand.hex}` }}>{brand.title}</span>
                      <span className="opacity-50 dark:opacity-40">detectado</span>
                      <button
                        type="button"
                        onClick={() => setDismissedBrand(brand.title)}
                        className="ml-1 w-4 h-4 rounded flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 opacity-50 hover:opacity-100 transition-opacity"
                        title="Descartar"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Descripción <span className="text-label-secondary/60">(opcional)</span>
                </Label>
                <Input
                  id="description"
                  placeholder="ej. Plan familiar"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                  maxLength={100}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Monto
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextPaymentDate" className="text-xs font-medium text-label-secondary uppercase tracking-wider">
                  Próximo pago
                </Label>
                <Input
                  id="nextPaymentDate"
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  required
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
                  Crear suscripción
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="px-5 py-3.5 border-b border-separator flex items-center justify-between">
          <h2 className="text-xs font-semibold text-label-secondary uppercase tracking-wider">Tus suscripciones</h2>
          <span className="text-xs text-label-secondary">{subscriptions.length} activas</span>
        </div>
        {subscriptions.length === 0 ? (
          <div className="p-10 text-center">
            <Repeat className="w-8 h-8 mx-auto text-label-tertiary mb-3" />
            <p className="text-sm text-label-secondary">No tenés suscripciones registradas</p>
            <p className="text-xs text-label-secondary/60 mt-1">Agregá una para empezar a gestionarlas</p>
          </div>
        ) : (
          <div className="divide-y divide-separator">
            {subscriptions.map((sub, idx) => (
              <motion.div
                key={sub.uuid}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.03 }}
                className="flex items-center justify-between px-5 py-4 hover:bg-fill transition-colors"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const brand = detectBrand(sub.reason || sub.description);
                    if (brand) {
                      return brand.svg ? (
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `#${brand.hex}15` }}
                          title={brand.title}
                          dangerouslySetInnerHTML={{
                            __html: brand.svg
                              .replace('<svg ', `<svg width="18" height="18" fill="#${brand.hex}" `)
                              .replace('<svg>', `<svg width="18" height="18" fill="#${brand.hex}">`)
                          }}
                        />
                      ) : brand.LucideIcon ? (
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `#${brand.hex}15`, color: `#${brand.hex}` }}
                          title={brand.title}
                        >
                          <brand.LucideIcon className="w-4 h-4" />
                        </div>
                      ) : null;
                    }
                    return (
                      <div className="w-9 h-9 rounded-xl bg-system-red/10 text-system-red flex items-center justify-center shrink-0">
                        <Repeat className="w-4 h-4" />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="text-sm font-medium">{sub.reason}</p>
                    <p className="text-[11px] text-label-secondary">
                      {(() => {
                        const brand = detectBrand(sub.reason || sub.description);
                        return brand ? `${brand.title} · ` : '';
                      })()}
                      {frequencyLabels[sub.frequency] || sub.frequency} · Próximo: {getNextPaymentDate(sub.nextPaymentDate, sub.frequency)}
                      {sub.description ? ` · ${sub.description}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-system-red tabular-nums">
                    ${Number(sub.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    <span className="text-[10px] text-label-secondary ml-0.5">{sub.currency}</span>
                  </span>
                  <button
                    onClick={() => handleDelete(sub.uuid)}
                    className="w-7 h-7 rounded-lg hover:bg-fill flex items-center justify-center text-label-secondary hover:text-system-red transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </DashboardShell>
  );
}
