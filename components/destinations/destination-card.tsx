// components/destinations/destination-card.tsx
"use client";

import * as React from "react";
// import Image from "next/image"; // Грешката идва от тук - заменяме го с <img>
// import Link from "next/link"; // ... и от тук - заменяме го с <a>
import { MapPin, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// НОВА ПРОМЯНА: Импортираме Carousel компонентите
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { DestinationListItem } from "@/app/api/destinations/route";
import Link from "next/link";

interface DestinationCardProps {
  destination: DestinationListItem;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const flagUrl = `https://flagcdn.com/w320/${destination.abbr}.png`; // Use .png for better consistency in cards

  return (
      <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30">
        {/* Flag as the main image */}
        <div className="relative h-56 w-full bg-gray-200">
          {/* Заменяме <Image> с <img>. Премахваме 'fill', добавяме 'w-full h-full' */}
          <img
            src={flagUrl}
            alt={`${destination.name} flag`}
            className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
            // Use a simple placeholder if the flag fails to load
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Flag";
              target.onerror = null;
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-sm backdrop-blur-sm">
              <Globe className="size-4 mr-1.5" />
              {destination.continent}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-2">
          <h3 className="font-semibold text-third text-2xl transition-all duration-300 group-hover:text-primary">
            {destination.name}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-5 text-third shrink-0" />
            <span>Популярни градове и курорти</span>
          </div>
          {/* НОВА ПРОМЯНА: Заменяме div с Carousel */}
          {destination.cities.length > 0 ? (
            <Carousel
              opts={{ align: "start", dragFree: true }}
              className="w-full" // Каруселът ще заеме пълната ширина на бащиния си елемент (CardContent)
            >
              <CarouselContent>
                {destination.cities.map((city) => (
                  <CarouselItem
                    key={city}
                    className="basis-auto flex-shrink-0 pr-2" // 'basis-auto' за авто-ширина, 'pr-2' за разстояние
                  >
                    <Badge
                      variant="outline"
                      className="bg-background/70 whitespace-nowrap" // 'whitespace-nowrap' е важно
                    >
                      {city}
                    </Badge>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <p className="text-sm text-muted-foreground">
              Няма добавени градове.
            </p>
          )}
          {/* КРАЙ НА ПРОМЯНАТА */}
        </CardContent>

        <CardFooter className="pt-2">
    <Link href={`/destinations/${destination.abbr}`}>

          <Button asChild className="w-full">
            {/* Тук също използваме <a>, тъй като <Button asChild> ще го превърне в бутон-линк */}
            Виж оферти
          </Button>
    </Link>
        </CardFooter>
      </Card>
  );
}