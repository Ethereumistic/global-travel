// app/excursions/page.tsx
"use client";

import * as React from "react";
import { ExcursionCard } from "@/components/excursions/excursion-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { PackageListItem } from "@/app/api/packages/route";

export default function ExcursionsPage() {
  const [packages, setPackages] = React.useState<PackageListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Екскурзии и Почивки</h1>
        <p className="text-muted-foreground">
          Открийте най-добрите оферти за пътувания и екскурзии
        </p>
      </div>

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
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Няма налични екскурзии в момента.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <ExcursionCard key={pkg.id} package={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}