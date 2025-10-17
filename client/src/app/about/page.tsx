export default function AboutPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold">About Us</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Real Estate Pro is a platform designed for agents and admins to collaborate on property listings with speed and
        trust. Built with a secure, modern backend and a component-first front end for rapid iteration.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Security-first</div>
          <div className="text-sm text-muted-foreground mt-1">JWT + refresh, role gating, and enforced password resets.</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Developer-friendly</div>
          <div className="text-sm text-muted-foreground mt-1">Next.js, Tailwind, shadcn/ui—fast to build, easy to scale.</div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="font-medium">Search-ready</div>
          <div className="text-sm text-muted-foreground mt-1">Address validation and 2dsphere indexes for location search.</div>
        </div>
      </div>
    </div>
  );
}
