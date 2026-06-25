"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Camera, Check, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./ui/tabs";
import api from "../libs/api";
import { useAuth } from "../dashboard/layout";

const presetAvatars = [
  { color: "bg-brand", label: "A" },
  { color: "bg-emerald-500", label: "B" },
  { color: "bg-sky-500", label: "C" },
  { color: "bg-violet-500", label: "D" },
  { color: "bg-amber-500", label: "E" },
  { color: "bg-rose-500", label: "F" },
  { color: "bg-pink-500", label: "G" },
  { color: "bg-indigo-500", label: "H" },
];

const languages = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

const currencies = [
  { value: "ARS", label: "ARS ($)" },
  { value: "USD", label: "USD (US$)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "BRL", label: "BRL (R$)" },
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
}

export function SettingsDialog({ open, onOpenChange, username }: SettingsDialogProps) {
  const { refresh } = useAuth();
  const [tab, setTab] = useState("profile");
  const [displayName, setDisplayName] = useState(username || "");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [language, setLanguage] = useState("es");
  const [defaultCurrency, setDefaultCurrency] = useState("ARS");
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open && username) {
      setDisplayName(username);
      api.get("/api/profile").then(res => {
        if (res.data.ok) {
          setEmail(res.data.email || "");
          if (res.data.avatarUrl) setAvatarPreview(res.data.avatarUrl);
        }
      }).catch(() => {});
    }
  }, [open, username]);

  const handleToggleTheme = (value: boolean) => {
    setDarkMode(value);
    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/api/profile/avatar", formData);
      if (res.data.ok && res.data.avatarUrl) {
        setAvatarPreview(res.data.avatarUrl);
      }
      refresh();
    } catch {}
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.patch("/api/profile", { username: displayName.trim() || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      refresh();
    } catch {}
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-[20px]">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Configuración</DialogTitle>
            <DialogDescription className="text-sm text-ios-subtext">
              Personalizá tu experiencia en SyM Finance.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="p-6 pt-4">
          <TabsList className="w-full bg-black/5 dark:bg-white/10 p-0.5 rounded-xl h-auto mb-5">
            <TabsTrigger value="profile" className="flex-1 h-9 gap-2 text-xs rounded-lg data-[state=active]:shadow-sm">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1 h-9 gap-2 text-xs rounded-lg data-[state=active]:shadow-sm">
              Preferencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-5 mt-0">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden bg-accent">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (displayName || "U")[0].toUpperCase()
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
                Nombre
              </Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="h-11 rounded-xl bg-input-background border-0 px-4 text-sm opacity-60"
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full h-11 rounded-xl text-sm bg-accent hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saving ? "Guardando..." : saved ? "Guardado" : "Guardar cambios"}
            </Button>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-5 mt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Modo oscuro</p>
                <p className="text-xs text-ios-subtext">Cambiar entre tema claro y oscuro</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleToggleTheme} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
                Idioma
              </Label>
              <div className="flex gap-2">
                {languages.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setLanguage(l.value)}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-xs font-medium transition-all",
                      language === l.value
                        ? "bg-accent text-white"
                        : "bg-input-background text-ios-subtext hover:text-ios-text"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-ios-subtext uppercase tracking-wider">
                Moneda predeterminada
              </Label>
              <div className="flex gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setDefaultCurrency(c.value)}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-xs font-medium transition-all",
                      defaultCurrency === c.value
                        ? "bg-accent text-white"
                        : "bg-input-background text-ios-subtext hover:text-ios-text"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificaciones</p>
                <p className="text-xs text-ios-subtext">Recibir alertas de movimientos</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
