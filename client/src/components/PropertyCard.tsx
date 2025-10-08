import type { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price ?? 0);

  const cover = property.images?.[0] ?? "/placeholder.jpg";
  const area = property.areaSqm ? Math.round(property.areaSqm * 10.7639) : undefined; // sqm -> sqft

  return (
    <article className="card overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Link href={`/properties/${property._id}`} aria-label={property.title}>
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
          <span className="rounded bg-white/90 backdrop-blur px-2 py-1 text-xs font-medium shadow">
            {property.propertyType ?? "other"}
          </span>
          {property.listed === false && (
            <span className="rounded bg-red-600 text-white px-2 py-1 text-xs font-medium">Off market</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">
          <Link href={`/properties/${property._id}`}>{property.title}</Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {property.address?.line1}, {property.address?.city}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-brand-700 font-semibold">{price}</span>
          <span className="text-xs text-gray-500">
            {(property.bedrooms ?? 0)} bd • {(property.bathrooms ?? 0)} ba{area ? ` • ${area} ft²` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
