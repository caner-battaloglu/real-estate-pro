import Image from "next/image";
import { get } from "@/lib/api";
import type { Property } from "@/types/property";

type Params = { params: { id: string } };

export default async function PropertyDetailPage({ params }: Params) {
  const { id } = params;
  const { data, error } = await get<Property>(`/properties/${id}`);

  if (error) {
    return (
      <div className="rounded-xl border p-6 bg-red-50 text-red-700">
        Failed to load property: {error}
      </div>
    );
  }
  const p = data!;

  const images = p.images && p.images.length > 0 ? p.images : ["/placeholder.jpg"];
  const area = p.areaSqm ? Math.round(p.areaSqm * 10.7639) : undefined;

  return (
    <article className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative aspect-[4/3] md:col-span-2 bg-gray-100 rounded-xl overflow-hidden">
          <Image src={images[0]} alt={p.title} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((src, idx) => (
            <div key={idx} className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              <Image src={src} alt={`${p.title} ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <header>
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        <p className="text-gray-600 mt-1">
          {p.address.line1}, {p.address.city}{p.address.state ? `, ${p.address.state}` : ""}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[1fr,360px]">
        <div className="space-y-6">
          {p.description && <p className="leading-7 text-gray-800">{p.description}</p>}
          <div className="rounded-xl border p-4 bg-white grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-500">Bedrooms</div>
              <div className="font-medium">{p.bedrooms ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Bathrooms</div>
              <div className="font-medium">{p.bathrooms ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Area</div>
              <div className="font-medium">{area ? `${area} ft²` : "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Type</div>
              <div className="font-medium">{p.propertyType ?? "other"}</div>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border p-6">
            <div className="text-gray-500 text-sm">Price</div>
            <div className="text-2xl font-semibold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p.price)}
            </div>
          </div>
          {/* Agent card could go here once agent API is wired */}
        </aside>
      </section>
    </article>
  );
}



