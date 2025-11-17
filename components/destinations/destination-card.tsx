// components/destinations/destination-card.tsx
"use client";

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
  // ПРОМЯНА: Вече не дефинираме flagUrl тук
  // const flagUrl = `https://flagcdn.com/w320/${destination.abbr}.png`; // Use .png for better consistency in cards

  return (
      <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30">
        
        {/* ПРОМЯНА: Основната снимка вече е thumbnail */}
        <div className="relative h-56 w-full bg-gray-200">
          <img
            // Използваме thumbnail. Ако няма, слагаме placeholder
            src={destination.thumbnail || "https://placehold.co/600x400/e2e8f0/64748b?text=Image"}
            alt={`${destination.name} destination image`}
            className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
            // onError остава, за да хване ако thumbnail URL-ът е счупен
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image";
              target.onerror = null;
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-transparent text-primary-foreground text-sm backdrop-blur-2xl border-border/30  drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              <Globe className="size-4 mr-1.5" />
              {destination.continent}
            </Badge>
          </div>
        </div>

        {/* ПРОМЯНА: Хедърът вече съдържа флаг + име */}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            {/* НОВО: Малък флаг */}
            <img
              src={`https://flagcdn.com/w40/${destination.abbr}.png`}
              alt={`${destination.name} flag`}
              className="size-8 rounded-full object-cover border" // size-8 = 2rem
            />
            <h3 className="font-semibold text-third text-2xl transition-all duration-300 group-hover:text-primary">
              {destination.name}
            </h3>
          </div>
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
                      
                      className=" whitespace-nowrap" // 'whitespace-nowrap' е важно
                    >
                      {city}
                    </Badge>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <p className="text-sm text-muted-foreground">
              
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