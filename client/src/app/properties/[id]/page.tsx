import Image from "next/image";
import Link from "next/link";
import { get } from "@/lib/api";
import type { Property } from "@/types/property";

type Params = { params: { id: string } };

export default async function PropertyDetailPage({ params }: Params) {
  const { id } = params;
  const { data, error } = await get<Property>(`/properties/${id}`);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 p-8 bg-red-50 text-red-700 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Failed to load property</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }
  const p = data!;

  const images = p.images && p.images.length > 0 ? p.images : ["/placeholder.jpg"];
  const area = p.areaSqm ? Math.round(p.areaSqm * 10.7639) : undefined;

  return (
    <article>
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all properties
      </Link>

      <div className="grid gap-3 md:grid-cols-4 mb-8">
        <div className="relative aspect-[4/3] md:aspect-[16/10] md:col-span-3 bg-slate-100 rounded-2xl overflow-hidden group">
          <Image
            src={images[0]}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3">
          {images.slice(1, 3).map((src, idx) => (
            <div key={idx} className="relative bg-slate-100 rounded-2xl overflow-hidden group">
              <Image
                src={src}
                alt={`${p.title} ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-8">
          <header>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{p.title}</h1>
                <p className="text-lg text-slate-600 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {p.address.line1}, {p.address.city}
                  {p.address.state ? `, ${p.address.state}` : ""}
                </p>
              </div>
              {p.listed === false && (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                  Off Market
                </span>
              )}
            </div>
          </header>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Property Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-slate-900">{p.bedrooms ?? "-"}</div>
                <div className="text-sm text-slate-600 font-medium">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-slate-900">{p.bathrooms ?? "-"}</div>
                <div className="text-sm text-slate-600 font-medium">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-slate-900">{area ? `${area.toLocaleString()}` : "-"}</div>
                <div className="text-sm text-slate-600 font-medium">Square Feet</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-slate-900 capitalize">{p.propertyType ?? "Other"}</div>
                <div className="text-sm text-slate-600 font-medium">Property Type</div>
              </div>
            </div>
          </div>

          {p.description && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Property</h2>
              <p className="text-slate-700 leading-relaxed">{p.description}</p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4 h-fit">
          <div className="card p-6">
            <div className="text-sm text-slate-600 font-medium mb-2">Price</div>
            <div className="text-4xl font-bold text-slate-900 mb-6">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p.price)}
            </div>
            <button className="btn btn-primary w-full mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Agent
            </button>
            <button className="btn btn-outline w-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Tour
            </button>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Property Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Property ID</span>
                <span className="font-medium text-slate-900">#{p._id.slice(-8)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Type</span>
                <span className="font-medium text-slate-900 capitalize">{p.propertyType ?? "Other"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Status</span>
                <span className="font-medium text-slate-900">{p.listed !== false ? "Active" : "Off Market"}</span>
              </div>
              {p.address.postalCode && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Postal Code</span>
                  <span className="font-medium text-slate-900">{p.address.postalCode}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}



