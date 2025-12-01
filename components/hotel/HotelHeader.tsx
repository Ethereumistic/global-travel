"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/lib/types-hotel";
import { ALL_COUNTRIES } from "@/lib/constants";

interface HotelHeaderProps {
    hotel: Hotel;
    className?: string;
}

export function HotelHeader({ hotel, className }: HotelHeaderProps) {
    // Get Bulgarian Country Name and Flag
    const countryData = React.useMemo(() => {
        if (!hotel.location?.country_code && !hotel.country_code) return null;

        const code = (hotel.location?.country_code || hotel.country_code || "").toLowerCase();
        const match = ALL_COUNTRIES.find(c => c.abbr.toLowerCase() === code);

        if (match) {
            return {
                name: match.name,
                flagUrl: `https://flagcdn.com/${match.abbr.toLowerCase()}.svg`
            };
        }

        return {
            name: hotel.location?.country || hotel.country || code.toUpperCase(),
            flagUrl: `https://flagcdn.com/${code}.svg`
        };
    }, [hotel]);

    const stars = Math.round(hotel.rating || 0);

    return (
        <div
            className={cn(
                "relative w-full h-96 -mt-20 overflow-hidden rounded-b-xl flex items-end",
                className
            )}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100">
                    <Image
                        src={hotel.main_image?.image || "/placeholder.svg"}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/50 " />
            </div>

            {/* Content Container */}
            <div className="max-w-7xl relative z-10 mx-auto px-4 pb-24 md:pb-20 pt-20 w-full">
                <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-4 h-full">

                    {/* LEFT SIDE: Hotel Info */}
                    <div className="space-y-2 md:space-y-4 max-w-7xl animate-in fade-in slide-in-from-left-5 duration-700">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm"
                            >
                                Хотел
                            </Badge>
                            {stars > 0 && (
                                <div className="flex items-center gap-0.5 text-yellow-400">
                                    {Array.from({ length: stars }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg text-wrap leading-[1] line-clamp-2">
                            {hotel.name}
                        </h1>

                        <div className="flex items-center gap-4 text-sm md:text-lg text-gray-200 font-medium">
                            {countryData && (
                                <div className="flex items-center gap-2">
                                    {countryData.flagUrl && (
                                        <div className="relative w-6 h-4 md:w-8 md:h-6 shadow-sm rounded overflow-hidden shrink-0">
                                            <Image src={countryData.flagUrl} alt={countryData.name} fill className="object-cover" />
                                        </div>
                                    )}
                                    {countryData.name}
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                {hotel.location?.city || hotel.city}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="absolute top-24 left-2 z-20">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="backdrop-blur-md border border-white/10 shadow-lg text-white hover:bg-white/20"
                >
                    <Link href="/hotels">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Всички хотели
                    </Link>
                </Button>
            </div>
        </div>
    );
}
