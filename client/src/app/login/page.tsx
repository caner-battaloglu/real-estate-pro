/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("agent@example.com");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // set the refresh cookie
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      setAuth(data.user, data.token);

      if (data.user.mustChangePassword) {
        toast("Password change required", { description: "Please reset your password to continue." });
        router.push("/profile"); // or a dedicated reset page if you expose one
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6 bg-card">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        </div>
        <Button className="w-full" type="submit">Sign in</Button>
      </form>
    </div>
  );
}
