// HotelCard.tsx (Updated)

"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Hotel, Utensils, ExternalLink } from "lucide-react";

import { Hotel as HotelType } from "./HotelsTab";

interface HotelCardProps {
  hotel: HotelType;
  images: string[];
  hotelName: string;
  setThumbApi: (api: CarouselApi) => void;
  onThumbClick: (index: number) => void;
  currentIndex: number;
}

export function HotelCard({
  hotel,
  images,
  hotelName,
  setThumbApi,
  onThumbClick,
  currentIndex,
}: HotelCardProps) {
  return (
    <Card className="border-0  shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-4  flex flex-col h-full">
        
        {/* --- TOP SCROLLABLE AREA --- */}
        <div 
          className="flex-1 overflow-y-auto pr-2 -mr-2 min-h-0" 
          //  ^--- КОРЕКЦИЯТА Е ТУК: добавено е `min-h-0`
        >
          {/* Top Section */}
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl mb-2">
              <Hotel className="h-6 w-6 text-primary" />
              {hotel.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          {hotel.board && (
            <Badge variant="secondary" className="mb-4 mt-4 w-fit">
              <Utensils className="h-3 w-3 mr-1" />
              {hotel.board}
            </Badge>
          )}

          {hotel.overview && (
            <p className="text-sm text-foreground/80 my-4 leading-relaxed">
              {hotel.overview}
            </p>
          )}
        </div>
        
        {/* --- BOTTOM FIXED AREA --- */}
        <div className="pt-4">
          
          {/* THUMBNAIL CAROUSEL (No change) */}
          {images.length > 1 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-muted-foreground">Галерия</p>
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} / {images.length}
                </Badge>
              </div>
              <Carousel
                setApi={setThumbApi}
                opts={{
                  dragFree: true,
                  containScroll: "keepSnaps",
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {images.map((img, idx) => (
                    <CarouselItem key={idx} className="basis-auto pl-2">
                      <button
                        onClick={() => onThumbClick(idx)}
                        className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                          currentIndex === idx
                            ? "border-primary shadow-md"
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${hotelName} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
          
          {/* BOTTOM ROW (PRICE + WEBSITE) (No change) */}
          <div className="flex justify-between items-center gap-4 -mb-6">
            {hotel.minPriceInDouble && (
              <div className="bg-primary/15 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Мин. цена / стая</p>
                <p className="text-3xl font-bold text-primary">
                  {hotel.minPriceInDouble} {hotel.currency || "BGN"}
                </p>
              </div>
            )}
            {hotel.website && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-fit bg-transparent flex-shrink-0" 
              >
                <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Посети сайта
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}