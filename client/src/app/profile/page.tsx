"use client";

import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-1">
          <div className="text-xl font-semibold">Profile</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          {user?.mustChangePassword && (
            <div className="mt-4 text-sm text-yellow-600">Password change required before using agent tools.</div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
