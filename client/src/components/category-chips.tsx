// src/components/category-chips.tsx
"use client";
import { Badge } from "@/components/ui/badge";

const cats = ["All","For Sale","For Rent","New Build","Luxury","Beachfront","City Center","Suburbs"];

export function CategoryChips() {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 md:flex-wrap">
      {cats.map((c) => (
        <Badge
          key={c}
          variant="secondary"
          className="cursor-pointer whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
          onClick={() => (window.location.href = `/properties?category=${encodeURIComponent(c)}`)}
        >
          {c}
        </Badge>
      ))}
    </div>
  );
}
