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
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Hotel, Utensils, ExternalLink, ArrowRight } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city: string;
    country: string;
    images: string[];
    board?: string;
    overview?: string;
    details?: string;
    minPriceInDouble?: string;
    currency?: string;
    website?: string;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [hotelCarouselApi, setHotelCarouselApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!hotelCarouselApi) return;
    hotelCarouselApi.on("select", () => {
      setCurrentIndex(hotelCarouselApi.selectedScrollSnap());
    });
  }, [hotelCarouselApi]);

  return (
    <Card className="border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {hotel.images.length > 0 && (
          <div className="flex flex-col gap-3">
            <Carousel setApi={setHotelCarouselApi} className="w-full">
              <CarouselContent>
                {hotel.images.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${hotel.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {hotel.images.length > 1 && (
              <div className="text-center">
                <Badge variant="secondary">
                  {currentIndex + 1} / {hotel.images.length}
                </Badge>
              </div>
            )}

            {hotel.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hotel.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => hotelCarouselApi?.scrollTo(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      currentIndex === idx
                        ? "border-primary shadow-md"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${hotel.name} ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <div className="mb-6">
            <CardTitle className="flex items-center gap-2 text-2xl mb-2">
              <Hotel className="h-6 w-6 text-primary" />
              {hotel.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          {hotel.board && (
            <Badge variant="secondary" className="mb-4 w-fit">
              <Utensils className="h-3 w-3 mr-1" />
              {hotel.board}
            </Badge>
          )}

          {hotel.overview && (
            <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{hotel.overview}</p>
          )}

          {hotel.minPriceInDouble && (
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <p className="text-xs text-muted-foreground">Минимална цена за двойна стая</p>
              <p className="text-2xl font-bold text-primary">
                {hotel.minPriceInDouble} {hotel.currency || "BGN"}
              </p>
            </div>
          )}

          {hotel.website && (
            <Button variant="outline" size="sm" asChild className="w-fit bg-transparent">
              <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Посети сайта
              </a>
            </Button>
          )}

          {hotel.details && (
            <details className="group mt-4 pt-4 border-t">
              <summary className="cursor-pointer text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                Покажи детайли{" "}
                <ArrowRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-foreground/80 mt-3 whitespace-pre-line">{hotel.details}</p>
            </details>
          )}
        </div>
      </div>
    </Card>
  );
}