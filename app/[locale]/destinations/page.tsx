// app/destinations/page.tsx
"use client";

import * as React from "react";
// --- MODIFICATION: Import router hooks ---
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// --- END MODIFICATION ---

import { DestinationCard } from "@/components/destinations/destination-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Globe } from "lucide-react"; // Palmtree removed
import type { DestinationListItem } from "@/app/api/destinations/route";
import { HeroSlider } from "@/components/layout/hero-slider";

export default function DestinationsPage() {
  const [destinations, setDestinations] = React.useState<DestinationListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // This state is now controlled by the URL
  const [selectedDestination, setSelectedDestination] =
    React.useState<DestinationListItem | null>(null);

  // --- MODIFICATION: Add router hooks ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // --- END MODIFICATION ---

  // This useEffect for fetching destinations is perfect, keep it
  React.useEffect(() => {
    async function fetchDestinations() {
      try {
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

  // --- MODIFICATION: Add useEffect to sync URL -> State ---
  // This runs after the fetch above is complete
  React.useEffect(() => {
    // Wait for destinations to be loaded
    if (isLoading || destinations.length === 0) return;

    const destAbbr = searchParams.get("destination");

    if (destAbbr) {
      // If URL has a destination, find and set it
      if (!selectedDestination || selectedDestination.abbr !== destAbbr) {
        const foundDest = destinations.find(
          (d) => d.abbr.toLowerCase() === destAbbr.toLowerCase()
        );
        setSelectedDestination(foundDest || null);
      }
    } else {
      // If URL has no destination, clear the state
      if (selectedDestination) {
        setSelectedDestination(null);
      }
    }
    // Run when URL params change or when destinations finish loading
  }, [searchParams, destinations, isLoading, selectedDestination]);
  // --- END MODIFICATION ---

  // --- MODIFICATION: Create handler to sync State -> URL ---
  const handleDestinationSelect = (destination: DestinationListItem | null) => {
    setSelectedDestination(destination);

    const currentParams = new URLSearchParams(window.location.search);
    if (destination) {
      currentParams.set("destination", destination.abbr);
    } else {
      currentParams.delete("destination");
    }
    
    const newSearch = currentParams.toString();
    const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ''}`;
    // Update URL without full reload
    router.push(newUrl, { scroll: false });
  };
  // --- END MODIFICATION ---

  // --- MODIFICATION: Create memoized filtered list ---
  const filteredDestinations = React.useMemo(() => {
    if (!selectedDestination) {
      return destinations; // Show all
    }
    // Show only the selected one
    return destinations.filter(
      (dest) => dest.id === selectedDestination.id
    );
  }, [destinations, selectedDestination]);
  // --- END MODIFICATION ---

  return (
    <div className=" mx-auto">
      <HeroSlider
        className="h-112"
        title="Дестинации и Държави"
        subtitle="Открийте най-добрите оферти за пътувания и екскурзии"
        icon={Globe}
        selectedDestination={selectedDestination}
        // --- MODIFICATION: Use the new handler ---
        onDestinationSelect={handleDestinationSelect}
        // --- END MODIFICATION ---
      />

      {/* --- MODIFICATION: Added -mt-12 wrapper for grid --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 py-8 relative z-10">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Грешка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          // Skeleton logic is unchanged
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-lg border bg-card overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="flex items-center gap-3 p-6">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
                <div className="space-y-4 p-6 pt-0">
                  <Skeleton className="h-5 w-1/2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="p-6 pt-2 mt-auto">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        // --- MODIFICATION: Use filteredDestinations and update empty state ---
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedDestination
                ? `Няма намерени резултати за "${selectedDestination.name}".`
                : "Няма налични дестинации в момента."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
        {/* --- END MODIFICATION --- */}
      </div>
    </div>
  );
}