// src/components/property-card.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  price: string;
  city: string;
  image?: string;
  tag?: string;
};

export function PropertyCard({ title, price, city, image, tag }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3]">
        <Image
          src={image || "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1200&auto=format&fit=crop"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {tag ? (
          <div className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium shadow-sm">
            {tag}
          </div>
        ) : null}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="font-medium line-clamp-1">{title}</div>
          <div className="text-sm font-semibold">{price}</div>
        </div>
        <div className="text-sm text-muted-foreground">{city}</div>
      </CardContent>
    </Card>
  );
}
