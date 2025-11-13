// components/excursion-card.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Plane, Clock, Sparkles, Sparkle, Moon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PackageListItem } from "@/app/api/packages/route";
import { ALL_COUNTRIES } from "@/lib/constants"; // <-- 1. IMPORT CONSTANTS (adjust path if needed)

interface ExcursionCardProps {
  package: PackageListItem;
}

export function ExcursionCard({ package: pkg }: ExcursionCardProps) {
  // 2. Find the country data (including abbreviation) for each country in the package
  const countryData = React.useMemo(() => {
    return pkg.countries
      .map((countryName) =>
        ALL_COUNTRIES.find((c) => c.name === countryName)
      )
      .filter(Boolean) as { name: string; abbr: string }[]; // Filter out any undefined matches
  }, [pkg.countries]);

  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30">
      <div className="relative h-56 w-full bg-gray-200">
        {pkg.thumbnail ? (
          <Image
            src={pkg.thumbnail}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
            <MapPin className="h-16 w-16 text-gray-500" />
          </div>
        )}

    {countryData.length > 0 && (
      <div className="absolute bottom-2 left-2">
        {countryData.map((country) => (
          <div
            key={country.abbr}
            className="relative w-8 h-6  flex-shrink-0"
            title={country.name}
          >
            <Image
              src={`https://flagcdn.com/${country.abbr}.svg`}
              alt={`${country.name} flag`}
              fill
              className="object-contain rounded-xs"
              sizes="28px"
            />
          </div>
        ))}
      </div>
    )}

        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-primary text-primary-foreground text-sm backdrop-blur-sm">
            {pkg.transport}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        {/* 3. ADDED: Render flags before the title */}


        <h3 className="font-semibold text-third text-xl line-clamp-2 transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
          {pkg.title}
        </h3>
        {pkg.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pkg.subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-5 text-third shrink-0" />
          <span className="line-clamp-1">
            {pkg.countries.join(", ")}
            {pkg.cities.length > 0 && ` • ${pkg.cities[0]}`}
            {pkg.cities.length > 1 && ` +${pkg.cities.length - 1}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-5 text-third shrink-0" />
          <span>
            {pkg.duration} дни / {pkg.overnights} нощувки
          </span>
        </div>

        {pkg.period.from && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-5 text-third shrink-0" />
            <span>
              {new Date(pkg.period.from).toLocaleDateString("bg-BG")} -{" "}
              {new Date(pkg.period.to).toLocaleDateString("bg-BG")}
            </span>
          </div>
        )}

        {pkg.priceNote && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground line-clamp-2">
            <Moon className="size-5 text-third shrink-0" />
            {pkg.priceNote}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground">Цена от</p>
          <p className="text-2xl font-bold text-primary">{pkg.minPrice}</p>
        </div>
        <Button asChild>
          <Link href={`/excursions/${pkg.id}`}>Виж повече</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}