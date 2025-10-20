import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";





export const metadata: Metadata = {
title: {
default: "Real Estate Pro",
template: "%s · Real Estate Pro",
},
description: "Modern real estate platform (Next.js 14 + TS)",
metadataBase: new URL("https://example.com"),
icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" className="dark">
<body className="min-h-dvh bg-background text-foreground antialiased">
<AuthProvider>
<SiteHeader />
<main className="min-h-[calc(100dvh-14rem)]">{children}</main>
<SiteFooter />
<Toaster richColors />
</AuthProvider>
</body>
</html>
);
}