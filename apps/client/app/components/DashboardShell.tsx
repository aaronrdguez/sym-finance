"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAuth } from "../dashboard/layout";

interface DashboardShellProps {
  children: ReactNode;
  user?: { username: string } | null;
  onLogout?: () => void;
  contentClassName?: string;
}

export function DashboardShell({ children, user: propUser, onLogout: propLogout, contentClassName }: DashboardShellProps) {
  const ctx = useAuth();
  const user = propUser !== undefined ? propUser : ctx.user;
  const onLogout = propLogout !== undefined ? propLogout : ctx.logout;

  return (
    <div className="min-h-screen bg-page text-label selection:bg-accent/20">
      <Navbar user={user} onLogout={onLogout} />
      <main className="pt-14 min-h-screen">
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6">
          <DashboardSidebar />
          <div className={`flex-1 min-w-0 lg:pl-8 py-6 sm:py-8 ${contentClassName ?? ""}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
