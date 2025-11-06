"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Star,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/utils"

// Dummy data
const agentStats = [
  {
    title: "My Properties",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: Building2,
    color: "text-blue-600"
  },
  {
    title: "Total Views",
    value: "2,847",
    change: "+15%",
    changeType: "positive" as const,
    icon: Eye,
    color: "text-green-600"
  },
  {
    title: "Pending Approval",
    value: "3",
    change: "-1",
    changeType: "negative" as const,
    icon: TrendingUp,
    color: "text-orange-600"
  },
  {
    title: "Commission Earned",
    value: "$24,500",
    change: "+8%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-purple-600"
  }
]

const myProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 450000,
    status: "approved",
    views: 234,
    inquiries: 12,
    createdAt: "2024-01-15",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop"
  },
  {
    id: "2",
    title: "Luxury Family House",
    price: 750000,
    status: "pending",
    views: 189,
    inquiries: 8,
    createdAt: "2024-01-14",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop"
  },
  {
    id: "3",
    title: "Contemporary Condo",
    price: 320000,
    status: "approved",
    views: 156,
    inquiries: 5,
    createdAt: "2024-01-13",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop"
  },
  {
    id: "4",
    title: "Charming Townhouse",
    price: 580000,
    status: "draft",
    views: 0,
    inquiries: 0,
    createdAt: "2024-01-12",
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop"
  }
]

const recentInquiries = [
  {
    id: "1",
    property: "Modern Downtown Apartment",
    client: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    message: "Interested in viewing this property. Available this weekend?",
    createdAt: "2024-01-15",
    status: "new"
  },
  {
    id: "2",
    property: "Luxury Family House",
    client: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    message: "Looking for a family home with good schools nearby.",
    createdAt: "2024-01-14",
    status: "contacted"
  },
  {
    id: "3",
    property: "Contemporary Condo",
    client: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 345-6789",
    message: "Is this property still available? What's the HOA fee?",
    createdAt: "2024-01-13",
    status: "viewing_scheduled"
  }
]

export default function AgentDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "inquiries">("overview")

  if (user?.role !== "agent" && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need agent privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName}! Manage your properties and client inquiries.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Viewing
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {agentStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                        {stat.change}
                      </span>{" "}
                      from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === "properties" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("properties")}
              >
                My Properties
              </Button>
              <Button
                variant={activeTab === "inquiries" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("inquiries")}
              >
                Client Inquiries
              </Button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Properties */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Properties</CardTitle>
                        <CardDescription>
                          Your latest property listings
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myProperties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{property.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {property.location}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{property.views} views</span>
                              <span>{property.inquiries} inquiries</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                property.status === "approved" ? "success" :
                                property.status === "pending" ? "warning" : "secondary"
                              }
                            >
                              {property.status}
                            </Badge>
                            <p className="text-sm font-medium text-primary mt-1">
                              {formatPrice(property.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Inquiries */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Inquiries</CardTitle>
                        <CardDescription>
                          Latest client inquiries and messages
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{inquiry.client}</h4>
                              <p className="text-sm text-muted-foreground">{inquiry.property}</p>
                            </div>
                            <Badge 
                              variant={
                                inquiry.status === "new" ? "default" :
                                inquiry.status === "contacted" ? "secondary" : "success"
                              }
                            >
                              {inquiry.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{inquiry.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{inquiry.email} • {inquiry.phone}</span>
                            <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === "properties" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Properties</CardTitle>
                      <CardDescription>
                        Manage your property listings
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search properties..."
                          className="h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProperties.map((property) => (
                      <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {property.location}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{property.views} views</span>
                            <span>{property.inquiries} inquiries</span>
                            <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            <Badge 
                              variant={
                                property.status === "approved" ? "success" :
                                property.status === "pending" ? "warning" : "secondary"
                              }
                            >
                              {property.status}
                            </Badge>
                          </div>
                          <p className="text-lg font-semibold text-primary">
                            {formatPrice(property.price)}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Client Inquiries</CardTitle>
                      <CardDescription>
                        Manage client inquiries and communications
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search inquiries..."
                          className="h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <h4 className="font-medium">{inquiry.client}</h4>
                            <p className="text-sm text-muted-foreground">{inquiry.property}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{inquiry.email}</span>
                              <span>•</span>
                              <span>{inquiry.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                inquiry.status === "new" ? "default" :
                                inquiry.status === "contacted" ? "secondary" : "success"
                              }
                            >
                              {inquiry.status.replace("_", " ")}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{inquiry.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              Schedule Viewing
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


