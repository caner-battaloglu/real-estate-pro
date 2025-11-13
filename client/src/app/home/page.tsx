"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Home,
  Building2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { formatPrice, formatArea } from "@/lib/utils"
import { propertiesApi } from "@/lib/api"
import { getSearchTokens, propertyMatchesTokens } from "@/lib/search"
import { useCountry } from "@/lib/country-context"
import { useTranslations } from "@/lib/i18n"

interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: string;
  agent: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const FEATURE_ITEMS = [
  {
    icon: Shield,
    titleKey: "home.feature.secure.title",
    defaultTitle: "Secure Transactions",
    descriptionKey: "home.feature.secure.description",
    defaultDescription: "Bank-level security for all your real estate transactions",
  },
  {
    icon: Users,
    titleKey: "home.feature.expert.title",
    defaultTitle: "Expert Agents",
    descriptionKey: "home.feature.expert.description",
    defaultDescription: "Connect with verified and experienced real estate professionals",
  },
  {
    icon: TrendingUp,
    titleKey: "home.feature.market.title",
    defaultTitle: "Market Insights",
    descriptionKey: "home.feature.market.description",
    defaultDescription: "Get real-time market data and property value estimates",
  },
  {
    icon: Home,
    titleKey: "home.feature.virtual.title",
    defaultTitle: "Virtual Tours",
    descriptionKey: "home.feature.virtual.description",
    defaultDescription: "Explore properties from anywhere with our 360° virtual tours",
  },
]

const STATS = [
  { labelKey: "home.stats.listed", defaultLabel: "Properties Listed", value: "10,000+" },
  { labelKey: "home.stats.clients", defaultLabel: "Happy Clients", value: "5,000+" },
  { labelKey: "home.stats.agents", defaultLabel: "Expert Agents", value: "500+" },
  { labelKey: "home.stats.cities", defaultLabel: "Cities Covered", value: "50+" },
]

const extractProperties = (data: unknown): Property[] => {
  if (Array.isArray(data)) {
    return data as Property[]
  }

  if (data && typeof data === "object") {
    const withItems = data as { items?: unknown }
    if (Array.isArray(withItems.items)) {
      return withItems.items as Property[]
    }

    const withProperties = data as { properties?: unknown }
    if (Array.isArray(withProperties.properties)) {
      return withProperties.properties as Property[]
    }
  }

  return []
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { country, loading: countryLoading } = useCountry()
  const t = useTranslations()

  const statsData = useMemo(
    () => STATS.map((stat) => ({
      value: stat.value,
      label: t(stat.labelKey, stat.defaultLabel),
    })),
    [t]
  )

  const featureItems = useMemo(
    () => FEATURE_ITEMS.map((item) => ({
      icon: item.icon,
      title: t(item.titleKey, item.defaultTitle),
      description: t(item.descriptionKey, item.defaultDescription),
    })),
    [t]
  )

  useEffect(() => {
    if (!countryLoading && !country) {
      router.push("/")
      return
    }
    if (country) {
      loadProperties()
    }
  }, [country, countryLoading, router])

  const loadProperties = async () => {
    if (!country) return
    
    try {
      const data = await propertiesApi.getAll()
      console.log('Loaded properties from backend:', data)

      const allProperties = extractProperties(data)

      // Filter by country and status
      const approvedProperties = allProperties.filter(
        (property) => 
          property.status === "approved" && 
          property.address.country === country
      )

      console.log(`Found ${approvedProperties.length} approved properties for ${country}`)
      setProperties(approvedProperties)
      setFeaturedProperties(approvedProperties.slice(0, 3))
    } catch (error) {
      console.error("Failed to load featured properties:", error)
      // Don't show error to user on home page, just show empty state
      setProperties([])
      setFeaturedProperties([])
    } finally {
      setLoading(false)
    }
  }

  const searchTokens = useMemo(() => getSearchTokens(searchQuery), [searchQuery])

  const searchResults = useMemo(() => {
    if (!searchTokens.length) {
      return []
    }

    return properties.filter((property) => {
      return propertyMatchesTokens(property, searchTokens)
    })
  }, [searchTokens, properties])

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      router.push(`/properties?search=${encodeURIComponent(trimmedQuery)}`)
    } else {
      router.push("/properties")
    }
  }

  if (countryLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!country) {
    return null // Will redirect to landing
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {t("home.hero.badge", "Find Your Dream Home")}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                  {t("home.hero.title", "Discover Your Perfect Property")}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  {t(
                    "home.hero.subtitle",
                    "Connect with top-rated agents, explore thousands of properties, and make informed decisions with our comprehensive real estate platform."
                  )}
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t(
                      "home.hero.searchPlaceholder",
                      "Search by location, property type, or price..."
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        handleSearch()
                      }
                    }}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button size="lg" onClick={handleSearch}>
                  {t("home.hero.searchButton", "Search Properties")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {searchQuery.trim() && (
                <div className="rounded-lg border border-input bg-background/80 p-4 shadow-sm backdrop-blur">
                  {searchResults.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {searchResults.map((property) => (
                        <Link
                          key={property._id}
                          href={`/properties/${property._id}`}
                          className="flex items-start justify-between gap-4 rounded-md border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-muted/60"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="capitalize">
                                {t(`property.type.${property.type.toLowerCase()}`, property.type)}
                              </Badge>
                              <span className="font-semibold">{property.title}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {property.address.city}, {property.address.state}
                              </span>
                              <span className="flex items-center">
                                <Bed className="mr-1 h-3 w-3" />
                                {property.bedrooms} beds
                              </span>
                              <span className="flex items-center">
                                <Bath className="mr-1 h-3 w-3" />
                                {property.bathrooms} baths
                              </span>
                              <span className="flex items-center">
                                <Square className="mr-1 h-3 w-3" />
                                {formatArea(property.area, country)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {formatPrice(property.price, country)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "home.hero.noResults",
                        "No properties found matching \"{query}\".",
                        { query: searchQuery.trim() }
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern home exterior"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">
              {t("home.featured.badge", "Featured Properties")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {t("home.featured.heading", "Discover Amazing Properties")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "home.featured.subheading",
                "Handpicked properties from our top agents, featuring the best locations and amenities."
              )}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={property.images[0] || "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">
                          {t("home.featured.label", "Featured")}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">4.8</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.address.city}, {property.address.state}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms}
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms}
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {formatArea(property.area, country)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(property.price, country)}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/properties/${property._id}`}>
                              {t("home.featured.viewDetails", "View Details")}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured properties available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/properties">
                {t("home.featured.viewAll", "View All Properties")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">{t("home.features.badge", "Why Choose Us")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {t("home.features.heading", "Everything You Need for Real Estate")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "home.features.subheading",
                "Our platform provides all the tools and resources you need to buy, sell, or rent properties with confidence."
              )}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureItems.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
            <CardContent className="relative p-12 text-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  {t("home.cta.title", "Ready to Find Your Dream Property?")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t(
                    "home.cta.subtitle",
                    "Join thousands of satisfied customers who found their perfect home with our platform."
                  )}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild>
                    <Link href="/properties">{t("home.cta.browse", "Browse Properties")}</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/agents">{t("home.cta.findAgent", "Find an Agent")}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

