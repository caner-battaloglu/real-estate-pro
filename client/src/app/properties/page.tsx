"use client"

import { useState, useMemo, useEffect } from "react"
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
import { propertiesApi, handleApiError } from "@/lib/api"

interface Property {
  _id: string;
  title: string;
  description: string;
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

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial" },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    location: ""
  })

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await propertiesApi.getAll()
      console.log('Loaded properties from backend:', data)

      const allProperties: Property[] = Array.isArray((data as any)?.items)
        ? (data as { items: Property[] }).items
        : Array.isArray(data)
          ? (data as Property[])
          : []

      const approvedProperties = allProperties.filter((property) => property.status === 'approved')

      setProperties(approvedProperties)
    } catch (error) {
      console.error("Failed to load properties:", error)
      alert(`Failed to load properties: ${handleApiError(error)}`)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !property.title.toLowerCase().includes(query) &&
          !property.description.toLowerCase().includes(query) &&
          !property.address.city.toLowerCase().includes(query) &&
          !property.address.state.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Property type filter
      if (filters.type && !property.type.includes(filters.type)) {
        return false
      }

      // Price range filter
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) {
        return false
      }

      // Bathrooms filter
      if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) {
        return false
      }

      // Area filter
      if (filters.minArea && property.area < parseInt(filters.minArea)) {
        return false
      }
      if (filters.maxArea && property.area > parseInt(filters.maxArea)) {
        return false
      }

      // Location filter
      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (
          !property.address.city.toLowerCase().includes(location) &&
          !property.address.state.toLowerCase().includes(location)
        ) {
          return false
        }
      }

      return true
    })
  }, [properties, searchQuery, filters])

  const clearFilters = () => {
    setFilters({
      type: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
      location: ""
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Properties</h1>
          <p className="text-muted-foreground">
            Discover your perfect home from our curated selection of properties
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <div className="flex items-center gap-2">
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

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Types</option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Area (sq ft)</label>
                    <input
                      type="number"
                      placeholder="Min Area"
                      value={filters.minArea}
                      onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Area (sq ft)</label>
                    <input
                      type="number"
                      placeholder="Max Area"
                      value={filters.maxArea}
                      onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <input
                      type="text"
                      placeholder="City or State"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filteredProperties.length} properties found`}
          </p>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <Badge variant="secondary" className="capitalize">
                        {property.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}