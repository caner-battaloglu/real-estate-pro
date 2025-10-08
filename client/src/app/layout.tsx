import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Real Estate Pro",
  description: "Find, list, and manage properties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container py-8">{children}</main>
        <footer className="border-t py-8 mt-16 text-sm text-gray-500">
          <div className="container">
            © {new Date().getFullYear()} Real Estate Pro
          </div>
        </footer>
      </body>
    </html>
  );
}
