"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
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
import { formatPrice } from "@/lib/utils"
import { propertiesApi, handleApiError } from "@/lib/api"

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

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security for all your real estate transactions",
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Connect with verified and experienced real estate professionals",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Get real-time market data and property value estimates",
  },
  {
    icon: Home,
    title: "Virtual Tours",
    description: "Explore properties from anywhere with our 360° virtual tours",
  },
]

const stats = [
  { label: "Properties Listed", value: "10,000+" },
  { label: "Happy Clients", value: "5,000+" },
  { label: "Expert Agents", value: "500+" },
  { label: "Cities Covered", value: "50+" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    try {
      const data = await propertiesApi.getAll()
      console.log('Loaded properties from backend:', data)
      
      // Filter for approved properties and take first 3 as featured
      const approvedProperties = (data.properties || data).filter((property: Property) => 
        property.status === 'approved'
      ).slice(0, 3)
      
      console.log(`Found ${approvedProperties.length} approved properties for featured section`)
      setFeaturedProperties(approvedProperties)
    } catch (error) {
      console.error("Failed to load featured properties:", error)
      // Don't show error to user on home page, just show empty state
      setFeaturedProperties([])
    } finally {
      setLoading(false)
    }
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
                  Find Your Dream Home
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                  Discover Your Perfect
                  <span className="text-primary"> Property</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Connect with top-rated agents, explore thousands of properties, 
                  and make informed decisions with our comprehensive real estate platform.
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by location, property type, or price..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button size="lg" asChild>
                  <Link href="/properties">
                    Search Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat, index) => (
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
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop"
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
            <Badge variant="outline">Featured Properties</Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Discover Amazing Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked properties from our top agents, featuring the best locations and amenities.
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
                        src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop"}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Featured</Badge>
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
                            {property.area} sq ft
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(property.price)}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/properties/${property._id}`}>View Details</Link>
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
                View All Properties
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
            <Badge variant="outline">Why Choose Us</Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Everything You Need for Real Estate
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need to buy, sell, or rent properties with confidence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
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
                  Ready to Find Your Dream Property?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers who found their perfect home with our platform.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild>
                    <Link href="/properties">Browse Properties</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/agents">Find an Agent</Link>
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