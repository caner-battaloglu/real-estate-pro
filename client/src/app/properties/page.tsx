// src/app/properties/page.tsx
import { PropertyCard } from "@/components/property-card";
import { CategoryChips } from "@/components/category-chips";

export default function PublicPropertiesPage() {
  return (
    <div className="container py-8 sm:py-10">
      <h1 className="text-2xl font-semibold mb-2">Properties</h1>
      <p className="text-muted-foreground mb-4">Explore listings by category, price, and location.</p>
      <CategoryChips />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PropertyCard title="Modern Loft" price="$420,000" city="Istanbul" tag="For Sale" />
        <PropertyCard title="Seaside Apartment" price="$1,600 / mo" city="Izmir" tag="For Rent" />
        <PropertyCard title="Family Villa" price="$890,000" city="Ankara" tag="New" />
        <PropertyCard title="Skyline Condo" price="$2,400 / mo" city="Istanbul" />
        <PropertyCard title="Countryside Home" price="$510,000" city="Bursa" />
        <PropertyCard title="Business Suite" price="$3,200 / mo" city="Ankara" />
      </div>
    </div>
  );
}
