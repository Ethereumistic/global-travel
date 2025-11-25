"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronLeft, Calendar, Plane, Bus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Holiday } from "@/lib/types-holiday";
import { ALL_COUNTRIES } from "@/lib/constants";

// Fallback images in case the API returns an empty array
const FALLBACK_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

interface HolidayHeaderProps {
    holiday: Holiday;
    className?: string;
}

export function HolidayHeader({ holiday, className }: HolidayHeaderProps) {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    // derive images from the holiday prop
    const heroImages = React.useMemo(() => {
        // Map the API response structure to an array of strings
        const apiImages = holiday.images?.map((img: any) => img.image) || [];
        if (apiImages.length === 0 && holiday.main_image) {
            apiImages.push(holiday.main_image.image);
        }

        // Return API images (limit to first 6 for performance) or fallback
        return apiImages.length > 0 ? apiImages.slice(0, 6) : FALLBACK_HERO_IMAGES;
    }, [holiday.images, holiday.main_image]);

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
    const currentPrice = holiday.min_price.main?.value || holiday.min_price.value;
    const currency = holiday.min_price.main?.currency || holiday.min_price.display_currency;

    // Get Bulgarian Country Name and Flag
    const countryData = React.useMemo(() => {
        if (!holiday.country) return null;
        const match = ALL_COUNTRIES.find(
            c => c.name.toLowerCase() === holiday.country?.name?.toLowerCase() ||
                c.abbr.toLowerCase() === holiday.country?.iso_code?.toLowerCase() ||
                c.abbr.toLowerCase() === holiday.country?.country?.toLowerCase()
        );
        if (match) {
            return {
                name: match.name,
                flagUrl: `https://flagcdn.com/${match.abbr.toLowerCase()}.svg`
            };
        }
        // Fallback
        const code = holiday.country.iso_code?.toLowerCase() || holiday.country.country?.toLowerCase();
        return {
            name: holiday.country.name,
            flagUrl: code ? `https://flagcdn.com/${code}.svg` : null
        };
    }, [holiday.country]);

    return (
        <div
            className={cn(
                // Fixed height h-96 for all screens
                // rounded-b-xl applied to the bottom of the header
                "relative w-full h-96 -mt-20 overflow-hidden rounded-b-xl flex items-end",
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
                            alt={`Holiday view ${index + 1}`}
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
            <div className="max-w-7xl relative z-10 mx-auto px-4 pb-24 md:pb-20 pt-20 w-full">
                <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-4 h-full">

                    {/* LEFT SIDE: Holiday Info */}
                    <div className="space-y-2 md:space-y-4 max-w-7xl animate-in fade-in slide-in-from-left-5 duration-700">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm"
                            >
                                {holiday.holiday_type === "Excursion" ? "Екскурзия" : "Почивка"}
                            </Badge>
                            {holiday.transport && holiday.transport !== "None" && (
                                <Badge variant="outline" className="border-white/40 text-white text-xs md:text-sm flex items-center gap-1">
                                    {holiday.transport === "Airplane" || holiday.transport === "Самолет" ? <Plane className="h-3 w-3" /> : <Bus className="h-3 w-3" />}
                                    {holiday.transport === "Airplane" ? "Самолет" : holiday.transport === "Bus" ? "Автобус" : holiday.transport}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg text-wrap leading-[1] line-clamp-2">
                            {holiday.title}
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
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                {holiday.duration} дни
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Price Box (DESKTOP ONLY) */}
                    {/* Hidden on mobile (< md), visible on desktop */}
                    {/* <div className="hidden md:block animate-in fade-in slide-in-from-right-5 duration-700 delay-100">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-right p-6">
                            <p className="text-sm font-medium text-gray-300 mb-1 uppercase tracking-wider">
                                Цена от
                            </p>
                            <div className="text-4xl font-black text-white drop-shadow-md">
                                {currentPrice} <span className="text-2xl font-bold">{currency}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                на човек
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* --- ABSOLUTE CONTROLS FOR MOBILE --- */}

            {/* 1. Absolute Bottom Left: Back Button */}
            <div className="absolute top-24 left-2 z-20">
                <Button
                    variant="glass"
                    size="sm"
                    asChild
                    className=" backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <Link href="/holidays">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Всички оферти
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
                        {currentPrice} {currency}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        на човек
                    </p>
                </div>
            </div>

        </div>
    );
}
