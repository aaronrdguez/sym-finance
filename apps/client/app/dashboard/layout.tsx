"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import api from "../libs/api";

export interface AuthUser {
  username: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
  refresh: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    api.get("/api/auth/session")
      .then(res => {
        if (res.data.ok) {
          setUser({ username: res.data.username, email: res.data.email, avatarUrl: res.data.avatarUrl });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [key]);

  const logout = useCallback(async () => {
    try { await api.delete("/api/auth/logout"); } catch {}
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    setKey(k => k + 1);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
