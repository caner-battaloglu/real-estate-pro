import { get } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import type { Property } from "@/types/property";

type SearchParams = { searchParams?: Record<string, string | string[] | undefined> };

export default async function PropertiesIndex({ searchParams = {} as any }: SearchParams) {
  const sp = new URLSearchParams();
  const limit = (typeof searchParams.limit === "string" ? searchParams.limit : undefined) ?? "12";
  const page = (typeof searchParams.page === "string" ? searchParams.page : undefined) ?? "1";
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const minPrice = typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined; // price_asc, price_desc, newest
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
      <div className="rounded-xl border p-6 bg-red-50 text-red-700">
        Failed to load properties: {error}
      </div>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0) {
    return <EmptyState title="No listings yet" subtitle="Check back soon!" />;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Browse Properties</h1>

      <form action="/properties" method="get" className="mb-6 grid gap-3 sm:grid-cols-6">
        <input name="q" defaultValue={q} placeholder="Search title..." className="input sm:col-span-2" />
        <input name="city" defaultValue={city} placeholder="City" className="input" />
        <input name="minPrice" defaultValue={minPrice} placeholder="Min price" className="input" />
        <input name="maxPrice" defaultValue={maxPrice} placeholder="Max price" className="input" />
        <select name="sort" defaultValue={sort} className="select">
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button className="btn btn-primary">Apply</button>
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <a href={`/properties?${new URLSearchParams({ ...Object.fromEntries(sp), page: String((data?.page ?? 1) - 1) }).toString()}`}
           className={`px-3 py-2 rounded border ${((data?.page ?? 1) <= 1) ? 'pointer-events-none opacity-50' : ''}`}>Previous</a>
        <span className="text-sm text-gray-600">Page {data?.page ?? 1} of {data?.pages ?? 1}</span>
        <a href={`/properties?${new URLSearchParams({ ...Object.fromEntries(sp), page: String((data?.page ?? 1) + 1) }).toString()}`}
           className={`px-3 py-2 rounded border ${((data?.page ?? 1) >= (data?.pages ?? 1)) ? 'pointer-events-none opacity-50' : ''}`}>Next</a>
      </div>
    </section>
  );
}



