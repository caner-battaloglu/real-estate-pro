"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
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
  address: {
    line1: string;
    city: string;
    country: string;
  };
  status: "draft" | "pending" | "approved" | "rejected";
  agent: {
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingProperty, setRejectingProperty] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      loadProperties();
    }
  }, [user]);

  const loadProperties = async () => {
    try {
      const data = await apiFetch<{ properties: Property[] }>("/api/admin/properties");
      setProperties(data.properties);
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    setProcessing(propertyId);
    try {
      await apiFetch(`/api/admin/properties/${propertyId}/approve`, {
        method: "POST",
      });
      toast.success("Property approved successfully");
      loadProperties();
    } catch (error: any) {
      toast.error("Failed to approve property", {
        description: error.message,
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessing(propertyId);
    try {
      await apiFetch(`/api/admin/properties/${propertyId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason }),
      });
      toast.success("Property rejected");
      setRejectReason("");
      setRejectingProperty(null);
      loadProperties();
    } catch (error: any) {
      toast.error("Failed to reject property", {
        description: error.message,
      });
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

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Property Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve property listings
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Loading properties...</p>
              </CardContent>
            </Card>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">No properties found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{property.title}</CardTitle>
                        <p className="text-muted-foreground">
                          Listed by {property.agent.firstName} {property.agent.lastName} ({property.agent.email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(property.status)}
                        {property.approvedAt && (
                          <p className="text-xs text-muted-foreground">
                            Approved: {new Date(property.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Property Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Price:</span> ${property.price.toLocaleString()}</p>
                          <p><span className="font-medium">Type:</span> {property.type}</p>
                          <p><span className="font-medium">Bedrooms:</span> {property.bedrooms}</p>
                          <p><span className="font-medium">Bathrooms:</span> {property.bathrooms}</p>
                          <p><span className="font-medium">Area:</span> {property.area} sq ft</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Address</h4>
                        <div className="text-sm">
                          <p>{property.address.line1}</p>
                          <p>{property.address.city}, {property.address.country}</p>
                        </div>
                      </div>
                    </div>

                    {property.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{property.description}</p>
                      </div>
                    )}

                    {property.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                        <p className="text-sm text-red-700">{property.rejectionReason}</p>
                      </div>
                    )}

                    {property.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => handleApprove(property._id)}
                          disabled={processing === property._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === property._id ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setRejectingProperty(property._id)}
                          disabled={processing === property._id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {rejectingProperty === property._id && (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-medium mb-2">Rejection Reason</h4>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReject(property._id)}
                            disabled={processing === property._id}
                            variant="destructive"
                          >
                            {processing === property._id ? "Rejecting..." : "Confirm Rejection"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRejectingProperty(null);
                              setRejectReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
