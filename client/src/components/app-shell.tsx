"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn provides this when you ran init
import { useAuth } from "@/lib/auth-context";

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r bg-card">
        <div className="p-4">
          <div className="font-semibold text-lg mb-6">Real Estate Pro</div>
          <nav className="space-y-1">
            <NavItem href="/dashboard">Dashboard</NavItem>
            <NavItem href="/properties">Properties</NavItem>
            {user?.role === "admin" && <NavItem href="/agents">Agents</NavItem>}
            <NavItem href="/profile">Profile</NavItem>
          </nav>
        </div>
      </aside>
      <main className="p-4">{children}</main>
    </div>
  );
}
