import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RealEstate Pro - Find Your Dream Property",
  description: "Discover your perfect property with our comprehensive real estate platform. Connect with expert agents, explore thousands of listings, and make informed decisions.",
  keywords: ["real estate", "properties", "homes", "apartments", "agents", "buying", "selling"],
  authors: [{ name: "RealEstate Pro Team" }],
  creator: "RealEstate Pro",
  publisher: "RealEstate Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://realestate-pro.com"),
  openGraph: {
    title: "RealEstate Pro - Find Your Dream Property",
    description: "Discover your perfect property with our comprehensive real estate platform.",
    url: "https://realestate-pro.com",
    siteName: "RealEstate Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RealEstate Pro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealEstate Pro - Find Your Dream Property",
    description: "Discover your perfect property with our comprehensive real estate platform.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}