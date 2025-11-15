"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PlaneTakeoff, PlaneLanding, Bus } from "lucide-react";

interface CityRouteCarouselProps {
  cities: { id: string; name: string }[];
  transport: string;
}

export function CityRouteCarousel({ cities, transport }: CityRouteCarouselProps) {
  if (cities.length === 0) return null;

  const isPlane = transport === "Самолет" || transport === "Директен полет";
  const isBus = transport === "Автобус";
  const showIcons = isPlane || isBus;

  return (
    <Card className="border-0 shadow-sm mb-3">
      <CardContent className="">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="mx-6">
            {isPlane && (
              <CarouselItem className="basis-auto mt-2 flex-shrink-0 pl-1 pr-2">
                <PlaneTakeoff className="h-5 w-5 text-primary" />
              </CarouselItem>
            )}
            {isBus && (
              <CarouselItem className="basis-auto mt-2 flex-shrink-0 pl-1 pr-2">
                <Bus className="h-5 w-5 text-primary" />
              </CarouselItem>
            )}

            {cities.flatMap((city, idx) => [
              (idx > 0 || (idx === 0 && showIcons)) && (
                <CarouselItem
                  key={`${city.id}-line`}
                  className="basis-auto flex-shrink-0 px-1 flex items-center"
                >
                  <div className="flex-1 h-px bg-gray-300 min-w-[20px]" />
                </CarouselItem>
              ),
              <CarouselItem
                key={city.id}
                className="basis-auto flex-shrink-0 px-1"
              >
                <Badge className="text-base py-2 px-4 whitespace-nowrap">
                  {city.name}
                </Badge>
              </CarouselItem>,
            ])}

            {showIcons && cities.length > 0 && (
              <CarouselItem className="basis-auto flex-shrink-0 px-1 flex items-center">
                <div className="flex-1 h-px bg-gray-300 min-w-[20px]" />
              </CarouselItem>
            )}

            {isPlane && (
              <CarouselItem className="basis-auto flex-shrink-0 pl-2 pr-1">
                <PlaneLanding className="h-5 w-5 mt-2 text-primary" />
              </CarouselItem>
            )}
            {isBus && (
              <CarouselItem className="basis-auto flex-shrink-0 pl-2 pr-1">
                <Bus className="h-5 w-5 mt-2 text-primary" />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}