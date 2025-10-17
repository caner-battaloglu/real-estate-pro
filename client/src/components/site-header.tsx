// src/components/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const routes = [
  { href: "/about", label: "About Us" },
  { href: "/properties", label: "Properties" },
  { href: "/agents", label: "Agents" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm rounded-md transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all",
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link href="/" className="font-semibold tracking-tight text-lg sm:text-xl">
          Real Estate Pro
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {routes.map((r) => (
            <NavLink key={r.href} href={r.href} label={r.label} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm"><Link href="/login">Login</Link></Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] sm:w-80">
              <div className="mt-8 flex flex-col gap-1">
                {routes.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="rounded-md px-3 py-3 text-base hover:bg-accent hover:text-accent-foreground"
                  >
                    {r.label}
                  </Link>
                ))}
                <Button asChild className="mt-3"><Link href="/login">Login</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
