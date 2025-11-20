"use client";

import Link from "next/link";
import { House, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-4">Error</p>
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved. You can always return to the
        landing page or head back to your previous screen.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild>
          <Link href="/">
            <House className="mr-2 h-4 w-4" />
            Back to Landing
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/home">
            <Undo2 className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

