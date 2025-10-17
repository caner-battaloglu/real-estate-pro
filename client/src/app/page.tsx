// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { CategoryChips } from "@/components/category-chips";
import { PropertyCard } from "@/components/property-card";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="bg-[radial-gradient(1000px_500px_at_50%_-140px,theme(colors.accent/0.25),transparent)]">
        <div className="container py-10 sm:py-14 lg:py-20 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <h1 className="text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Find your next property with <span className="text-primary">confidence</span>.
            </h1>
            <p className="text-muted-foreground max-w-prose">
              Search by location, price, or features. List, manage, and close with a secure, role-aware platform.
            </p>
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <SearchBar />
              <div className="mt-3">
                <CategoryChips />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button variant="secondary" asChild className="w-full sm:w-auto">
                <Link href="/login">Agent / Admin Login</Link>
              </Button>
            </div>
          </div>

          {/* Side promo cards */}
          <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Card>
                <CardHeader className="pb-2"><CardTitle>Agent-first</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Admin invites with secure temp access. Agents reset once and go—safe and smooth.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle>Secure Auth</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Short-lived access tokens, httpOnly refresh cookies, and strict role gating.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle>Geo Ready</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Address validation + 2dsphere indexes for precise search out of the box.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container py-8 sm:py-10">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Featured listings</h2>
          <Button variant="ghost" asChild className="w-full sm:w-auto">
            <Link href="/properties">See all</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCard title="Modern Loft" price="$420,000" city="Istanbul" tag="For Sale" />
          <PropertyCard title="Seaside Apartment" price="$1,600 / mo" city="Izmir" tag="For Rent" />
          <PropertyCard title="Family Villa" price="$890,000" city="Ankara" tag="New" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="container py-10 text-center">
          <h3 className="text-2xl font-semibold">Are you an agent or admin?</h3>
          <p className="text-muted-foreground mt-2">Sign in to manage listings, teams, and workflows.</p>
          <Button asChild className="mt-4"><Link href="/login">Go to Portal</Link></Button>
        </div>
      </section>
    </div>
  );
}
