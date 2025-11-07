"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Plus,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  X
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminApi, handleApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  experience?: number;
  rating?: number;
  propertiesSold?: number;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data removed - now using backend database

export default function AdminAgentsPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processing, setProcessing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    specialties: "",
    experience: "",
  });

  // Check authentication and admin role
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
              <Button asChild className="mt-4">
                <a href="/login">Go to Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
              <Button asChild className="mt-4">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  useEffect(() => {
      loadAgents();
  }, []);

  useEffect(() => {
    filterAgents();
  }, [agents, searchQuery, statusFilter]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAgents();
      console.log('Loaded agents from backend:', data);
      setAgents(data.agents || data);
    } catch (error) {
      console.error("Failed to load agents:", error);
      alert(`Failed to load agents: ${handleApiError(error)}`);
      // Don't fallback to mock data - show empty state instead
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAgents = () => {
    let filtered = agents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(agent =>
        agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(agent => 
        statusFilter === "active" ? agent.isActive : !agent.isActive
      );
    }

    setFilteredAgents(filtered);
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const agentData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
        experience: parseInt(formData.experience) || 0,
      };

      const newAgent = await adminApi.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
      setShowCreateModal(false);
      alert("Agent created successfully!");
    } catch (error) {
      console.error("Failed to create agent:", error);
      alert(`Failed to create agent: ${handleApiError(error)}`);
    } finally {
      setCreating(false);
    }
  };

  const handleEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setCreating(true);
    try {
      const agentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
        experience: parseInt(formData.experience) || 0,
      };

      const updatedAgent = await adminApi.updateAgent(editingAgent.id, agentData);
      setAgents(prev => prev.map(agent => 
        agent.id === editingAgent.id ? updatedAgent : agent
      ));
      
      setShowEditModal(false);
      setEditingAgent(null);
      setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
      alert("Agent updated successfully!");
    } catch (error) {
      console.error("Failed to update agent:", error);
      alert(`Failed to update agent: ${handleApiError(error)}`);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (agentId: string) => {
    setProcessing(agentId);
    try {
      const updatedAgent = await adminApi.toggleAgentStatus(agentId);
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? updatedAgent : agent
      ));
      
      const agent = agents.find(a => a.id === agentId);
      alert(`Agent ${agent?.firstName} ${agent?.lastName} ${agent?.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error("Failed to toggle agent status:", error);
      alert(`Failed to update agent status: ${handleApiError(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      return;
    }

    setProcessing(agentId);
    try {
      await adminApi.deleteAgent(agentId);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      alert("Agent deleted successfully!");
    } catch (error) {
      console.error("Failed to delete agent:", error);
      alert(`Failed to delete agent: ${handleApiError(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      email: agent.email,
      firstName: agent.firstName,
      lastName: agent.lastName,
      phone: agent.phone || "",
      bio: agent.bio || "",
      specialties: agent.specialties?.join(', ') || "",
      experience: agent.experience?.toString() || "",
    });
    setShowEditModal(true);
  };

  const getAgentStats = () => {
    return {
      total: agents.length,
      active: agents.filter(a => a.isActive).length,
      inactive: agents.filter(a => !a.isActive).length,
      totalSales: agents.reduce((sum, agent) => sum + (agent.propertiesSold || 0), 0),
      avgRating: agents.length > 0 ? agents.reduce((sum, agent) => sum + (agent.rating || 0), 0) / agents.length : 0
    };
  };

  const stats = getAgentStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Management</h1>
            <p className="text-muted-foreground">
                Manage real estate agents and their profiles
            </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                    <p className="text-xl font-bold">{stats.inactive}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-xl font-bold">{stats.totalSales}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-xl font-bold">{stats.avgRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search agents by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Agents List */}
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredAgents.length === 0 ? (
          <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No agents found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent, index) => (
                <motion.div
                      key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background ${
                            agent.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            <div className="h-1.5 w-1.5 rounded-full bg-white mx-auto mt-1"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                      <div>
                              <h3 className="font-semibold text-lg truncate">
                          {agent.firstName} {agent.lastName}
                        </h3>
                              <p className="text-sm text-muted-foreground truncate">{agent.email}</p>
                              {agent.phone && (
                                <p className="text-sm text-muted-foreground">{agent.phone}</p>
                              )}
                            </div>
                            <Badge variant={agent.isActive ? "default" : "secondary"}>
                              {agent.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {agent.bio && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {agent.bio}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {agent.experience} years
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {agent.propertiesSold} sales
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {agent.rating?.toFixed(1)}
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(agent)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(agent.id)}
                              disabled={processing === agent.id}
                              className={agent.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                            >
                              {processing === agent.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : agent.isActive ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAgent(agent.id)}
                              disabled={processing === agent.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create Agent Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Create New Agent</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleCreateAgent} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                      </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio (Optional)</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Brief description of the agent..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Specialties (Optional)</label>
                    <input
                      type="text"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Comma-separated specialties (e.g., Luxury Homes, Condos, Investment Properties)"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowCreateModal(false);
                        setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={creating}
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Agent
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Agent Modal */}
        {showEditModal && editingAgent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Edit Agent</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAgent(null);
                      setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleEditAgent} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Specialties</label>
                    <input
                      type="text"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Comma-separated specialties"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingAgent(null);
                        setFormData({ email: "", firstName: "", lastName: "", phone: "", bio: "", specialties: "", experience: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={creating}
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Agent
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
                </div>
              )}
      </div>
        </div>
  );
}