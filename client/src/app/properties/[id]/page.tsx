"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft,
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  Car,
  Wifi,
  Shield,
  Home,
  Building2,
  Users,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  X,
  CheckCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { formatPrice, formatArea } from "@/lib/utils"
import { propertiesApi, handleApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/i18n"
import { useCountry } from "@/lib/country-context"
import type { Property } from "@/types"

// Extended property data with more details
const extendedProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views. This luxury apartment features floor-to-ceiling windows, premium finishes, and access to world-class amenities. Perfect for young professionals and urban dwellers seeking convenience and style.",
    price: 545000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1180,
    images: [
      "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1895039/pexels-photo-1895039.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Balcony", "Gym", "Pool", "Concierge", "Rooftop Deck"],
    amenities: ["Parking", "Elevator", "Security", "Fitness Center", "Business Center"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Luxury Family House",
    description: "Spacious family home with large backyard and modern amenities. This stunning property offers the perfect blend of comfort and luxury, featuring an open-concept design, gourmet kitchen, and beautifully landscaped grounds. Ideal for growing families who value space and quality.",
    price: 895000,
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2780,
    images: [
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1645226/pexels-photo-1645226.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Garden", "Garage", "Fireplace", "Swimming Pool", "Patio"],
    amenities: ["Parking", "Security", "Pool", "Garden", "Garage"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Contemporary Condo",
    description: "Stylish condo with modern finishes and city views. This contemporary residence offers sleek design elements, high-end appliances, and breathtaking panoramic views of the city skyline. Perfect for urban professionals seeking luxury and convenience.",
    price: 389000,
    type: "condo",
    bedrooms: 1,
    bathrooms: 1,
    area: 910,
    images: [
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1895039/pexels-photo-1895039.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Balcony", "Modern Kitchen", "City Views", "Hardwood Floors"],
    amenities: ["Parking", "Elevator", "Concierge", "Rooftop Pool"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05"
  },
  {
    id: "4",
    title: "Charming Townhouse",
    description: "Beautiful townhouse with historic charm and modern updates. This meticulously maintained property combines classic architectural details with contemporary amenities, offering the perfect blend of character and comfort.",
    price: 612000,
    type: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 1825,
    images: [
      "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/164516/pexels-photo-164516.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Historic Details", "Garden", "Fireplace", "Original Hardwood"],
    amenities: ["Parking", "Security", "Garden", "Historic District"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  },
  {
    id: "5",
    title: "Luxury Villa",
    description: "Stunning villa with panoramic views and premium amenities. This exceptional property offers unparalleled luxury with its expansive layout, designer finishes, and resort-style amenities. Perfect for those seeking the ultimate in sophisticated living.",
    price: 1325000,
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    images: [
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1645226/pexels-photo-1645226.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Ocean View", "Pool", "Wine Cellar", "Home Theater", "Gourmet Kitchen"],
    amenities: ["Parking", "Security", "Gym", "Spa", "Pool", "Ocean Access"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: "6",
    title: "Commercial Office Space",
    description: "Prime commercial office space in business district. This modern office space offers flexible layouts, state-of-the-art technology infrastructure, and premium amenities. Perfect for businesses looking to establish a professional presence in the heart of the city.",
    price: 1125000,
    type: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 3250,
    images: [
      "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    features: ["Open Floor Plan", "Conference Rooms", "Modern Design", "High Ceilings"],
    amenities: ["Parking", "Elevator", "Security", "Reception", "Business Center"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03"
  }
]

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { country } = useCountry()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTourModal, setShowTourModal] = useState(false)
  const [tourForm, setTourForm] = useState({
    date: '',
    time: '',
    message: '',
    contactMethod: 'phone'
  })
  const [isBookingTour, setIsBookingTour] = useState(false)
  const [tourBooked, setTourBooked] = useState(false)
  
  const { user } = useAuth()
  const isAuthenticated = !!user
  const t = useTranslations()

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true)
      try {
        const data = await propertiesApi.getById(params.id);
        console.log('Loaded property from backend:', data);
        setProperty(data.property || data);
      } catch (error) {
        console.error("Failed to load property:", error);
        alert(`Failed to load property: ${handleApiError(error)}`);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty()
  }, [params.id])

useEffect(() => {
  setCurrentImageIndex(0)
}, [params.id])

  const nextImage = () => {
    if (property) {
      const images = Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : []
      if (images.length === 0) return
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property) {
      const images = Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : []
      if (images.length === 0) return
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      )
    }
  }

  const handleScheduleTour = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login'
      return
    }
    setShowTourModal(true)
  }

  const handleTourBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBookingTour(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsBookingTour(false)
    setTourBooked(true)
    setShowTourModal(false)
    
    // Reset form
    setTourForm({
      date: '',
      time: '',
      message: '',
      contactMethod: 'phone'
    })
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
}

if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("property.back", "Back to Properties")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const propertyImages =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"]

  const safeImageIndex = Math.min(currentImageIndex, propertyImages.length - 1)
  const activeImage = propertyImages[safeImageIndex]

  const agentFirstName = property.agent?.firstName ?? ""
  const agentLastName = property.agent?.lastName ?? ""
  const agentFullName = `${agentFirstName} ${agentLastName}`.trim() || "Real Estate Agent"
  const agentEmail = property.agent?.email ?? ""
  const agentPhone =
    ((property.agent as (Property["agent"] & { phone?: string }) | undefined)?.phone) ?? ""
  const agentAvatar =
    property.agent?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(agentFullName || "Agent")}&background=2563eb&color=fff`

  const propertyId =
    (property as unknown as { id?: string }).id ||
    (property as unknown as { _id?: string })._id ||
    "N/A"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("property.back", "Back to Properties")}
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={activeImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                {propertyImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {safeImageIndex + 1} / {propertyImages.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button variant="secondary" size="icon" className="h-10 w-10 bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-10 w-10 bg-white/90 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {propertyImages.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {propertyImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 ${
                        index === safeImageIndex ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(property.price, country)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {t(`property.type.${property.type.toLowerCase()}`, property.type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">{t("property.bedrooms", "Bedrooms")}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">{t("property.bathrooms", "Bathrooms")}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-semibold">{formatArea(property.area, country)}</div>
                      <div className="text-sm text-muted-foreground">{t("property.area", "Area")}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-semibold">2024</div>
                      <div className="text-sm text-muted-foreground">{t("property.built", "Built")}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("property.description", "Description")}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("property.features", "Features")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(property.features || []).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("property.amenities", "Amenities")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(property.amenities || []).map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("property.contactAgent", "Contact Agent")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={agentAvatar}
                        alt={agentFullName}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {agentFullName}
                      </div>
                      <div className="text-sm text-muted-foreground">Real Estate Agent</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {agentPhone || agentEmail ? (
                      <Button className="w-full" asChild>
                        <Link href={agentPhone ? `tel:${agentPhone}` : `mailto:${agentEmail}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {t("property.callAgent", "Call Agent")}
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        <Phone className="h-4 w-4 mr-2" />
                        {t("property.callAgent", "Call Agent")}
                      </Button>
                    )}
                    {agentEmail ? (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`mailto:${agentEmail}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          {t("property.emailAgent", "Email Agent")}
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Mail className="h-4 w-4 mr-2" />
                        {t("property.emailAgent", "Email Agent")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("property.info", "Property Information")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("property.id", "Property ID")}</span>
                    <span className="font-medium">#{propertyId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("property.type", "Type")}</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("property.status", "Status")}</span>
                    <Badge variant="secondary" className="capitalize">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("property.listed", "Listed")}</span>
                    <span className="font-medium">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Schedule Tour */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("property.scheduleTour", "Schedule a Tour")}</CardTitle>
                  <CardDescription>
                    {t("property.scheduleTourDescription", "Book a private viewing of this property")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tourBooked ? (
                    <div className="text-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                      <p className="text-sm font-medium text-green-600">
                        {t("property.tourBooked", "Tour Booked!")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "property.tourConfirm",
                          "We'll contact you soon to confirm details."
                        )}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleScheduleTour}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("property.scheduleTour", "Schedule a Tour")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tour Booking Modal */}
      <AnimatePresence>
        {showTourModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTourModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {t("property.scheduleTourTitle", "Schedule Property Tour")}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTourModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {property && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">{property.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="text-lg font-semibold text-primary mt-1">
                      {formatPrice(property.price, country)}
                    </div>
                  </div>
                )}

                <form onSubmit={handleTourBooking} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("property.selectDate", "Select Date")}
                    </label>
                    <input
                      type="date"
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("property.selectTime", "Select Time")}
                    </label>
                    <select
                      value={tourForm.time}
                      onChange={(e) => setTourForm({ ...tourForm, time: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">{t("property.chooseTime", "Choose a time")}</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("property.contactMethod", "Preferred Contact Method")}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={tourForm.contactMethod === 'phone'}
                          onChange={(e) => setTourForm({ ...tourForm, contactMethod: e.target.value })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{t("property.contactMethod.phone", "Phone Call")}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          checked={tourForm.contactMethod === 'email'}
                          onChange={(e) => setTourForm({ ...tourForm, contactMethod: e.target.value })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{t("property.contactMethod.email", "Email")}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("property.additionalMessage", "Additional Message (Optional)")}
                    </label>
                    <textarea
                      value={tourForm.message}
                      onChange={(e) => setTourForm({ ...tourForm, message: e.target.value })}
                      placeholder="Any specific questions or requests for the tour..."
                      className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowTourModal(false)}
                    >
                      {t("property.cancel", "Cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isBookingTour}
                    >
                      {isBookingTour ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("property.booking", "Booking...")}
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          {t("property.book", "Book Tour")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">
                        {t("property.tourConfirmationTitle", "Tour Confirmation")}
                      </p>
                      <p className="text-xs mt-1">
                        {t(
                          "property.tourConfirmationNote",
                          "{name}, we'll contact you at your preferred method to confirm the tour details.",
                          {
                            name:
                              `${(user?.firstName ?? "").trim()} ${(user?.lastName ?? "").trim()}`.trim() ||
                              t("property.tourConfirmationGuest", "Guest"),
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
