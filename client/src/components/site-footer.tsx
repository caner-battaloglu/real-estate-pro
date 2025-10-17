// src/components/site-footer.tsx
export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-semibold text-lg">Real Estate Pro</div>
            <p className="text-sm text-muted-foreground mt-2">
              A modern marketplace for agents and admins to collaborate on listings.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Company</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Explore</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="/properties" className="hover:underline">Properties</a></li>
              <li><a href="/agents" className="hover:underline">Agents</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Legal</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
              <li><a href="#" className="hover:underline">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Real Estate Pro</div>
      </div>
    </footer>
  );
}
