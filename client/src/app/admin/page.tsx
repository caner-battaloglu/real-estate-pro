"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/utils"

// Dummy data
const stats = [
  {
    title: "Total Properties",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Building2,
    color: "text-blue-600"
  },
  {
    title: "Active Agents",
    value: "89",
    change: "+5%",
    changeType: "positive" as const,
    icon: Users,
    color: "text-green-600"
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-8%",
    changeType: "negative" as const,
    icon: Eye,
    color: "text-orange-600"
  },
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-purple-600"
  }
]

const recentProperties = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 450000,
    status: "pending",
    agent: "Sarah Johnson",
    createdAt: "2024-01-15",
    location: "New York, NY"
  },
  {
    id: "2",
    title: "Luxury Family House",
    price: 750000,
    status: "approved",
    agent: "Michael Chen",
    createdAt: "2024-01-14",
    location: "Los Angeles, CA"
  },
  {
    id: "3",
    title: "Contemporary Condo",
    price: 320000,
    status: "rejected",
    agent: "Emily Rodriguez",
    createdAt: "2024-01-13",
    location: "Miami, FL"
  },
  {
    id: "4",
    title: "Charming Townhouse",
    price: 580000,
    status: "pending",
    agent: "David Wilson",
    createdAt: "2024-01-12",
    location: "Boston, MA"
  }
]

const recentAgents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    properties: 12,
    status: "active",
    joinedAt: "2024-01-10"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    properties: 8,
    status: "active",
    joinedAt: "2024-01-08"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    properties: 15,
    status: "inactive",
    joinedAt: "2024-01-05"
  }
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "agents">("overview")

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need admin privileges to access this page.
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
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName}! Here's what's happening with your platform.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
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
                Properties
              </Button>
              <Button
                variant={activeTab === "agents" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("agents")}
              >
                Agents
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
                          Latest property submissions requiring review
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProperties.map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <h4 className="font-medium">{property.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {property.location} • {property.agent}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {formatPrice(property.price)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                property.status === "approved" ? "success" :
                                property.status === "pending" ? "warning" : "destructive"
                              }
                            >
                              {property.status}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Agents */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Agents</CardTitle>
                        <CardDescription>
                          Newly registered agents on the platform
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAgents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <h4 className="font-medium">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                            <p className="text-sm">
                              {agent.properties} properties • Joined {new Date(agent.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={agent.status === "active" ? "success" : "secondary"}>
                              {agent.status}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
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
                      <CardTitle>Property Management</CardTitle>
                      <CardDescription>
                        Manage and approve property listings
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
                    {recentProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{property.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {property.location} • Listed by {property.agent}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {formatPrice(property.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              property.status === "approved" ? "success" :
                              property.status === "pending" ? "warning" : "destructive"
                            }
                          >
                            {property.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agents Tab */}
            {activeTab === "agents" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Agent Management</CardTitle>
                      <CardDescription>
                        Manage agent accounts and permissions
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search agents..."
                          className="h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Agent
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                            <p className="text-sm">
                              {agent.properties} properties • Joined {new Date(agent.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={agent.status === "active" ? "success" : "secondary"}>
                            {agent.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
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