import { motion } from "motion/react";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PillButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "glass";
  fullWidth?: boolean;
}

export function PillButton({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: PillButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center text-sm font-semibold transition-colors rounded-full overflow-hidden focus:outline-none";
  
  const variants = {
    primary: "bg-pastel-accent text-white dark:text-gray-900 shadow-[0_2px_12px_rgba(244,184,208,0.4)] dark:shadow-none",
    secondary: "bg-pastel-primary text-white dark:text-gray-900 shadow-[0_2px_12px_rgba(168,216,234,0.4)] dark:shadow-none",
    outline: "border border-ios-subtext/20 text-ios-text hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10",
    glass: "bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-ios-text dark:text-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:bg-white/50 dark:hover:bg-white/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full px-6 py-3.5" : "px-6 py-3",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
