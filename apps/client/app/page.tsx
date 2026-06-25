"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Eye, Target, PieChart, LayoutDashboard, Wallet, ArrowLeftRight, PiggyBank, TrendingUp, Sparkles } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { useRouter } from "next/navigation";
import api from "./libs/api";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/api/auth/session");
        if (response.data.ok) {
          setUser({ username: response.data.username, email: response.data.email });
        }
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await api.delete("/api/auth/logout", { method: 'DELETE', withCredentials: true });
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <div className="relative min-h-screen font-sans text-ios-text overflow-x-hidden selection:bg-brand/20">
      <Navbar
        user={user}
        onLogout={handleLogout}
      />
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-6 pt-24 pb-16 max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 justify-between flex-1">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start text-left max-w-lg mx-auto lg:mx-0 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-9 h-9 flex items-center justify-center bg-brand/10 rounded-lg">
                <svg className="w-5 h-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-brand tracking-tight">SyM Finance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-[clamp(2.8rem,6vw,4.5rem)] font-bold tracking-[-0.03em] leading-[1.05] mb-6"
            >
              Claridad líquida<br />
              <span className="text-ios-subtext">para tus finanzas</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="text-base sm:text-lg text-ios-subtext leading-relaxed mb-10 max-w-md"
            >
              Una plataforma minimalista para brindarte control total. Tus cuentas, presupuestos e inversiones en un solo lugar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="flex items-center gap-8"
            >
              <button
                onClick={() => !!user ? router.push("/dashboard") : router.push("/auth/signup")}
                className="text-base font-semibold text-brand hover:text-brand/70 transition-colors"
              >
                {!!user ? 'Dashboard' : 'Comenzar'}
                <span className="inline-block ml-1.5">→</span>
              </button>
              <button
                onClick={() => router.push("/auth/signin")}
                className="text-base font-medium text-ios-subtext hover:text-ios-text transition-colors"
              >
                Iniciar sesión
                <span className="inline-block ml-1.5">→</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="relative w-full max-w-xl mx-auto lg:mx-0"
          >
            <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A24] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="h-10 bg-white/95 dark:bg-[#1A1A24] border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="mx-auto bg-black/5 dark:bg-white/10 px-16 py-1 rounded text-[9px] text-ios-subtext font-medium">
                  app.symfinance.com
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] font-medium text-ios-subtext uppercase tracking-wider">Balance total</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ios-text">$ 14,592.50</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">
                    M
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-brand/10 p-3.5">
                    <p className="text-[10px] font-medium text-brand uppercase tracking-wider">Ingresos</p>
                    <p className="text-sm font-semibold text-ios-text mt-0.5">$ 3,240.00</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-black/5 dark:bg-white/5 p-3.5">
                    <p className="text-[10px] font-medium text-ios-subtext uppercase tracking-wider">Gastos</p>
                    <p className="text-sm font-semibold text-ios-text mt-0.5">$ 1,120.50</p>
                  </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                  <p className="text-[11px] font-medium text-ios-subtext uppercase tracking-wider mb-3">Últimos movimientos</p>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-brand">S</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ios-text">Supermercado</p>
                        <p className="text-[11px] text-ios-subtext">Hoy, 14:30</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-ios-text">-$120.50</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-ios-subtext">N</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ios-text">Netflix</p>
                        <p className="text-[11px] text-ios-subtext">Ayer, 10:00</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-ios-text">-$15.99</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-28 px-6 border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#1A1A24]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { icon: Eye, title: "Control total", desc: "Todas tus cuentas, ingresos y gastos centralizados en un único espacio." },
              { icon: Target, title: "Metas claras", desc: "Define objetivos de ahorro y seguí tu progreso día a día sin esfuerzo." },
              { icon: PieChart, title: "Visión completa", desc: "Dashboard en tiempo real con tu panorama financiero detallado." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              >
                <item.icon className="w-6 h-6 text-brand mb-5" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold mb-2 text-ios-text">{item.title}</h3>
                <p className="text-sm text-ios-subtext leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-6"
          >
            Cómo funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-lg text-ios-subtext mb-16 max-w-lg"
          >
            Fluye naturalmente hacia una mejor economía.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { number: "01", title: "Conectá tus cuentas", desc: "Vincula bancos y billeteras de forma segura en minutos." },
              { number: "02", title: "Registrá tus movimientos", desc: "Clasifica gastos e ingresos con etiquetas intuitivas." },
              { number: "03", title: "Visualizá tu dashboard", desc: "Observa tus finanzas cobrar vida con datos en tiempo real." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              >
                <p className="text-[13px] font-bold text-brand mb-4">{item.number}</p>
                <h3 className="text-xl font-semibold mb-2 text-ios-text">{item.title}</h3>
                <p className="text-sm text-ios-subtext leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-[#0E0E1A] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-16"
          >
            Todo lo que necesitás
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {[
              { icon: LayoutDashboard, title: "Dashboard", desc: "Tu centro de comando financiero personalizado." },
              { icon: Wallet, title: "Cuentas", desc: "Agrupá y balanceá todos tus fondos." },
              { icon: ArrowLeftRight, title: "Control de gastos", desc: "Rastreo milimétrico de tu flujo de caja." },
              { icon: PiggyBank, title: "Metas de ahorro", desc: "Creá sobres digitales para tus ahorros." },
              { icon: TrendingUp, title: "Inversiones", desc: "Seguí Bonds, Stocks, Crypto y T-Bills." },
              { icon: Sparkles, title: "Asistente con IA", desc: "Insights proactivos sobre tus hábitos." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                className="p-8 bg-[#12121F] hover:bg-[#16162A] transition-colors"
              >
                <feature.icon className="w-5 h-5 mb-5 text-brand/80" strokeWidth={1.5} />
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-6"
          >
            Empezá hoy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-lg text-ios-subtext mb-10 max-w-md mx-auto"
          >
            Unite a SyM Finance y tomá el control de tus finanzas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <button
              onClick={() => router.push("/auth/signup")}
              className="inline-flex items-center gap-2 text-base font-semibold text-brand hover:text-brand/70 transition-colors"
            >
              Crear cuenta gratis
              <span>→</span>
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-ios-subtext">SyM Finance &copy; 2026. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-sm text-ios-subtext">
            <a href="#" className="hover:text-ios-text transition-colors">Privacidad</a>
            <a href="#" className="hover:text-ios-text transition-colors">Términos</a>
            <a href="#" className="hover:text-ios-text transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
