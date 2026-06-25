"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { SettingsDialog } from "./SettingsDialog";
import api from '../libs/api'

interface NavbarProps {
  user?: { username: string; avatarUrl?: string | null } | null;
  onLogout?: () => void;
}

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function getSystemTheme(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getStoredTheme(): boolean | null {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return null;
}

function storeTheme(isDark: boolean) {
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isLoggedIn = !!user;

  useEffect(() => {
    const init = async () => {
      let dark: boolean;

      if (isLoggedIn) {
        try {
          const res = await api.get("/api/preferences");
          const prefs = res.data.preferences as Record<string, unknown> | null;
          if (prefs?.theme === "dark" || prefs?.theme === "light") {
            dark = prefs.theme === "dark";
          } else {
            dark = getStoredTheme() ?? getSystemTheme();
          }
        } catch {
          dark = getStoredTheme() ?? getSystemTheme();
        }
      } else {
        dark = getStoredTheme() ?? getSystemTheme();
      }

      setIsDark(dark);
      applyTheme(dark);
      storeTheme(dark);
    };

    init();
  }, [isLoggedIn]);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
    storeTheme(newDark);

    if (isLoggedIn) {
      api.post('/api/preferences', { theme: newDark ? 'dark' : 'light' })
        .catch(() => {});
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-page/70 backdrop-blur-[30px] border-b border-separator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-semibold text-sm tracking-tight">SyM Finance</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center text-label-secondary hover:text-label transition-colors rounded-lg hover:bg-fill"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 h-8 pl-2 pr-2.5 rounded-lg hover:bg-fill transition-colors cursor-pointer outline-none">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (user?.username ? user.username[0].toUpperCase() : "U")
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 mt-1">
                <DropdownMenuLabel className="text-xs text-label-secondary font-medium px-2 py-1.5">
                  {user?.username || "Usuario"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg text-sm gap-2.5 py-2 cursor-pointer" onClick={() => setSettingsOpen(true)}>
                  <User className="w-4 h-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg text-sm gap-2.5 py-2 cursor-pointer" onClick={() => setSettingsOpen(true)}>
                  <Settings className="w-4 h-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg text-sm gap-2.5 py-2 cursor-pointer text-system-red focus:text-system-red"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-sm text-label-secondary hover:text-label transition-colors">
                Iniciar sesión
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-semibold text-white bg-accent hover:bg-accent/90 px-4 py-1.5 rounded-full transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} username={user?.username} />
    </nav>
  );
}
