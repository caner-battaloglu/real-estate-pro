import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EstatePro - Premium Real Estate Platform",
  description: "Find your dream home with confidence. Browse verified listings from trusted agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container py-8 min-h-[calc(100vh-12rem)]">{children}</main>
        <footer className="border-t border-slate-200 bg-slate-50 py-12 mt-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-bold text-lg text-slate-900">
                    Estate<span className="text-brand-600">Pro</span>
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                  Your trusted partner in finding the perfect property. We connect you with verified listings and professional agents.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-slate-600 hover:text-brand-600 transition-colors">Home</Link></li>
                  <li><Link href="/properties" className="text-slate-600 hover:text-brand-600 transition-colors">Browse Properties</Link></li>
                  <li><Link href="/about" className="text-slate-600 hover:text-brand-600 transition-colors">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Contact</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>contact@estatepro.com</li>
                  <li>(555) 123-4567</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
              <p>© {new Date().getFullYear()} EstatePro. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
