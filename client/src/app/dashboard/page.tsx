"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  User,
  Heart,
  Calendar,
  Settings,
  Bell,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Home,
  Building2,
  Users,
  TrendingUp,
  Award,
  MessageCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { formatPrice } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { propertiesApi, toursApi, handleApiError } from "@/lib/api"

// Mock data for user dashboard
const savedProperties: Property[] = [
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
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop"
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
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"
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
  }
]

const tourBookings = [
  {
    id: "1",
    propertyId: "1",
    propertyTitle: "Modern Downtown Apartment",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop",
    agentName: "Sarah Johnson",
    agentEmail: "sarah@example.com",
    date: "2024-01-25",
    time: "14:00",
    status: "confirmed",
    contactMethod: "phone",
    message: "Interested in seeing the balcony and gym facilities."
  },
  {
    id: "2",
    propertyId: "2",
    propertyTitle: "Luxury Family House",
    propertyImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    agentName: "Michael Chen",
    agentEmail: "michael@example.com",
    date: "2024-01-28",
    time: "10:30",
    status: "pending",
    contactMethod: "email",
    message: "Would like to see the backyard and garage."
  }
]

const recentSearches = [
  {
    id: "1",
    query: "apartments downtown",
    location: "New York",
    filters: { bedrooms: 2, priceRange: [300000, 500000] },
    timestamp: "2024-01-20T10:30:00Z"
  },
  {
    id: "2",
    query: "family homes",
    location: "California",
    filters: { bedrooms: 3, bathrooms: 2 },
    timestamp: "2024-01-18T15:45:00Z"
  }
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const isAuthenticated = !!user

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load saved properties (favorites) - using approved properties as mock saved
        const propertiesData = await propertiesApi.getAll();
        const approvedProperties = (propertiesData.properties || propertiesData).filter((property: any) => 
          property.status === 'approved'
        );
        // For demo purposes, show first 3 properties as "saved"
        setSavedProperties(approvedProperties.slice(0, 3));
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Please log in to access your dashboard.</p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "saved", label: "Saved Properties", icon: Heart },
    { id: "tours", label: "Tour Bookings", icon: Calendar },
    { id: "searches", label: "Recent Searches", icon: Search },
    { id: "profile", label: "Profile", icon: User }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
              <p className="text-muted-foreground">Manage your property searches and bookings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="capitalize">
                {user?.role}
              </Badge>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Saved Properties</p>
                        <p className="text-2xl font-bold">{savedProperties.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tours Booked</p>
                        <p className="text-2xl font-bold">{tourBookings.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Search className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
                        <p className="text-2xl font-bold">{recentSearches.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Properties Viewed</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tour Bookings</CardTitle>
                    <CardDescription>Your upcoming property tours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tourBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="relative h-12 w-16 rounded overflow-hidden">
                          <Image
                            src={booking.propertyImage}
                            alt={booking.propertyTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{booking.propertyTitle}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                          <Badge 
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className="text-xs mt-1"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Saved Properties</CardTitle>
                    <CardDescription>Properties you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedProperties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="relative h-12 w-16 rounded overflow-hidden">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{property.title}</h4>
                          <p className="text-xs text-muted-foreground">{property.location}</p>
                          <p className="text-xs font-semibold text-primary">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/properties/${property.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Saved Properties</h2>
                <Button variant="outline" asChild>
                  <Link href="/properties">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse More
                  </Link>
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                        <div className="absolute top-4 right-4">
                          <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
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
            </div>
          )}

          {activeTab === "tours" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tour Bookings</h2>
                <Button variant="outline" asChild>
                  <Link href="/properties">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book New Tour
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {tourBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative h-20 w-24 rounded-lg overflow-hidden">
                            <Image
                              src={booking.propertyImage}
                              alt={booking.propertyTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
                                <p className="text-muted-foreground">Agent: {booking.agentName}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(booking.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {booking.time}
                                  </div>
                                  <div className="flex items-center">
                                    {booking.contactMethod === "phone" ? (
                                      <Phone className="h-4 w-4 mr-1" />
                                    ) : (
                                      <Mail className="h-4 w-4 mr-1" />
                                    )}
                                    {booking.contactMethod}
                                  </div>
                                </div>
                                {booking.message && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    "{booking.message}"
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge 
                                  variant={booking.status === "confirmed" ? "default" : "secondary"}
                                >
                                  {booking.status === "confirmed" ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  {booking.status}
                                </Badge>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/properties/${booking.propertyId}`}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Property
                                    </Link>
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`mailto:${booking.agentEmail}`}>
                                      <MessageCircle className="h-4 w-4 mr-1" />
                                      Contact Agent
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "searches" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent Searches</h2>
                <Button variant="outline" asChild>
                  <Link href="/properties">
                    <Search className="h-4 w-4 mr-2" />
                    New Search
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={search.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                              <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{search.query}</h3>
                              <p className="text-sm text-muted-foreground">
                                {search.location} • {new Date(search.timestamp).toLocaleDateString()}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                {search.filters.bedrooms && (
                                  <Badge variant="outline" className="text-xs">
                                    {search.filters.bedrooms}+ beds
                                  </Badge>
                                )}
                                {search.filters.bathrooms && (
                                  <Badge variant="outline" className="text-xs">
                                    {search.filters.bathrooms}+ baths
                                  </Badge>
                                )}
                                {search.filters.priceRange && (
                                  <Badge variant="outline" className="text-xs">
                                    ${(search.filters.priceRange[0] / 1000).toFixed(0)}k - ${(search.filters.priceRange[1] / 1000).toFixed(0)}k
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/properties">
                              <Search className="h-4 w-4 mr-1" />
                              Search Again
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <Badge variant="secondary" className="capitalize mt-1">
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-medium">January 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Properties saved</span>
                        <span className="font-medium">{savedProperties.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tours booked</span>
                        <span className="font-medium">{tourBookings.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium">Email notifications</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tour reminders</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium">New property alerts</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-medium">Price drop notifications</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
