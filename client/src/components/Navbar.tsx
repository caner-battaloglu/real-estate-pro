"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Browse" }, // can add later
  { href: "/about", label: "About" },       // can add later
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-xl">
          Real<span className="text-brand-600">Estate</span>Pro
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={active ? "text-brand-700 font-medium" : "text-gray-600 hover:text-gray-900"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
