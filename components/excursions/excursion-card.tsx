// components/excursion-card.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Plane, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PackageListItem } from "@/app/api/packages/route";

interface ExcursionCardProps {
  package: PackageListItem;
}

export function ExcursionCard({ package: pkg }: ExcursionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-200">
        {pkg.thumbnail ? (
          <Image
            src={pkg.thumbnail}
            alt={pkg.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
            <MapPin className="h-16 w-16 text-gray-500" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {pkg.transport}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
          {pkg.title}
        </h3>
        {pkg.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pkg.subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {pkg.countries.join(", ")}
            {pkg.cities.length > 0 && ` • ${pkg.cities[0]}`}
            {pkg.cities.length > 1 && ` +${pkg.cities.length - 1}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {pkg.duration} дни / {pkg.overnights} нощувки
          </span>
        </div>

        {pkg.period.from && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {new Date(pkg.period.from).toLocaleDateString("bg-BG")} -{" "}
              {new Date(pkg.period.to).toLocaleDateString("bg-BG")}
            </span>
          </div>
        )}

        {pkg.priceNote && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {pkg.priceNote}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
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