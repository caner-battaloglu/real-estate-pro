// src/app/agents/page.tsx
export default function PublicAgentsPage() {
  return (
    <div className="container py-8 sm:py-10">
      <h1 className="text-2xl font-semibold mb-2">Our Agents</h1>
      <p className="text-muted-foreground mb-6">
        Trusted partners ready to help you buy, sell, and manage property.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Jane Doe</div>
          <div className="text-sm text-muted-foreground">Istanbul • Residential</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Ahmet Kaya</div>
          <div className="text-sm text-muted-foreground">Ankara • Commercial</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Elif Yılmaz</div>
          <div className="text-sm text-muted-foreground">Izmir • Rentals</div>
        </div>
      </div>
    </div>
  );
}
