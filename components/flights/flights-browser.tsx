"use client";

import * as React from "react";
import { Palmtree, Plane } from "lucide-react";
import { PageSlider } from "../layout/page-slider";
import { SimplifiedFlightCard } from "./simplified-flight-card";

// Define the interface for Sanity Data
export interface SanityFlight {
    _id: string;
    toCity: string;
    toCountry: string;
    fromCity?: string;
    fromCountry?: string;
    price?: number;
    imageUrl: string;
    airlines: Array<{
        name: string;
        color: string;
    }> | null;
    slug?: {
        current: string;
    };
}

const HOLIDAY_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/1.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/2.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/3.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/4.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/5.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/6.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/7.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/8.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/flights/9.jpg",

];

export default function FlightsBrowser({ flights }: { flights: SanityFlight[] }) {
    const [selectedDestination, setSelectedDestination] = React.useState<string | null>(null);
    const [filteredFlights, setFilteredFlights] = React.useState<SanityFlight[]>(flights);



    return (
        <div>
            <PageSlider
                images={HOLIDAY_HERO_IMAGES}
                title="Самолетни Билети"
                subtitle="Открийте мечтаната дестинация с нашите специални предложения."
                icon={<Plane className="h-8 w-8 text-white" />}
                className="h-96 rounded-b-xl"
                searchType="none"
            />

            <div className="container mx-auto px-4 py-8 relative z-10">

                <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Нашите Предложения
                    </h2>
                </div>
                {filteredFlights.length === 0 ? (
                    <div className="text-center py-20 bg-secondary-foreground/10 rounded-lg backdrop-blur-sm">
                        <p className="text-lg text-muted-foreground">
                            {selectedDestination
                                ? `Няма намерени полети за ${selectedDestination}.`
                                : "Няма налични полети в момента."}
                        </p>
                        <button
                            onClick={() => setSelectedDestination(null)}
                            className="mt-4 text-primary hover:underline font-medium"
                        >
                            Покажи всички полети
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFlights.map((flight) => (
                            <SimplifiedFlightCard key={flight._id} flight={flight} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}