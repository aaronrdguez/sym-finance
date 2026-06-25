'use client';

import { useEffect, useState } from 'react';
import api from '../libs/api';

import { AuthModal } from './AuthModal'

export interface Params {
    username: string,
    email: string,
    preferences?: Record<string, string | number | null>
    createdAt?: Date,
    updatedAt?: Date,
}

export function AuthOptions() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Params | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verifyLogged = async () => {
      try {
        const response = await api.get('/api/auth/session');
        setData({ username: response.data.username, email: response.data.email, preferences: response.data.preferences });
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    };
    verifyLogged();
  }, []);

  const handleLogin = (userData: { username: string; email: string, preferences: Record<string, string | number | null> }) => {
    setData(userData);
    setIsOpen(false);
  };

  if (loading) return <div id="authOptions"> Loading... </div>;

  if (data == null) return (
    <div id="authOptions">
      <button onClick={() => setIsOpen(true)}>Sign In</button>
      <button onClick={() => setIsOpen(true)}>Sign Up</button>
      {isOpen && <AuthModal isOpen={true} onClose={() => setIsOpen(false)} onLogin={handleLogin} />}
    </div>
  );

  return <div id="authOptions"> <p>{data.username}</p> </div>;
}

export function Navbar() {
  return (
    <nav>
      <AuthOptions/>
    </nav>
  );
}

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  return <><Navbar/>{children}</>;
}
