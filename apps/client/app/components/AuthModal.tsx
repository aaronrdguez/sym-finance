"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { PillButton } from "./PillButton";
import api from "../libs/api";

export type Mode = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: { username: string; email: string, preferences: Record<string, string | number | null> }) => void;
  initialMode?: Mode;
}

export function AuthModal({ isOpen, onClose, onLogin, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setKeepLogin(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const body = mode === "signin"
        ? { email, password, keepLogin }
        : { username, email, password, keepLogin };

      const response = await api.post(endpoint, body);
      
      if (!response.data.ok) {
        throw new Error(response.data.error || response.data.message || "Something went wrong");
      }

      resetForm();
      onLogin({ username: response.data.username, email: response.data.email, preferences: response.data.preferences });

      await api.get("/api/auth/session");

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm"
          >
            <GlassCard className="p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-ios-subtext hover:text-ios-text transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 mt-2">
                <div className="w-12 h-12 bg-brand rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-ios-text tracking-tight">
                  {mode === "signin" ? "Sign in to SyM Finance" : "Create Your SyM Account"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-[14px] text-ios-text placeholder:text-ios-subtext/70 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-[14px] text-ios-text placeholder:text-ios-subtext/70 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-[14px] text-ios-text placeholder:text-ios-subtext/70 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepLogin}
                    onChange={(e) => setKeepLogin(e.target.checked)}
                    className="w-4 h-4 rounded border-black/20 dark:border-white/20 accent-brand"
                  />
                  <span className="text-sm text-ios-subtext">Guardar sesión</span>
                </label>

                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
                )}

                <div className="pt-2">
                  <PillButton
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading
                      ? "Processing..."
                      : mode === "signin"
                        ? "Sign In"
                        : "Create Account"}
                  </PillButton>
                </div>
              </form>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-sm text-brand font-medium hover:text-brand/70 transition-colors"
                >
                  {mode === "signin"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
