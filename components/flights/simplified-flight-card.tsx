"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SanityFlight } from "./flights-browser";
import { ALL_COUNTRIES } from "@/lib/constants";

// Helper to find the correct flag abbreviation
function getCountryFlagUrl(countryName: string) {
    if (!countryName) return null;

    const country = ALL_COUNTRIES.find(c =>
        c.name.toLowerCase() === countryName.toLowerCase() ||
        c.name_en.toLowerCase() === countryName.toLowerCase()
    );

    return country ? `https://flagcdn.com/${country.abbr}.svg` : null;
}

export function SimplifiedFlightCard({ flight }: { flight: SanityFlight }) {
    const [currentAirlineIndex, setCurrentAirlineIndex] = React.useState(0);
    const airlines = flight.airlines || [];

    // Cycle through airlines every 5 seconds
    React.useEffect(() => {
        if (airlines.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentAirlineIndex((prev) => (prev + 1) % airlines.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [airlines.length]);

    const currentAirline = airlines[currentAirlineIndex];
    const flagUrl = getCountryFlagUrl(flight.toCountry);

    return (
        <Link href={`/flights/${flight.slug?.current || '#'}`} className="block h-full">
            <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30 border-border/50 cursor-pointer">

                {/* --- IMAGE SECTION --- */}
                <div className="relative h-64 w-full bg-muted overflow-hidden">
                    <Image
                        src={flight.imageUrl}
                        alt={`Полет до ${flight.toCity}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Dynamic Airline Badge (Top Right) */}
                    {currentAirline && (
                        <div className="absolute top-2 right-2 z-10">
                            <Badge
                                className="px-4 py-1 text-white text-sm backdrop-blur-md border-border/30 drop-shadow-md transition-all duration-500"
                                style={{ backgroundColor: currentAirline.color }}
                            >
                                <Plane className="size-4 mr-1.5" />
                                <span className="animate-in fade-in zoom-in duration-300 key={currentAirline.name}">
                                    {currentAirline.name}
                                </span>
                            </Badge>
                        </div>
                    )}

                    {/* Country Flag (Bottom Left) */}
                    {flagUrl && (
                        <div className="absolute bottom-2 left-2 z-10">
                            <div className="relative w-8 h-6 overflow-hidden rounded shadow-sm ">
                                <Image
                                    src={flagUrl}
                                    alt={flight.toCountry}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- HEADER --- */}
                <CardHeader className="-mb-4 ">
                    <h3 className="font-black text-third mx-auto text-2xl line-clamp-2 transition-all duration-300 group-hover:text-primary flex items-center gap-2">
                        {flight.fromCity ? (
                            <>

                                {flight.fromCity}
                                <ArrowRight className="size-5 " />
                                {flight.toCity}
                            </>
                        ) : (
                            flight.toCity
                        )}
                    </h3>
                </CardHeader>

                {/* --- CONTENT SPACER --- */}
                {/* Pushes the footer to the bottom */}
                <CardContent className="flex-grow" />

                {/* --- FOOTER --- */}
                <CardFooter className="justify-between pt-2 border-t border-border/5">
                    <div>
                        <p className="text-sm text-muted-foreground">Цени от</p>
                        <p className="text-4xl flex items-center gap-1 font-black text-primary text-nowrap">
                            {flight.price} €
                        </p>
                    </div>
                    <div className="bg-primary  text-nowrap text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md inline-flex items-center justify-center font-semibold shadow-md text-lg transition-colors">
                        Купи билет
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}