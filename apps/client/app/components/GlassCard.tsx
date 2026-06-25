import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "ios" | "transparent";
}

export function GlassCard({ children, className, variant = "ios" }: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === "ios" && "bg-card rounded-2xl shadow-sm border border-separator",
        variant === "transparent" && "bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}
