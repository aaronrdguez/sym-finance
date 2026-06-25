"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wallet, Trash2 } from "lucide-react";
import { GlassCard } from "../../components/GlassCard";
import { CreateAccountDialog } from "../../components/CreateAccountDialog";
import { DashboardShell } from "../../components/DashboardShell";
import { resolveIcon } from "../../libs/icon-map";
import { detectBrand } from "../../libs/brand-map";

import api from "../../libs/api";

interface Account {
  uuid: string;
  name: string;
  balance: number;
  type: string;
  icon: string;
  color: string;
  currency: string;
  connectionUuid: string | null;
}

const accountTypeLabels: Record<string, string> = {
  checking: "Cuenta Corriente",
  savings: "Caja de Ahorro",
  digital: "Billetera Virtual",
  cash: "Efectivo",
  investment: "Inversión",
};

const colorMap: Record<string, string> = {
  brand: "text-accent",
  emerald: "text-system-green",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
  pink: "text-pink-500",
  indigo: "text-indigo-500",
  teal: "text-teal-500",
  orange: "text-orange-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 } as any,
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as any,
  },
};

export default function CuentasPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchAccounts = () => {
    api.get("/api/accounts")
      .then((res) => setAccounts(res.data.accounts || []))
      .catch(() => setAccounts([]));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (account: Account) => {
    if (!confirm(`¿Eliminar la cuenta "${account.name}"? También se borrarán todas sus transacciones.`)) return;
    try {
      await api.delete(`/api/accounts/${account.uuid}`)
      fetchAccounts()
    } catch {}
  }

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Cuentas</h1>
          <p className="text-sm text-label-secondary mt-0.5">Tus {accounts.length} cuentas registradas</p>
        </div>
        <CreateAccountDialog onSuccess={fetchAccounts} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {accounts.map((account) => {
          const brand = detectBrand(account.name)
          const Icon = resolveIcon(account.icon);
          const typeLabel = accountTypeLabels[account.type] || account.type;
          const textColor = colorMap[account.color] || "text-label-secondary";
          return (
            <motion.div
              key={account.uuid}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <GlassCard className="p-5 relative group">
                {account.connectionUuid ? (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-medium text-label-secondary bg-fill px-2 py-0.5 rounded-md">Sincronizada</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <CreateAccountDialog account={account} onSuccess={fetchAccounts} />
                    </motion.div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(account)}
                      className="w-7 h-7 rounded-lg hover:bg-system-red/10 flex items-center justify-center text-label-secondary hover:text-system-red transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
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
                        <brand.LucideIcon className="w-5 h-5" />
                      </div>
                    ) : null
                  ) : (
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-fill flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`w-5 h-5 ${textColor}`} />
                    </motion.div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-[11px] text-label-secondary">
                      {brand ? `${brand.title} · ` : ''}{typeLabel}
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  $ {account.balance.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}

        {accounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-fill flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-label-secondary" />
            </div>
            <p className="text-sm font-medium text-label-secondary">Todavía no tenés cuentas</p>
            <p className="text-xs text-label-secondary/60 mt-1">Creá una cuenta para empezar</p>
            <div className="mt-4">
              <CreateAccountDialog onSuccess={fetchAccounts} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
