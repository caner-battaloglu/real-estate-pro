"use client"

import { useState, useEffect } from "react"
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
import { agentsApi, handleApiError } from "@/lib/api"

interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  experience?: number;
  rating?: number;
  propertiesSold?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const data = await agentsApi.getAll()
      console.log('Loaded agents from backend:', data)

      const allAgents: Agent[] = Array.isArray((data as any)?.items)
        ? (data as { items: Agent[] }).items
        : Array.isArray(data)
          ? (data as Agent[])
          : []

      const activeAgents = allAgents.filter((agent) => agent.isActive)
      
      setAgents(activeAgents)
    } catch (error) {
      console.error("Failed to load agents:", error)
      alert(`Failed to load agents: ${handleApiError(error)}`)
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter((agent) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      agent.firstName.toLowerCase().includes(query) ||
      agent.lastName.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      (agent.specialties && agent.specialties.some(specialty => 
        specialty.toLowerCase().includes(query)
      ))
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Agents</h1>
          <p className="text-muted-foreground">
            Meet our experienced real estate professionals who are ready to help you find your dream property
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={agent.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                          alt={`${agent.firstName} ${agent.lastName}`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background">
                          <div className="h-1.5 w-1.5 rounded-full bg-white mx-auto mt-1"></div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {agent.firstName} {agent.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                            {agent.phone && (
                              <p className="text-sm text-muted-foreground">{agent.phone}</p>
                            )}
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>

                        {agent.bio && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {agent.bio}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {agent.experience || 0} years
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {agent.propertiesSold || 0} sales
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {agent.rating?.toFixed(1) || "N/A"}
                          </div>
                        </div>

                        {agent.specialties && agent.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {agent.specialties.slice(0, 2).map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {agent.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{agent.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/agents/${agent._id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agents found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}