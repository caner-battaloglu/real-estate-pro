import Link from "next/link";
import { get } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import type { Property } from "@/types/property";

type SearchParams = { searchParams?: Record<string, string | string[] | undefined> };

export default async function PropertiesIndex({ searchParams = {} }: SearchParams) {
  const sp = new URLSearchParams();
  const limit = (typeof searchParams.limit === "string" ? searchParams.limit : undefined) ?? "12";
  const page = (typeof searchParams.page === "string" ? searchParams.page : undefined) ?? "1";
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const minPrice = typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  if (limit) sp.set("limit", limit);
  if (page) sp.set("page", page);
  if (city) sp.set("city", city);
  if (q) sp.set("q", q);
  if (minPrice) sp.set("minPrice", minPrice);
  if (maxPrice) sp.set("maxPrice", maxPrice);
  if (sort) sp.set("sort", sort);

  const { data, error } = await get<{ items: Property[]; total: number; page: number; pages: number }>(`/properties?${sp.toString()}`);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 p-8 bg-red-50 text-red-700 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Failed to load properties</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const hasActiveFilters = q || city || minPrice || maxPrice || sort;

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Browse Properties</h1>
        <p className="text-slate-600">
          {data?.total ? `${data.total} properties available` : "Discover your perfect property"}
        </p>
      </div>

      <div className="card p-6 mb-8">
        <form action="/properties" method="get" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Property name or keyword..."
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              name="city"
              defaultValue={city}
              placeholder="City"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
            <input
              name="minPrice"
              defaultValue={minPrice}
              placeholder="$0"
              type="number"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
            <input
              name="maxPrice"
              defaultValue={maxPrice}
              placeholder="Any"
              type="number"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
            <select name="sort" defaultValue={sort} className="select w-full">
              <option value="">Default</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
            <button type="submit" className="btn btn-primary flex-1 sm:flex-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Apply Filters
            </button>
            {hasActiveFilters && (
              <Link href="/properties" className="btn btn-outline">
                Clear All
              </Link>
            )}
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No properties found"
          subtitle="Try adjusting your filters or check back later for new listings."
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {items.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>

          {(data?.pages ?? 1) > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Page {data?.page ?? 1} of {data?.pages ?? 1}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`/properties?${new URLSearchParams({ ...Object.fromEntries(sp), page: String((data?.page ?? 1) - 1) }).toString()}`}
                  className={`btn btn-outline ${((data?.page ?? 1) <= 1) ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </a>
                <a
                  href={`/properties?${new URLSearchParams({ ...Object.fromEntries(sp), page: String((data?.page ?? 1) + 1) }).toString()}`}
                  className={`btn btn-outline ${((data?.page ?? 1) >= (data?.pages ?? 1)) ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Next
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}



