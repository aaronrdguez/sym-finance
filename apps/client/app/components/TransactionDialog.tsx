"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { detectBrand } from "../libs/brand-map";

import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { useRouter } from "next/navigation";

import api from '../libs/api'

interface AccountOption {
  name: string;
  icon: string;
  color: string;
}

const incomeCategories = [
  { value: "salary", label: "Salario" },
  { value: "freelance", label: "Freelance" },
  { value: "investments", label: "Inversiones" },
  { value: "gifts", label: "Regalos" },
  { value: "other_income", label: "Otros" },
];

const expenseCategories = [
  { value: "food", label: "Alimentos" },
  { value: "transport", label: "Transporte" },
  { value: "subscriptions", label: "Suscripciones" },
  { value: "health", label: "Salud" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "shopping", label: "Compras" },
  { value: "bills", label: "Servicios" },
  { value: "education", label: "Educación" },
  { value: "other_expense", label: "Otros" },
];

const currencies = [
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "USD", label: "USD (US$)", symbol: "US$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
];

export interface TransactionFormData {
  type: "income" | "expense";
  accountName: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
}

export interface TransactionData {
  uuid?: string;
  type: "income" | "expense";
  account: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
}

interface TransactionDialogProps {
  accounts: AccountOption[];
  transaction?: TransactionData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransactionDialog({ accounts, transaction, open: controlledOpen, onOpenChange: controlledOnOpenChange, onSuccess }: TransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const [type, setType] = useState<"income" | "expense">("expense");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("ARS");
  const [error, setError] = useState("")
  const [dismissedBrand, setDismissedBrand] = useState<string | null>(null)

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAccountName(transaction.account);
      setAmount(String(Math.abs(transaction.amount)));
      setCategory(transaction.category);
      setDescription(transaction.description || "");
      setDate(transaction.date);
      setCurrency(transaction.currency || "ARS");
    }
  }, [transaction]);

  const categories = type === "income" ? incomeCategories : expenseCategories

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    try {
      if (isEditing && transaction?.uuid) {
        const response = await api.put(`/api/transactions/${transaction.uuid}`, { amount: parsedAmount, category, description, currency, date })
        if (!response.data.ok) return setError(response.data.message)
      } else {
        const response = await api.post('/api/transactions', { accountName, amount: parsedAmount, type, category, currency, description })
        if (!response.data.ok) return setError(response.data.message)
      }

      if (!isEditing) resetForm();
      setOpen(false);
      router.refresh();
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  };

  const resetForm = () => {
    setType("expense");
    setAccountName("");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setCurrency("ARS");
    setDismissedBrand(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 rounded-lg">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button size="sm" className="gap-2 rounded-xl text-xs h-9 bg-brand hover:bg-brand/90">
            <Plus className="w-3.5 h-3.5" />
            Nueva transacción
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{isEditing ? "Editar transacción" : "Nueva transacción"}</DialogTitle>
            <DialogDescription className="text-sm text-ios-subtext">
              {isEditing ? "Actualizá los datos del movimiento." : "Registrá un movimiento en tus cuentas."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
          <div className="flex rounded-xl bg-black/5 dark:bg-white/10 p-1">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory(""); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                type === "expense"
                  ? "bg-white dark:bg-[#1C1C2E] text-[#FF453A] shadow-sm"
                  : "text-ios-subtext hover:text-ios-text",
              )}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              Gasto
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory(""); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                type === "income"
                  ? "bg-white dark:bg-[#1C1C2E] text-[#34C759] shadow-sm"
                  : "text-ios-subtext hover:text-ios-text",
              )}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Ingreso
            </button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Cuenta
            </Label>
            <Select value={accountName} onValueChange={setAccountName} required disabled={isEditing}>
              <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                <SelectValue placeholder="Seleccioná una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
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

          <div className="space-y-2">
            <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Categoría
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                <SelectValue placeholder="Seleccioná una categoría" />
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
            <Label htmlFor="description" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Descripción <span className="text-ios-subtext/60">(opcional)</span>
            </Label>
            <Input
              id="description"
              placeholder="ej. Pago en Uber, Netflix, Spotify..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 100))}
              maxLength={100}
              className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
            />
            {(() => {
              const brand = detectBrand(description);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
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
          {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#FF453A] dark:text-[#FF6B5A] text-center"
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
              className={cn(
                "flex-1 h-11 rounded-xl text-sm",
                type === "expense" ? "bg-[#FF453A] hover:bg-[#FF453A]/90" : "bg-[#34C759] hover:bg-[#34C759]/90",
              )}
            >
              {isEditing ? "Guardar cambios" : type === "expense" ? "Registrar gasto" : "Registrar ingreso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
