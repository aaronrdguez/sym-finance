"use client";

import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import api from "../../libs/api";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/signin", { email, password, keepLogin });
      if (!response.data.ok) {
        throw new Error(response.data.error || response.data.message || "Something went wrong");
      }
      await api.get("/api/auth/session");
      router.push("/");
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
    <div className="relative min-h-screen bg-white dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7] font-['SF_Pro_Display','SF_Pro_Text','Inter',system-ui,sans-serif] overflow-x-hidden selection:bg-[#0071E3]/20 flex flex-col">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-[400px]"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.015em] mb-1">
            Sign in.
          </h1>
          <p className="text-[15px] text-[#6E6E73] dark:text-[#86868B] leading-relaxed mb-10">
            Enter your email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-[52px] px-4 bg-[#F5F5F7] dark:bg-[#1D1D1F] border border-transparent rounded-xl text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#6E6E73]/60 focus:outline-none focus:border-[#0071E3] focus:ring-[3px] focus:ring-[#0071E3]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-[52px] px-4 bg-[#F5F5F7] dark:bg-[#1D1D1F] border border-transparent rounded-xl text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#6E6E73]/60 focus:outline-none focus:border-[#0071E3] focus:ring-[3px] focus:ring-[#0071E3]/20 transition-all"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepLogin}
                onChange={(e) => setKeepLogin(e.target.checked)}
                className="w-4 h-4 rounded border-[#D2D2D7] dark:border-[#424245] text-[#0071E3] focus:ring-[#0071E3]/30"
              />
              <span className="text-[13px] text-[#6E6E73] dark:text-[#86868B]">Keep me signed in</span>
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#FF453A] dark:text-[#FF6B5A] text-center"
              >
                {error}
              </motion.p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#006EDB] text-white text-[15px] font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#6E6E73] dark:text-[#86868B]">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#0071E3] hover:underline font-semibold"
              >
                Create one.
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
