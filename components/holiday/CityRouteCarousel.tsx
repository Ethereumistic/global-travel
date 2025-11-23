"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { PlaneTakeoff, PlaneLanding, Bus } from "lucide-react";

interface CityRouteCarouselProps {
    cities: { id: string; name: string }[];
    transport: string;
}

export function CityRouteCarousel({ cities, transport }: CityRouteCarouselProps) {
    if (!cities || cities.length === 0) return null;

    const isPlane = transport === "Самолет" || transport === "Директен полет" || transport === "Airplane";
    const isBus = transport === "Автобус" || transport === "Bus";

    const StartIcon = isPlane ? PlaneTakeoff : isBus ? Bus : null;
    const EndIcon = isPlane ? PlaneLanding : isBus ? Bus : null;

    return (
        <Card className="border-0 shadow-sm mb-2">
            <CardContent className="">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full px-6">
                    <CarouselContent className="mx-auto items-center">
                        {cities.map((city, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === cities.length - 1;

                            return (
                                <React.Fragment key={`${city.id}-${idx}`}>
                                    {/* Connector Line */}
                                    {idx > 0 && (
                                        <CarouselItem className="basis-auto flex-shrink-0 px-0 flex items-center">
                                            <div className="w-4 h-px bg-slate-300" />
                                        </CarouselItem>
                                    )}

                                    {/* City Badge */}
                                    <CarouselItem className="basis-auto flex-shrink-0 px-1">
                                        <Badge
                                            variant="outline"
                                            className={`text-sm py-1.5 px-4 whitespace-nowrap shadow-sm gap-2 ${(isFirst || isLast) ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-700'
                                                }`}
                                        >
                                            {isFirst && StartIcon && <StartIcon className="h-4 w-4" />}
                                            {city.name}
                                            {isLast && EndIcon && <EndIcon className="h-4 w-4" />}
                                        </Badge>
                                    </CarouselItem>
                                </React.Fragment>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3 bg-transparent hover:bg-transparent border-none" />
                    <CarouselNext className="-right-3 bg-transparent hover:bg-transparent border-none" />
                </Carousel>
            </CardContent>
        </Card>
    );
}
