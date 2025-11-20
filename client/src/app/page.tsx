"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCountry, type Country } from "@/lib/country-context";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const { setCountry } = useCountry();

  const handleCountrySelect = (country: Country) => {
    setCountry(country);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
            Welcome to <span className="text-primary">RealEstate Pro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your country to explore properties tailored to your location. 
            Prices and measurements will be displayed according to your selection.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* USA Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="group overflow-hidden transition-all hover:shadow-xl cursor-pointer h-full"
                  onClick={() => handleCountrySelect("USA")}>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                  alt="Times Square in New York City"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-white mb-2">
                    <MapPin className="h-5 w-5" />
                    <h3 className="text-2xl font-bold">United States</h3>
                  </div>
                  <p className="text-white/90 text-sm">
                    Browse properties in USD with square feet measurements
                  </p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Currency:</span>
                      <span className="font-semibold">USD ($)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Area Unit:</span>
                      <span className="font-semibold">Square Feet (sq ft)</span>
                    </div>
                  </div>
                  <Button
                    className="w-full flex items-center justify-center gap-2 whitespace-nowrap"
                    size="lg"
                    onClick={() => handleCountrySelect("USA")}
                  >
                    Select USA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* United Kingdom Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="group overflow-hidden transition-all hover:shadow-xl cursor-pointer h-full"
                  onClick={() => handleCountrySelect("UK")}>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80"
                  alt="Tower Bridge in London"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-white mb-2">
                    <MapPin className="h-5 w-5" />
                    <h3 className="text-2xl font-bold">United Kingdom</h3>
                  </div>
                  <p className="text-white/90 text-sm">
                    Browse properties in GBP with square metres measurements
                  </p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Currency:</span>
                      <span className="font-semibold">GBP (£)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Area Unit:</span>
                      <span className="font-semibold">Square Metres (m²)</span>
                    </div>
                  </div>
                  <Button className="w-full flex items-center justify-center gap-2 whitespace-nowrap" size="lg" onClick={() => handleCountrySelect("UK")}>
                    Select United Kingdom
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Turkey Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="group overflow-hidden transition-all hover:shadow-xl cursor-pointer h-full"
                  onClick={() => handleCountrySelect("Turkey")}>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=1200&q=80"
                  alt="İstanbul Boğazı ve Galata Kulesi"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-white mb-2">
                    <MapPin className="h-5 w-5" />
                    <h3 className="text-2xl font-bold">Türkiye</h3>
                  </div>
                  <p className="text-white/90 text-sm">
                    İlanları TRY üzerinden görüntüleyin ve ölçüleri metrekare olarak görün
                  </p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Para Birimi:</span>
                      <span className="font-semibold">TRY (₺)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Alan Birimi:</span>
                      <span className="font-semibold">Metrekare (m²)</span>
                    </div>
                  </div>
                  <Button
                    className="w-full flex items-center justify-center gap-2 whitespace-nowrap"
                    size="lg"
                    onClick={() => handleCountrySelect("Turkey")}
                  >
                    Türkiye'yi Seç
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
