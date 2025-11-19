// components/yacht-card.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Anchor, Users, BedDouble, Droplets, Moon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Yacht } from "@/lib/types-yacht"; // Import the type we defined earlier

interface YachtCardProps {
  yacht: Yacht;
}

export function YachtCard({ yacht }: YachtCardProps) {
  // Helper to format price
  const formattedPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: yacht.min_price.display_currency,
    maximumFractionDigits: 0,
  }).format(yacht.min_price.value);

  const flagUrl = yacht.country 
    ? `https://flagcdn.com/${yacht.country.toLowerCase()}.svg` 
    : null;

  return (
    <Link href={`/yachts/${yacht.id}`}>
      <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30">
        
        {/* --- Image Section --- */}
        <div className="relative h-56 w-full bg-gray-200">
          {yacht.main_image?.image ? (
            <Image
              src={yacht.main_image.image}
              alt={yacht.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200">
              <Anchor className="h-16 w-16 text-blue-300" />
            </div>
          )}

          {/* Flag */}
          {flagUrl && (
            <div className="absolute bottom-2 left-2 border border-border/10">
              <div className="relative w-8 h-6 flex-shrink-0" title={yacht.country}>
                <Image
                  src={flagUrl}
                  alt={`${yacht.country} flag`}
                  fill
                  className="object-contain rounded-xs"
                  sizes="28px"
                />
              </div>
            </div>
          )}

          {/* Badge (Model Year or Type) */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/15 px-4 py-1 text-primary-foreground text-sm backdrop-blur-2xl border-border/30 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              <Anchor className="size-4 mr-1.5" />
              {yacht.model.split(",")[0]} {/* Displays "Beneteau" etc */}
            </Badge>
          </div>
        </div>

        {/* --- Header Section --- */}
        <CardHeader className="space-y-2 pb-2">
          <h3 className="font-semibold text-third text-xl line-clamp-2 transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
            {yacht.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {yacht.model}
          </p>
        </CardHeader>

        {/* --- Content / Specs Section --- */}
        <CardContent className="space-y-3 flex-grow">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-5 text-third shrink-0" />
            <span className="line-clamp-1">{yacht.home_port}</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-md border border-border/50">
                <Users className="size-5 text-third mb-1" />
                <span className="text-xs text-muted-foreground text-center">{yacht.guests} Гости</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-md border border-border/50">
                <BedDouble className="size-5 text-third mb-1" />
                <span className="text-xs text-muted-foreground text-center">{yacht.cabins} Каюти</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-md border border-border/50">
                <Droplets className="size-5 text-third mb-1" />
                <span className="text-xs text-muted-foreground text-center">{yacht.wc} WC</span>
            </div>
          </div>
        </CardContent>

        {/* --- Footer / Price Section --- */}
        <CardFooter className="justify-between pt-2 border-t border-border/50 mt-2">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
               Цена от <Moon className="size-3" />
            </p>
            <p className="text-2xl font-black text-primary">{formattedPrice}</p>
          </div>
          <Button asChild>
            <Link href={`/yachts/${yacht.id}`}>Виж яхта</Link>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}