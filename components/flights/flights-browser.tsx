"use client";

import * as React from "react";
import { Plane } from "lucide-react";
import { HeroSlider } from "@/components/layout/hero-slider";
import { SimplifiedFlightCard } from "./simplified-flight-card";
import type { DestinationListItem } from "@/app/api/destinations/route";

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

export default function FlightsBrowser({ flights }: { flights: SanityFlight[] }) {
    const [selectedDestination, setSelectedDestination] = React.useState<DestinationListItem | null>(null);
    const [filteredFlights, setFilteredFlights] = React.useState<SanityFlight[]>(flights);

    // Filter logic adapted from your original page.tsx
    React.useEffect(() => {
        if (selectedDestination) {
            const term = selectedDestination.name.toLowerCase();
            const filtered = flights.filter(flight =>
                flight.toCity.toLowerCase().includes(term) ||
                (flight.fromCity && flight.fromCity.toLowerCase().includes(term)) ||
                flight.toCountry.toLowerCase().includes(term)
            );
            setFilteredFlights(filtered);
        } else {
            setFilteredFlights(flights);
        }
    }, [selectedDestination, flights]);

    return (
        <div>
            <HeroSlider
                className="h-112"
                title="Самолетни Билети"
                subtitle="Най-добрите цени за полети до цял свят"
                icon={Plane}
                selectedDestination={selectedDestination}
                onDestinationSelect={setSelectedDestination}
            />

            <div className="max-w-7xl mx-auto px-4 -mt-20 py-8 relative z-10">
                {filteredFlights.length === 0 ? (
                    <div className="text-center py-20 bg-secondary-foreground/10 rounded-lg backdrop-blur-sm">
                        <p className="text-lg text-muted-foreground">
                            {selectedDestination
                                ? `Няма намерени полети за ${selectedDestination.name}.`
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