import "./globals.css";
import "./fonts.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Real Estate Pro",
  description: "Admin + Agent portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-14rem)]">{children}</main>
          <SiteFooter />
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
