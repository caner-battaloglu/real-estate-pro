"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (user?.role === "admin") {
      loadAgents();
    }
  }, [user]);

  const loadAgents = async () => {
    try {
      // For now, we'll create a mock list since we don't have a GET /api/admin/agents endpoint
      // In a real app, you'd call: const data = await apiFetch<{agents: Agent[]}>("/api/admin/agents");
      setAgents([]);
    } catch (error) {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await apiFetch<{
        message: string;
        agent: Agent;
        tempPassword: string;
      }>("/api/admin/agents", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Agent created successfully", {
        description: `Temporary password: ${response.tempPassword}`,
      });

      setFormData({ email: "", firstName: "", lastName: "" });
      loadAgents();
    } catch (error: any) {
      toast.error("Failed to create agent", {
        description: error.message,
      });
    } finally {
      setCreating(false);
    }
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
            <h1 className="text-3xl font-bold">Agent Management</h1>
            <p className="text-muted-foreground">
              Create and manage real estate agents
            </p>
          </div>

          {/* Create Agent Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? "Creating..." : "Create Agent"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Agents List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading agents...</p>
              ) : agents.length === 0 ? (
                <p className="text-muted-foreground">No agents found. Create your first agent above.</p>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">
                          {agent.firstName} {agent.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {agent.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Status: {agent.isActive ? "Active" : "Inactive"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(agent.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

