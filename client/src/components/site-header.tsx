"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ChevronRight, Home, Building2, Users, Wrench, Phone } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

/* Navigation links */
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/contact", label: "Contact", icon: Phone },
];

/* About section links */
const aboutLinks = [
  { href: "/login", title: "Sign In", subtitle: "Explore" },
  { href: "/apply", title: "Apply", subtitle: "Join Us" },
  { href: "/listings", title: "Listings", subtitle: "Discover" },
];

/* Featured cards: real remote images (Unsplash) */
const featureCards = [
  {
    href: "/properties?featured=top",
    title: "Top Properties",
    subtitle: "Real Estate",
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=480&q=60",
    alt: "Warm interior with decor",
  },
  {
    href: "/properties?featured=latest",
    title: "Latest Listings",
    subtitle: "Featured",
    img: "https://images.unsplash.com/photo-1582582429416-0ef1f5b24b9a?auto=format&fit=crop&w=480&q=60",
    alt: "Modern green armchair",
  },
];

function DesktopMegaLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
        active ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
      )}
    >
      <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
      {label}
      <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const panelEl = panelRef.current;
      const triggerEl = triggerRef.current;
      if (
        !panelEl ||
        !target ||
        panelEl.contains(target) ||
        (triggerEl && triggerEl.contains(target))
      ) {
        return;
      }
      setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-gray-800 bg-[#0d0d0d] text-white transition-all",
        scrolled && "backdrop-blur supports-[backdrop-filter]:bg-black/70"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-3">
        {/* Left: desktop mega trigger + mobile drawer trigger */}
        <div className="flex items-center gap-2">
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={megaOpen}
            aria-controls="mega-menu-panel"
            onClick={() => setMegaOpen((v) => !v)}
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-800 bg-[#131313] hover:bg-[#171717] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-600"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="border-gray-800 bg-[#131313] text-white hover:bg-[#171717]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] border-l-0 bg-[#0d0d0d] text-white sm:w-80">
                <SheetHeader>
                  <VisuallyHidden>
                    <SheetTitle>Main navigation</SheetTitle>
                  </VisuallyHidden>
                </SheetHeader>

                <div className="mt-8 grid gap-2">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-base text-gray-200 hover:bg-[#151515] hover:text-yellow-400"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                  <div className="mt-2 grid gap-2">
                    {aboutLinks.map((i) => (
                      <Link key={i.href} href={i.href} className="rounded-md px-3 py-2 hover:bg-[#151515]">
                        <div className="text-base text-gray-200">{i.title}</div>
                        <div className="text-xs text-gray-400">{i.subtitle}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild variant="secondary" className="bg-[#1c1c1c] text-white hover:bg-[#222]">
                      <Link href="/learn">Learn More</Link>
                    </Button>
                    <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
                      <Link href="/get-started">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-1 text-[17px] font-semibold tracking-tight">
          <Home className="h-5 w-5" />
          Casa
        </Link>

        {/* Right: CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="secondary" className="bg-[#1b1b1b] text-white hover:bg-[#222]">
            <Link href="/learn">Learn More</Link>
          </Button>
          <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Mega Menu */}
      <div
        id="mega-menu-panel"
        ref={panelRef}
        hidden={!megaOpen}
        className="md:block"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container mx-auto rounded-b-md border-x border-b border-gray-800 bg-[#0f0f0f] px-4 py-6">
          {/* Use exactly 3 columns. Add borders on col 2 & 3 instead of separate divider divs. */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Column 1: Navigation */}
            <div>
              <div className="mb-3 text-sm font-semibold text-gray-300">Navigation</div>
              <div className="flex flex-col">
                {navLinks.map(({ href, label, icon }) => (
                  <DesktopMegaLink key={href} href={href} label={label} Icon={icon} />
                ))}
              </div>
            </div>

            {/* Column 2: About Us (with left border) */}
            <div className="md:border-l md:border-gray-800 md:pl-6">
              <div className="mb-3 text-sm font-semibold text-gray-300">About Us</div>
              <div className="grid gap-2">
                {aboutLinks.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className="group rounded-md px-2 py-2 transition-colors hover:bg-[#141414]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-200 group-hover:text-yellow-400">{i.title}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="text-xs text-gray-500">{i.subtitle}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Feature cards (with left border) */}
            <div className="md:border-l md:border-gray-800 md:pl-6">
              <div className="grid gap-3">
                {featureCards.map((c) => (
                  <Link key={c.href} href={c.href} className="group grid grid-cols-[64px_1fr] gap-3 rounded-md p-2 hover:bg-[#141414]">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      <Image
                        src={c.img}
                        alt={c.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-200 group-hover:text-yellow-400">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
