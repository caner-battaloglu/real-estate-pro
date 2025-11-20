"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, Mail, MapPin, Phone, Star, TrendingUp } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { agentsApi, handleApiError } from "@/lib/api";

interface AgentProfile {
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
  marketCountry?: "USA" | "UK" | "Turkey";
  createdAt: string;
  updatedAt: string;
}

export default function AgentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const agentId = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : (params.id as string);
  }, [params]);

  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;
    const loadAgent = async () => {
      try {
        setLoading(true);
        const data = await agentsApi.getById(agentId);
        setAgent(data);
        setError(null);
      } catch (err) {
        setError(handleApiError(err));
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };
    loadAgent();
  }, [agentId]);

  const handleBack = () => {
    router.push("/agents");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          Loading agent profile...
        </div>
      );
    }

    if (error || !agent) {
      return (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">
            {error ?? "We couldn’t find that agent profile."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack}>
              Back to Agents
            </Button>
            <Button asChild>
              <Link href="/">Go to Landing</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              <Image
                src={agent.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face"}
                alt={`${agent.firstName} ${agent.lastName}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {agent.firstName} {agent.lastName}
              </h2>
              {agent.marketCountry && (
                <Badge variant="secondary" className="mt-2 uppercase tracking-wide">
                  {agent.marketCountry}
                </Badge>
              )}
            </div>
            {agent.bio && <p className="text-sm text-muted-foreground">{agent.bio}</p>}
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${agent.email}`} className="text-primary hover:underline break-all">
                  {agent.email}
                </a>
              </div>
              {agent.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${agent.phone}`} className="text-primary hover:underline">
                    {agent.phone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  Experience
                </div>
                <p className="text-2xl font-semibold">{agent.experience ?? 0}+ yrs</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Properties Sold
                </div>
                <p className="text-2xl font-semibold">{agent.propertiesSold ?? 0}</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  Rating
                </div>
                <p className="text-2xl font-semibold">
                  {agent.rating ? agent.rating.toFixed(2) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {agent.specialties && agent.specialties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {agent.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Work Region</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {agent.marketCountry ? `Focused on ${agent.marketCountry}` : "Global coverage"}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8 space-y-6">
        <Button variant="ghost" className="inline-flex items-center gap-2" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to agents
        </Button>
        {renderContent()}
      </div>
    </div>
  );
}

