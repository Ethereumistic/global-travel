// app/destinations/page.tsx
"use client";

import * as React from "react";
import { DestinationCard } from "@/components/destinations/destination-card"; // Import the new card
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Globe } from "lucide-react"; // Changed icon
import type { DestinationListItem } from "@/app/api/destinations/route"; // Import the new type

export default function DestinationsPage() {
  const [destinations, setDestinations] = React.useState<DestinationListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDestinations() {
      try {
        // Fetch from the new API route
        const response = await fetch("/api/destinations");
        
        if (!response.ok) {
          throw new Error("Неуспешно зареждане на дестинациите");
        }

        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Възникна грешка");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Updated Title and Subtitle */}
      <div className="mb-8 text-third">
        <div className="flex gap-3">
          <Globe className="size-12 mt-2" />
          <div>
            <h1 className="text-4xl font-bold mb-2 text-secondary">Дестинации</h1>
            <p className="text-secondary">
              Разгледайте държавите и градовете, до които пътуваме
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        // Updated Skeleton for the new card layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Няма налични дестинации в момента.
          </p>
        </div>
      ) : (
        // Render the new DestinationCard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}