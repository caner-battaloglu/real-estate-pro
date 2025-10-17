/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { __setAccessTokenGetter } from "./api";

type Role = "public" | "agent" | "admin";
type User = { id: string; email: string; role: Role; firstName?: string; lastName?: string; mustChangePassword?: boolean };

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (u: User, t: string) => void;
  clearAuth: () => void;
};

const AuthCtx = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  const setAuth = (u: User, t: string) => {
    setUser(u);
    setToken(t);
  };
  const clearAuth = () => {
    setUser(null);
    setToken(null);
  };

  // expose getter to api.ts
  __setAccessTokenGetter(() => token);

  // listen for refresh
  React.useEffect(() => {
    function onRefreshed(e: any) {
      setToken(e.detail);
    }
    window.addEventListener("token:refreshed", onRefreshed);
    return () => window.removeEventListener("token:refreshed", onRefreshed);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, setAuth, clearAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
