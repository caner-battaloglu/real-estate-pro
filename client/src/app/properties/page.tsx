"use client"

import { useState, useMemo } from "react"
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
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Heart,
  Share2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { formatPrice } from "@/lib/utils"
import { Property, SearchFilters } from "@/types"

// Dummy data
const properties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    price: 450000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    location: "Downtown, New York",
    status: "approved",
    agent: {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Balcony", "Gym", "Pool"],
    amenities: ["Parking", "Elevator", "Security"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Luxury Family House",
    description: "Spacious family home with large backyard and modern amenities.",
    price: 750000,
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "USA"
    },
    location: "Suburbs, California",
    status: "approved",
    agent: {
      id: "2",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Garden", "Garage", "Fireplace"],
    amenities: ["Parking", "Security", "Pool"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Contemporary Condo",
    description: "Stylish condo with modern finishes and city views.",
    price: 320000,
    type: "condo",
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "789 Beach Road",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "USA"
    },
    location: "City Center, Miami",
    status: "approved",
    agent: {
      id: "3",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Balcony", "Modern Kitchen"],
    amenities: ["Parking", "Elevator", "Concierge"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05"
  },
  {
    id: "4",
    title: "Charming Townhouse",
    description: "Beautiful townhouse with historic charm and modern updates.",
    price: 580000,
    type: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "321 Historic Lane",
      city: "Boston",
      state: "MA",
      postalCode: "02101",
      country: "USA"
    },
    location: "Historic District, Boston",
    status: "approved",
    agent: {
      id: "4",
      firstName: "David",
      lastName: "Wilson",
      email: "david@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Historic Details", "Garden", "Fireplace"],
    amenities: ["Parking", "Security"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  },
  {
    id: "5",
    title: "Luxury Villa",
    description: "Stunning villa with panoramic views and premium amenities.",
    price: 1200000,
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "555 Villa Drive",
      city: "Malibu",
      state: "CA",
      postalCode: "90265",
      country: "USA"
    },
    location: "Malibu, California",
    status: "approved",
    agent: {
      id: "5",
      firstName: "Jessica",
      lastName: "Martinez",
      email: "jessica@example.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Ocean View", "Pool", "Wine Cellar"],
    amenities: ["Parking", "Security", "Gym", "Spa"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: "6",
    title: "Commercial Office Space",
    description: "Prime commercial office space in business district.",
    price: 850000,
    type: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 3000,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop"
    ],
    address: {
      line1: "999 Business Blvd",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA"
    },
    location: "Business District, Chicago",
    status: "approved",
    agent: {
      id: "6",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert@example.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    features: ["Open Floor Plan", "Conference Rooms"],
    amenities: ["Parking", "Elevator", "Security", "Reception"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03"
  }
]

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial" },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    priceRange: [0, 2000000],
    bedrooms: undefined,
    bathrooms: undefined,
    location: "",
  })

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !property.title.toLowerCase().includes(query) &&
          !property.description.toLowerCase().includes(query) &&
          !property.location.toLowerCase().includes(query) &&
          !property.address.city.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Property type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(property.type)) {
          return false
        }
      }

      // Price range filter
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange
        if (property.price < minPrice || property.price > maxPrice) {
          return false
        }
      }

      // Bedrooms filter
      if (filters.bedrooms !== undefined) {
        if (property.bedrooms < filters.bedrooms) {
          return false
        }
      }

      // Bathrooms filter
      if (filters.bathrooms !== undefined) {
        if (property.bathrooms < filters.bathrooms) {
          return false
        }
      }

      // Location filter
      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (
          !property.location.toLowerCase().includes(location) &&
          !property.address.city.toLowerCase().includes(location)
        ) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, filters])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Find Your Perfect Property
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover {properties.length}+ properties across the country
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by location, property type, or features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:w-auto"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-lg p-6 bg-card"
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Property Type</label>
                      <div className="space-y-2">
                        {propertyTypes.map((type) => (
                          <label key={type.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.type?.includes(type.value) || false}
                              onChange={(e) => {
                                const newTypes = filters.type || []
                                if (e.target.checked) {
                                  setFilters({ ...filters, type: [...newTypes, type.value] })
                                } else {
                                  setFilters({ ...filters, type: newTypes.filter(t => t !== type.value) })
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="50000"
                          value={filters.priceRange?.[1] || 2000000}
                          onChange={(e) => {
                            const maxPrice = parseInt(e.target.value)
                            setFilters({ ...filters, priceRange: [filters.priceRange?.[0] || 0, maxPrice] })
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${((filters.priceRange?.[0] || 0) / 1000).toFixed(0)}k</span>
                          <span>${((filters.priceRange?.[1] || 2000000) / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bedrooms</label>
                      <select
                        value={filters.bedrooms || ""}
                        onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bathrooms</label>
                      <select
                        value={filters.bathrooms || ""}
                        onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProperties.length} of {properties.length} properties
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container py-8">
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="capitalize">
                        {property.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </div>
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
                          {property.area.toLocaleString()} sq ft
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(property.price)}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/properties/${property.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-32 md:w-48 overflow-hidden">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="capitalize">
                              {property.type}
                            </Badge>
                            <h3 className="font-semibold text-lg">{property.title}</h3>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location}
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
                              {property.area.toLocaleString()} sq ft
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Listed by {property.agent.firstName} {property.agent.lastName}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/properties/${property.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg">No properties found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


