"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api";

interface User {
    id: string;
    email: string;
    role: "user" | "agent" | "admin";
    firstName?: string;
    lastName?: string;
    mustChangePassword?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await apiFetch<{ user: User }>("/api/auth/profile");
            setUser(response.user);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem("accessToken", response.token);
        setUser(response.user);

        if (response.user.mustChangePassword) {
            router.push("/change-password");
        } else if (response.user.role === "admin") {
            router.push("/admin");
        } else if (response.user.role === "agent") {
            router.push("/agent");
        } else {
            router.push("/properties");
        }
    };

    const logout = async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            router.push("/login");
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password, firstName, lastName }),
        });

        await login(email, password);
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
