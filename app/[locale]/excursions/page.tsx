// app/excursions/page.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Unchanged
import useSWR from "swr"; // Unchanged

import { ExcursionCard } from "@/components/excursions/excursion-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Palmtree } from "lucide-react";
import type { PackageListItem } from "@/app/api/packages/route";
import type { DestinationListItem } from "@/app/api/destinations/route";
import { HeroSlider } from "@/components/layout/hero-slider";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ExcursionsPage() {
  const [packages, setPackages] = React.useState<PackageListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] =
    React.useState<DestinationListItem | null>(null);

  // --- MODIFICATION: Add state to track initial load ---
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  // --- END MODIFICATION ---

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: destinations, isLoading: destinationsLoading } = useSWR<
    DestinationListItem[]
  >("/api/destinations", fetcher);

  // ... useEffect for fetching packages (this is unchanged) ...
  React.useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch("/api/packages");
        if (!response.ok) {
          throw new Error("Неуспешно зареждане на екскурзиите");
        }
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Възникна грешка");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // --- MODIFICATION: This effect now ONLY runs on load to sync URL -> State ---
  React.useEffect(() => {
    // Wait for destinations to load AND only run if isInitialLoad is true
    if (destinationsLoading || !destinations || !isInitialLoad) return;

    const destAbbr = searchParams.get("destination");

    if (destAbbr) {
      // If URL has a destination, find and set it
      const foundDest = destinations.find(
        (d) => d.abbr.toLowerCase() === destAbbr.toLowerCase()
      );
      if (foundDest) {
        setSelectedDestination(foundDest);
      }
    }
    // After this runs once, set isInitialLoad to false
    setIsInitialLoad(false);
  
  // We only want this to run when these values are ready, plus our flag
  }, [searchParams, destinations, destinationsLoading, isInitialLoad]);
  // --- END MODIFICATION ---

  const filteredPackages = React.useMemo(() => {
    if (!selectedDestination) {
      return packages;
    }
    return packages.filter((pkg) =>
      pkg.countries.includes(selectedDestination.name)
    );
  }, [packages, selectedDestination]);

  // --- MODIFICATION: This handler is now the single source of truth ---
  const handleDestinationSelect = (destination: DestinationListItem | null) => {
    // 1. Update the state
    setSelectedDestination(destination);

    // 2. If the user interacts, we are definitely past the initial load
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }

    // 3. Update the URL
    const currentParams = new URLSearchParams(window.location.search);
    if (destination) {
      currentParams.set("destination", destination.abbr);
    } else {
      currentParams.delete("destination");
    }
    
    const newSearch = currentParams.toString();
    const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    // Use 'replace' for filters—it's better for browser back-button history
    router.replace(newUrl, { scroll: false });
  };
  // --- END MODIFICATION ---

  return (
    <div>
      <HeroSlider
        heightClass="h-112"
        title="Екскурзии и Почивки"
        subtitle="Открийте най-добрите оферти за пътувания и екскурзии"
        icon={Palmtree}
        selectedDestination={selectedDestination}
        onDestinationSelect={handleDestinationSelect} // This uses the updated handler
      />

      <div className="max-w-7xl mx-auto px-4 -mt-20 py-8 relative z-10">
        {/* ... Rest of your page (error, isLoading, grid) remains identical ... */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Грешка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading || destinationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {selectedDestination
                ? `Няма намерени екскурзии за ${selectedDestination.name}.`
                : "Няма налични екскурзии в момента."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <ExcursionCard key={pkg.id} package={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}