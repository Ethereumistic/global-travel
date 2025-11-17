// app/excursions/page.tsx
"use client";

import * as React from "react";
import { ExcursionCard } from "@/components/excursions/excursion-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Palmtree, X } from "lucide-react";
import type { PackageListItem } from "@/app/api/packages/route";
import { DestinationSearch } from "@/components/layout/destination-search";
import type { DestinationListItem } from "@/app/api/destinations/route";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/layout/hero-slider"; // <-- MODIFICATION: Import the new component
import { DestinationSearchbar } from "@/components/hero/destination-searchbar";

// --- REMOVED the ExcursionsPageHeader component, heroImages, and imageBaseUrl ---

export default function ExcursionsPage() {
  const [packages, setPackages] = React.useState<PackageListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] =
    React.useState<DestinationListItem | null>(null);

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
    // We removed the max-w-7xl and mx-auto from here, as the HeroSlider
    // is full-width, and the content sections manage their own max-width.
    <div>
      {/* --- MODIFIED HEADER --- */}
      {/* We now use the reusable HeroSlider component.
        All the content inside is passed as 'children'.
      */}
      <HeroSlider heightClass="h-96">
        <div className="grid grid-cols-2 space-y-4">
          {/* Left Side: Title and Subtitle */}
          <div className="text-white col-span-2 md:col-span-1">
            <div className="flex gap-3">
              <Palmtree className="size-12 mt-2" />
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Екскурзии и Почивки
                </h1>
                <p className="hidden md:flex">Открийте най-добрите оферти за пътувания и екскурзии</p>
              </div>
            </div>
          </div>

          {/* Right Side: Searchbar and Clear Button */}
          <div className="col-span-2 md:col-span-1">
            <div className=" w-full ">
              <DestinationSearchbar onSelect={setSelectedDestination} />
            </div>
            {selectedDestination && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDestination(null)}
                title="Изчисти филтъра"
                className="text-white/70 hover:text-white"
              >
                <X className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </HeroSlider>
      {/* --- END OF MODIFIED HEADER --- */}

      {/* Page Content */}
      {/* We add max-w-7xl and padding here for the content *below* the hero */}
      <div className="max-w-7xl mx-auto px-4 -mt-14 ">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Грешка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
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
          <div className="text-center ">
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