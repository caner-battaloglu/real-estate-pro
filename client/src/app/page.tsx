import Link from "next/link";
import { get } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import type { Property } from "@/types/property";

export default async function HomePage() {
  const { data, error } = await get<{ items: Property[]; total: number }>("/properties?limit=12");

  return (
    <>
      <section className="relative -mt-8 mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-brand-50/30 border border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)]" />

        <div className="relative container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              Premium Real Estate Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Find your dream home
              <span className="block text-brand-600 mt-2">with confidence</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8">
              Explore curated listings from trusted agents. Search by location, price range, and property features to find your perfect match.
            </p>

            <form action="/properties" method="get" className="grid gap-3 sm:grid-cols-[2fr,1.5fr,auto] p-2 bg-white rounded-xl shadow-elevated border border-slate-200/80">
              <input
                name="q"
                placeholder="Search properties..."
                className="input border-0 shadow-none focus:ring-0 focus:border-0"
              />
              <input
                name="city"
                placeholder="Location"
                className="input border-0 shadow-none focus:ring-0 focus:border-0"
              />
              <button className="btn btn-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Verified Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Trusted Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Featured Properties</h2>
            <p className="text-slate-600">Hand-picked selections from our premium listings</p>
          </div>
          <Link
            className="hidden sm:flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors group"
            href="/properties"
          >
            View all properties
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 p-8 bg-red-50 text-red-700 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Failed to load properties</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          (() => {
            const items = data?.items ?? [];
            if (items.length === 0) {
              return <EmptyState title="No listings available" subtitle="Check back soon for new properties!" />;
            }
            return (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            );
          })()
        )}
      </section>
    </>
  );
}
