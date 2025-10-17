"use client";

import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Total Properties</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">—</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active Agents</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">—</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">—</CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
