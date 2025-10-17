// src/components/search-bar.tsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    window.location.href = "/properties?" + params.toString();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2 sm:grid-cols-2 md:grid-cols-[1fr_160px_160px_120px]"
    >
      <Input placeholder="City, neighborhood, or address" value={q} onChange={(e) => setQ(e.target.value)} />
      <Input placeholder="Min Price" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
      <Input placeholder="Max Price" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
      <Button type="submit" className="w-full sm:w-auto">Search</Button>
    </form>
  );
}
