"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Star,
  Phone,
  Mail,
  MapPin,
  Award,
  Users,
  TrendingUp,
  MessageCircle,
  Linkedin,
  Twitter,
  Instagram,
  Filter,
  Search
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Agent } from "@/types"

// Dummy data
const agents: Agent[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@realestate.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    bio: "With over 10 years of experience in luxury real estate, Sarah specializes in downtown properties and has helped over 200 families find their dream homes.",
    specialties: ["Luxury Apartments", "Downtown Properties", "Investment Properties"],
    experience: 10,
    rating: 4.9,
    propertiesSold: 247,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      instagram: "https://instagram.com/sarahjohnson"
    }
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@realestate.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    bio: "Michael is a top-performing agent specializing in suburban family homes. His attention to detail and market knowledge make him a trusted advisor.",
    specialties: ["Family Homes", "Suburban Properties", "First-time Buyers"],
    experience: 8,
    rating: 4.8,
    propertiesSold: 189,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen"
    }
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@realestate.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "Emily brings energy and expertise to every transaction. She's known for her excellent communication skills and ability to negotiate the best deals.",
    specialties: ["Condos", "Beach Properties", "Young Professionals"],
    experience: 6,
    rating: 4.7,
    propertiesSold: 156,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      instagram: "https://instagram.com/emilyrodriguez"
    }
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@realestate.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "David has a passion for historic properties and architectural preservation. He helps clients find unique homes with character and charm.",
    specialties: ["Historic Properties", "Townhouses", "Architectural Homes"],
    experience: 12,
    rating: 4.9,
    propertiesSold: 203,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/davidwilson",
      twitter: "https://twitter.com/davidwilson"
    }
  },
  {
    id: "5",
    firstName: "Jessica",
    lastName: "Martinez",
    email: "jessica.martinez@realestate.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    bio: "Jessica specializes in luxury waterfront properties and has an extensive network of high-end clients. She's known for her discretion and professionalism.",
    specialties: ["Luxury Properties", "Waterfront Homes", "High-end Clients"],
    experience: 15,
    rating: 5.0,
    propertiesSold: 312,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/jessicamartinez",
      instagram: "https://instagram.com/jessicamartinez"
    }
  },
  {
    id: "6",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@realestate.com",
    phone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    bio: "Robert is a commercial real estate expert with deep knowledge of business properties and investment opportunities.",
    specialties: ["Commercial Properties", "Investment Properties", "Business Real Estate"],
    experience: 18,
    rating: 4.8,
    propertiesSold: 178,
    isActive: true,
    socialMedia: {
      linkedin: "https://linkedin.com/in/robertbrown",
      twitter: "https://twitter.com/robertbrown"
    }
  }
]

const specialties = [
  "Luxury Properties",
  "Family Homes",
  "Condos",
  "Historic Properties",
  "Commercial Properties",
  "Investment Properties",
  "First-time Buyers",
  "Waterfront Homes"
]

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchQuery === "" || 
      agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesSpecialty = selectedSpecialty === "" || 
      agent.specialties.includes(selectedSpecialty)
    
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Meet Our Expert Agents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team of experienced real estate professionals is here to help you find your perfect property or sell your current home.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search agents by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:w-64">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredAgents.length} of {agents.length} agents
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                      <Image
                        src={agent.avatar}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{agent.firstName} {agent.lastName}</CardTitle>
                  <CardDescription className="text-base">
                    {agent.experience} years experience
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(agent.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium ml-2">
                      {agent.rating} ({agent.propertiesSold} sales)
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground text-center line-clamp-3">
                    {agent.bio}
                  </p>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {agent.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {agent.propertiesSold}
                      </div>
                      <div className="text-xs text-muted-foreground">Properties Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {agent.experience}
                      </div>
                      <div className="text-xs text-muted-foreground">Years Experience</div>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button className="w-full" asChild>
                      <Link href={`/agents/${agent.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Agent
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`tel:${agent.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`mailto:${agent.email}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Social Media */}
                  {agent.socialMedia && (
                    <div className="flex justify-center space-x-2 pt-2">
                      {agent.socialMedia.linkedin && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={agent.socialMedia.linkedin} target="_blank">
                            <Linkedin className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {agent.socialMedia.twitter && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={agent.socialMedia.twitter} target="_blank">
                            <Twitter className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {agent.socialMedia.instagram && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={agent.socialMedia.instagram} target="_blank">
                            <Instagram className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg">No agents found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {agents.length}+
              </div>
              <div className="text-sm text-muted-foreground">Expert Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {agents.reduce((sum, agent) => sum + agent.propertiesSold, 0)}+
              </div>
              <div className="text-sm text-muted-foreground">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(agents.reduce((sum, agent) => sum + agent.experience, 0) / agents.length)}+
              </div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


