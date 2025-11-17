// ==================================================
// 15. /app/[locale]/excursions/[id]/page.tsx (REFACTORED)
// ==================================================

"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft, AlertCircle, Check, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PackageDetail } from "@/app/api/packages/[id]/route";
import { ALL_COUNTRIES } from "@/lib/constants";

// Import all new components
import { ExcursionHeader } from "./components/ExcursionHeader";
import { ExcursionGallery } from "./components/ExcursionGallery";
import { CityRouteCarousel } from "./components/CityRouteCarousel";
import { TravelInfoGrid } from "./components/TravelInfoGrid";
import { ExcursionOverview } from "./components/ExcursionOverview";
import { PriceIncludesExcludes } from "./components/PriceIncludesExcludes";
import { AdditionalInfoCards } from "./components/AdditionalInfoCards";
import { DailyScheduleTab } from "./components/DailyScheduleTab";
import { HotelsTab } from "./components/HotelsTab";
import { AdditionalTab } from "./components/AdditionalTab";
import { CTASection } from "./components/CTASection";
import { parsePriceNote2 } from "./utils/priceNoteParser";
import { TimeInterval } from "./components/TimeInterval";

export default function ExcursionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [packageDetail, setPackageDetail] = React.useState<PackageDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Derive country data with flags
  const countryData = React.useMemo(() => {
    if (!packageDetail) return [];

    return packageDetail.countries
      .map((country) => ALL_COUNTRIES.find((c) => c.name === country.name))
      .filter(Boolean) as { name: string; abbr: string }[];
  }, [packageDetail]);

  // Parse price note
  const parsedPriceNote2 = React.useMemo(() => {
    if (!packageDetail?.priceNote2) return null;
    return parsePriceNote2(packageDetail.priceNote2);
  }, [packageDetail?.priceNote2]);

  // Fetch package detail
  React.useEffect(() => {
    async function fetchPackageDetail() {
      if (!id) {
        setError("Invalid Page ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/packages/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Неуспешно зареждане на екскурзията");
        }

        const data = await response.json();
        setPackageDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Възникна грешка");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackageDetail();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-96 w-full mb-6 rounded-xl" />
        <Skeleton className="h-12 w-34 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-56" />
      </div>
    );
  }

  // Error state
  if (error || !packageDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>{error || "Екскурзията не беше намерена"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/excursions">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Обратно към екскурзии
          </Link>
        </Button>
      </div>
    );
  }

  // Main render
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header with flags and title */}
      <ExcursionHeader title={packageDetail.title} countries={countryData} />

      {/* Image Gallery */}
      <ExcursionGallery images={packageDetail.images} title={packageDetail.title} />

      {/* City Route & Travel Date */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="lg:col-span-1">
          <CityRouteCarousel cities={packageDetail.cities} transport={packageDetail.transport} />
          <TravelInfoGrid
          duration={packageDetail.duration}
          countries={countryData}
          transport={packageDetail.transport}
          minPrice={packageDetail.minPrice.price}
          period={packageDetail.period}
        />
        </div>

        <div className="lg:col-span-1 mb-3">

        <TimeInterval period={packageDetail.period}  />
        <ExcursionOverview
          overview={packageDetail.overview}
          priceNote={packageDetail.minPrice.priceNote}
        />
        </div>

      
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="mt-2 space-y-3">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="overview">Преглед</TabsTrigger>
          <TabsTrigger value="schedule">Програма</TabsTrigger>
          <TabsTrigger value="hotels">Хотели</TabsTrigger>
          <TabsTrigger value="additional">Допълнително</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3">


          {/* {packageDetail.minPrice.priceNote && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Включено в цената (Резюме)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {packageDetail.minPrice.priceNote
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground/80">{line.trim()}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Parsed Price Note Sections */}
          {parsedPriceNote2 && (
            <>
              <PriceIncludesExcludes parsedData={parsedPriceNote2} />
              <AdditionalInfoCards parsedData={parsedPriceNote2} />
            </>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <DailyScheduleTab schedule={packageDetail.dailySchedule} />
        </TabsContent>

        {/* Hotels Tab */}
        <TabsContent value="hotels">
          <HotelsTab hotels={packageDetail.hotels} />
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional">
          <AdditionalTab
            additionalPayments={packageDetail.additionalPayments}
            additionalExcursions={packageDetail.additionalExcursions}
            images={packageDetail.images}
            packageTitle={packageDetail.title}
          />
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}