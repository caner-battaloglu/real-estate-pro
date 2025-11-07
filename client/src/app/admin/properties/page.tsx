"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter, 
  Search, 
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square,
  User,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminApi, handleApiError, getAuthToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

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
  status: "draft" | "pending" | "approved" | "rejected";
  agent: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data removed - now using backend database

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingProperty, setRejectingProperty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showRejectModal, setShowRejectModal] = useState(false);

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
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, statusFilter]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProperties();
      console.log('Loaded properties from backend:', data);
      setProperties(data.properties || data);
    } catch (error) {
      console.error("Failed to load properties:", error);
      alert(`Failed to load properties: ${handleApiError(error)}`);
      // Don't fallback to mock data - show empty state instead
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleApprove = async (propertyId: string) => {
    setProcessing(propertyId);
    try {
      await adminApi.approveProperty(propertyId);
      
      setProperties(prev => prev.map(property => 
        property._id === propertyId 
          ? { 
              ...property, 
              status: "approved" as const,
              approvedBy: { firstName: user?.firstName || "Admin", lastName: user?.lastName || "User" },
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : property
      ));
      
      alert("Property approved successfully!");
    } catch (error) {
      console.error("Failed to approve property:", error);
      alert(`Failed to approve property: ${handleApiError(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setProcessing(propertyId);
    try {
      await adminApi.rejectProperty(propertyId, rejectReason);
      
      setProperties(prev => prev.map(property => 
        property._id === propertyId 
          ? { 
              ...property, 
              status: "rejected" as const,
              rejectionReason: rejectReason,
              updatedAt: new Date().toISOString()
            }
          : property
      ));
      
      setRejectReason("");
      setRejectingProperty(null);
      setShowRejectModal(false);
      alert("Property rejected successfully!");
    } catch (error) {
      console.error("Failed to reject property:", error);
      alert(`Failed to reject property: ${handleApiError(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setProcessing(propertyId);
    try {
      await adminApi.deleteProperty(propertyId);
      
      setProperties(prev => prev.filter(property => property._id !== propertyId));
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert(`Failed to delete property: ${handleApiError(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      pending: "default",
      approved: "default",
      rejected: "destructive",
    } as const;

    const icons = {
      draft: Clock,
      pending: AlertCircle,
      approved: CheckCircle2,
      rejected: XCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      all: properties.length,
      pending: properties.filter(p => p.status === "pending").length,
      approved: properties.filter(p => p.status === "approved").length,
      rejected: properties.filter(p => p.status === "rejected").length,
      draft: properties.filter(p => p.status === "draft").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Property Management</h1>
            <p className="text-muted-foreground">
              Review, approve, and manage property listings
            </p>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('Testing API connection...');
                  console.log('Auth token:', getAuthToken());
                  console.log('API Base URL:', 'http://localhost:3000/api');
                }}
              >
                Test API Connection
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Filter className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{statusCounts.all}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold">{statusCounts.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-xl font-bold">{statusCounts.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-xl font-bold">{statusCounts.rejected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Draft</p>
                    <p className="text-xl font-bold">{statusCounts.draft}</p>
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
                    placeholder="Search properties, agents, or locations..."
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Properties List */}
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Property Image */}
                        <div className="relative h-48 lg:h-32 lg:w-48 rounded-lg overflow-hidden">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{property.title}</h3>
                              <div className="flex items-center text-muted-foreground mt-1">
                                <User className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  Listed by {property.agent.firstName} {property.agent.lastName}
                                </span>
                              </div>
                              <div className="flex items-center text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  Submitted: {new Date(property.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(property.status)}
                              {property.approvedAt && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">
                                    Approved: {new Date(property.approvedAt).toLocaleDateString()}
                                  </p>
                                  {property.approvedBy && (
                                    <p className="text-xs text-muted-foreground">
                                      by {property.approvedBy.firstName} {property.approvedBy.lastName}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Property Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Price:</span>
                                  <span className="font-medium">{formatPrice(property.price)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className="font-medium capitalize">{property.type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Bedrooms:</span>
                                  <span className="font-medium">{property.bedrooms}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Bathrooms:</span>
                                  <span className="font-medium">{property.bathrooms}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Area:</span>
                                  <span className="font-medium">{property.area.toLocaleString()} sq ft</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Address</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{property.address.line1}</span>
                                </div>
                                <p className="text-muted-foreground ml-5">
                                  {property.address.city}, {property.address.state} {property.address.postalCode}
                                </p>
                              </div>
                            </div>
                          </div>

                          {property.description && (
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                            </div>
                          )}

                          {property.rejectionReason && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                              <p className="text-sm text-red-700">{property.rejectionReason}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/properties/${property._id}`} target="_blank">
                                <Eye className="h-4 w-4 mr-1" />
                                View Property
                              </a>
                            </Button>
                            
                            {property.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => handleApprove(property._id)}
                                  disabled={processing === property._id}
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  {processing === property._id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                      Approving...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setRejectingProperty(property._id);
                                    setShowRejectModal(true);
                                  }}
                                  disabled={processing === property._id}
                                  size="sm"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(property._id)}
                              disabled={processing === property._id}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-lg max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Reject Property</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectingProperty(null);
                      setRejectReason("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Please provide a reason for rejecting this property listing.
                </p>
                
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                
                <div className="flex space-x-3 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectingProperty(null);
                      setRejectReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => rejectingProperty && handleReject(rejectingProperty)}
                    disabled={!rejectReason.trim() || processing === rejectingProperty}
                  >
                    {processing === rejectingProperty ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject Property
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}