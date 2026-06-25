"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Wallet, CandlestickChart, Bitcoin,
  MessageSquare, ArrowLeftRight, Repeat, PiggyBank, CreditCard, Link2,
} from "lucide-react";
import { cn } from "./ui/utils";

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/cuentas", label: "Cuentas", icon: Wallet },
  { href: "/dashboard/movimientos", label: "Movimientos", icon: ArrowLeftRight },
  { href: "/dashboard/reservas", label: "Reservas", icon: PiggyBank },
  { href: "/dashboard/suscripciones", label: "Suscripciones", icon: Repeat },
  { href: "/dashboard/cuotas", label: "Cuotas", icon: CreditCard },
  { href: "/dashboard/mercado", label: "Mercado", icon: CandlestickChart },
  { href: "/dashboard/cripto", label: "Cripto", icon: Bitcoin },
  { href: "/dashboard/conexiones", label: "Conexiones", icon: Link2 },
  { href: "/dashboard/chat", label: "Asistente IA", icon: MessageSquare },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0">
      <nav className="flex flex-col gap-0.5 sticky top-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-label-secondary hover:text-label hover:bg-fill",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
