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
  const area = property.areaSqm ? Math.round(property.areaSqm * 10.7639) : undefined;

  return (
    <article className="card overflow-hidden group">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link href={`/properties/${property._id}`} aria-label={property.title}>
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="badge capitalize">
            {property.propertyType ?? "other"}
          </span>
          {property.listed === false && (
            <span className="inline-flex items-center h-7 px-3 text-xs font-semibold rounded-lg bg-red-500 text-white shadow-md">
              Off market
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/properties/${property._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium text-slate-900 shadow-lg hover:bg-slate-50 transition-colors"
          >
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg line-clamp-1 text-slate-900 group-hover:text-brand-600 transition-colors">
            <Link href={`/properties/${property._id}`}>{property.title}</Link>
          </h3>
          <p className="text-sm text-slate-500 line-clamp-1 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address?.line1}, {property.address?.city}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-brand-600 font-bold text-xl">{price}</span>
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            {property.bedrooms ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} bd
              </span>
            ) : null}
            {property.bathrooms ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {property.bathrooms} ba
              </span>
            ) : null}
            {area ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {area} ft²
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
