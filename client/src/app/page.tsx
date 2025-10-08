import { get } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import type { Property } from "@/types/property";

export default async function HomePage() {
  const { data, error } = await get<{ items: Property[]; total: number }>("/properties?limit=12");

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-brand-50 to-white">
        <div className="container py-14 md:py-20">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Find your next home</h1>
          <p className="mt-3 max-w-xl text-gray-600">Explore curated listings from trusted agents. Search by city, price, and more.</p>
          <form action="/properties" method="get" className="mt-6 grid gap-3 sm:grid-cols-[2fr,2fr,auto]">
            <input name="q" placeholder="Search title..." className="input" />
            <input name="city" placeholder="City" className="input" />
            <button className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured</h2>
          <a className="text-sm text-brand-700 hover:underline" href="/properties">View all</a>
        </div>

        {error ? (
          <div className="rounded-xl border p-6 bg-red-50 text-red-700">Failed to load properties: {error}</div>
        ) : (
          (() => {
            const items = data?.items ?? [];
            if (items.length === 0) {
              return <EmptyState title="No listings yet" subtitle="Check back soon!" />;
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
