"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Ship, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Yacht } from "@/lib/types-yacht";

// Fallback images in case the API returns an empty array
const FALLBACK_HERO_IMAGES = [
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

interface YachtHeaderProps {
  yacht: Yacht;
  className?: string;
}

export function YachtHeader({ yacht, className }: YachtHeaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // derive images from the yacht prop
  const heroImages = React.useMemo(() => {
    // Map the API response structure to an array of strings
    const apiImages = yacht.images?.map((img: any) => img.image) || [];

    // Return API images (limit to first 6 for performance) or fallback
    return apiImages.length > 0 ? apiImages.slice(0, 6) : FALLBACK_HERO_IMAGES;
  }, [yacht.images]);

  // Background Image Rotation
  React.useEffect(() => {
    // Only set interval if we have more than 1 image
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Format Price
  const currentPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: yacht.min_price.display_currency,
    maximumFractionDigits: 0,
  }).format(yacht.min_price.value);

  return (
    <div
      className={cn(
        // Fixed height h-96 for all screens
        // rounded-b-xl applied to the bottom of the header
        "relative w-full h-85 -mt-20 overflow-hidden rounded-b-xl flex items-end",
        className
      )}
    >
      {/* Background Images using Next.js <Image /> */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={img}
              alt={`Yacht view ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Content Container */}
      {/* pb-24 on mobile ensures text is above the absolute buttons */}
      <div className="max-w-6xl relative z-10 mx-auto px-4 pb-24 md:pb-20 pt-20 w-full">
        <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-4 h-full">

          {/* LEFT SIDE: Yacht Info */}
          <div className="space-y-2 md:space-y-4 max-w-2xl animate-in fade-in slide-in-from-left-5 duration-700">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm"
              >
                <Ship className="w-3 h-3 mr-2" />
                {yacht.model}
              </Badge>
              {yacht.available_as && (
                <Badge variant="outline" className="border-white/40 text-white text-xs md:text-sm">
                  {yacht.available_as}
                </Badge>
              )}
            </div>

            <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg text-nowrap">
              {yacht.name}
            </h1>

            <div className="flex items-center gap-2 text-sm md:text-lg text-gray-200 font-medium">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              {yacht.home_port}
            </div>
          </div>

          {/* RIGHT SIDE: Price Box (DESKTOP ONLY) */}
          {/* Hidden on mobile (< md), visible on desktop */}
          <div className="hidden md:block animate-in fade-in slide-in-from-right-5 duration-700 delay-100">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-right p-6">
              <p className="text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider">
                Цена от
              </p>
              <div className="text-4xl font-black text-white drop-shadow-md">
                {currentPrice}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                за седмица / {yacht.min_price.display_currency}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ABSOLUTE CONTROLS FOR MOBILE --- */}

      {/* 1. Absolute Bottom Left: Back Button */}
      <div className="absolute top-22 left-2 z-20">
        <Button
          variant="glass"
          size="sm"
          asChild
          className="border border-white/10 shadow-lg"
        >
          <Link href="/yachts">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Всички яхти
          </Link>
        </Button>
      </div>

      {/* 2. Absolute Bottom Right: Price Box (MOBILE ONLY) */}
      {/* Same content structure, positioned absolutely like the back button */}
      <div className="absolute bottom-6 right-4 z-20 md:hidden">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-right shadow-lg">
          <p className="text-[10px] font-medium text-gray-300 mb-0 uppercase tracking-wider">
            Цена от
          </p>
          <div className="text-xl font-black text-white drop-shadow-md leading-tight">
            {currentPrice}
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            за седмица
          </p>
        </div>
      </div>

    </div>
  );
}