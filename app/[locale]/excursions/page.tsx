// app/excursions/page.tsx
"use client";

import * as React from "react";
import { ExcursionCard } from "@/components/excursions/excursion-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Palmtree, X } from "lucide-react";
import type { PackageListItem } from "@/app/api/packages/route";
import type { DestinationListItem } from "@/app/api/destinations/route";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/layout/hero-slider"; // <-- MODIFICATION: Import the new component
import { DestinationSearchbar } from "@/components/hero/destination-searchbar";

// --- REMOVED the ExcursionsPageHeader component, heroImages, and imageBaseUrl ---

export default function ExcursionsPage() {
  // ... all your state (packages, isLoading, etc) remains the same ...
  const [packages, setPackages] = React.useState<PackageListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] =
    React.useState<DestinationListItem | null>(null);

  // ... useEffect and filteredPackages logic remains the same ...
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

  const filteredPackages = React.useMemo(() => {
    if (!selectedDestination) {
      return packages;
    }
    return packages.filter((pkg) =>
      pkg.countries.includes(selectedDestination.name)
    );
  }, [packages, selectedDestination]);

  return (
      <div>

      <HeroSlider
        heightClass="h-112"
        title="Екскурзии и Почивки"
        subtitle="Открийте най-добрите оферти за пътувания и екскурзии"
        icon={Palmtree}
        selectedDestination={selectedDestination}
        onDestinationSelect={setSelectedDestination}
      />

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        
        {/* ... Rest of your page (error, isLoading, grid) remains identical ... */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Грешка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          // ... Skeleton loading state ...
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
          // ... No results state ...
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {selectedDestination
                ? `Няма намерени екскурзии за ${selectedDestination.name}.`
                : "Няма налични екскурзии в момента."}
            </p>
          </div>
        ) : (
          // ... Results grid ...
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