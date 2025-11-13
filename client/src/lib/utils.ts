import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Country } from "./country-context"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, country: Country | null = null): string {
  // If no country is provided, try to get from localStorage
  if (!country) {
    const savedCountry = localStorage.getItem("selectedCountry") as Country | null;
    country = savedCountry || "USA";
  }

  const currency = country === "Turkey" ? "TRY" : "USD";
  const locale = country === "Turkey" ? "tr-TR" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function formatArea(area: number, country: Country | null = null): string {
  // If no country is provided, try to get from localStorage
  if (!country) {
    const savedCountry = localStorage.getItem("selectedCountry") as Country | null;
    country = savedCountry || "USA";
  }

  if (country === "Turkey") {
    // Area is already in m² for Turkey
    return `${area.toLocaleString()} m²`;
  } else {
    // Convert m² to sq ft for USA (1 m² = 10.764 sq ft)
    const sqFt = area * 10.764;
    return `${Math.round(sqFt).toLocaleString()} sq ft`;
  }
}

export function getAreaUnit(country: Country | null = null): string {
  if (!country) {
    const savedCountry = localStorage.getItem("selectedCountry") as Country | null;
    country = savedCountry || "USA";
  }
  return country === "Turkey" ? "m²" : "sq ft";
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}