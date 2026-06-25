"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Check, Plus, Pencil,
} from "lucide-react";

import { accountIcons } from "../libs/icon-map";
import { detectBrand } from "../libs/brand-map";

import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import api from '../libs/api'

const accountTypes = [
  { value: "checking", label: "Cuenta Corriente" },
  { value: "savings", label: "Caja de Ahorro" },
  { value: "digital", label: "Billetera Virtual" },
  { value: "cash", label: "Efectivo" },
  { value: "investment", label: "Inversión" },
];

const presetColors = [
  { name: "brand", class: "bg-brand", ring: "ring-brand" },
  { name: "emerald", class: "bg-emerald-500", ring: "ring-emerald-500" },
  { name: "sky", class: "bg-sky-500", ring: "ring-sky-500" },
  { name: "violet", class: "bg-violet-500", ring: "ring-violet-500" },
  { name: "amber", class: "bg-amber-500", ring: "ring-amber-500" },
  { name: "rose", class: "bg-rose-500", ring: "ring-rose-500" },
  { name: "pink", class: "bg-pink-500", ring: "ring-pink-500" },
  { name: "indigo", class: "bg-indigo-500", ring: "ring-indigo-500" },
  { name: "teal", class: "bg-teal-500", ring: "ring-teal-500" },
  { name: "orange", class: "bg-orange-500", ring: "ring-orange-500" },
];

const currencies = [
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "USD", label: "USD (US$)", symbol: "US$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
];

export interface CreateAccountFormData {
  name: string;
  type: string;
  color: string;
  icon: string;
  balance: number;
  currency: string;
}

interface CreateAccountDialogProps {
  account?: { uuid: string; name: string; type: string; color: string; icon: string; balance: number; currency: string };
  onSubmit?: (data: CreateAccountFormData) => void;
  onSuccess?: () => void;
}

export function CreateAccountDialog({ account, onSubmit, onSuccess }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState(presetColors[0].name);
  const [icon, setIcon] = useState(accountIcons[0].name);
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("ARS");

  const [error, setError] = useState("");
  const isEditing = !!account;

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setColor(account.color);
      setIcon(account.icon);
      setBalance(String(account.balance));
      setCurrency(account.currency);
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedBalance = parseFloat(balance) || 0;
    try {
      if (isEditing && account) {
        const result = await api.put(`/api/accounts/${account.uuid}`, { name, type, color, icon, balance: parsedBalance, currency });

        if (!result.data.ok) return setError(result.data.message)
      } else {
        const result = await api.post('/api/accounts', { name, type, color, icon, balance: parsedBalance, currency }, { method: "POST" });

        if (!result.data.ok) return setError(result.data.message)
      }
    } catch (err) {
      if (err instanceof Error) return setError(err.message)
    }

    onSubmit?.({ name, type, color, icon, balance: parsedBalance, currency });
    onSuccess?.();
    setOpen(false);
    if (!isEditing) {
      setName("");
      setType("");
      setColor(presetColors[0].name);
      setIcon(accountIcons[0].name);
      setBalance("");
      setCurrency("ARS");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "ghost" : "ghost"} size="sm" className={isEditing ? "gap-1.5 text-xs h-8 rounded-lg" : "gap-1.5 text-xs h-8 rounded-lg"}>
          {isEditing ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {isEditing ? "Editar" : "Agregar cuenta"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px]">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{isEditing ? "Editar cuenta" : "Nueva cuenta"}</DialogTitle>
            <DialogDescription className="text-sm text-ios-subtext">
              {isEditing ? "Actualizá los datos de tu cuenta." : "Agregá una cuenta para empezar a registrar tus movimientos."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="ej. Mercado Pago, Santander"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
            />
            {(() => {
              const brand = detectBrand(name);
              if (!brand) return null;
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
                </div>
              );
            })()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Tipo
            </Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                <SelectValue placeholder="Seleccioná un tipo" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Balance inicial
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Divisa
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm">
                <SelectValue placeholder="Seleccioná una divisa" />
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

          <div className="space-y-3">
            <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Color
            </Label>
            <div className="flex gap-2.5 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all duration-200 ring-2 ring-offset-2 ring-offset-[var(--background)]",
                    c.class,
                    color === c.name ? c.ring + " scale-110" : "ring-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  {color === c.name && (
                    <Check className="w-4 h-4 mx-auto text-white drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
              Icono
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {accountIcons.map((ic) => {
                const Icon = ic.icon;
                const isSelected = icon === ic.name;
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIcon(ic.name)}
                    className={cn(
                      "flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-200",
                      isSelected
                        ? "bg-brand/10 ring-2 ring-brand scale-105"
                        : "bg-input-background hover:bg-black/5 dark:hover:bg-white/5 ring-transparent ring-1 ring-black/5 dark:ring-white/10",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSelected ? "text-brand" : "text-ios-subtext",
                      )}
                    />
                  </button>
                );
              })}
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
              className="flex-1 h-11 rounded-xl bg-brand hover:bg-brand/90 text-sm"
            >
              Crear cuenta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
