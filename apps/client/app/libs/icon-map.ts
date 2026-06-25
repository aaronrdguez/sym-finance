"use client";

import {
  Wallet, Landmark, CreditCard, PiggyBank, Building, Banknote,
  Coins, HandCoins, DollarSign, Receipt, CircleDollarSign, ShoppingBag,
  LucideIcon,
} from "lucide-react";

export const accountIcons: { name: string; icon: LucideIcon }[] = [
  { name: "Wallet", icon: Wallet },
  { name: "Landmark", icon: Landmark },
  { name: "CreditCard", icon: CreditCard },
  { name: "PiggyBank", icon: PiggyBank },
  { name: "Building", icon: Building },
  { name: "Banknote", icon: Banknote },
  { name: "Coins", icon: Coins },
  { name: "HandCoins", icon: HandCoins },
  { name: "DollarSign", icon: DollarSign },
  { name: "Receipt", icon: Receipt },
  { name: "CircleDollarSign", icon: CircleDollarSign },
  { name: "ShoppingBag", icon: ShoppingBag },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  accountIcons.map(({ name, icon }) => [name, icon])
);

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Wallet;
}
