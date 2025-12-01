"use client";

import * as React from "react";
import { HotelCard } from "@/components/hotel/hotel-card";
import type { Hotel } from "@/lib/types-hotel";

interface HolidayHotelsProps {
    trips: any[]; // Using any[] because holiday_trips structure is complex and nested
}

export function HolidayHotels({ trips }: HolidayHotelsProps) {
    // Extract unique hotels from all trips
    const uniqueHotels = React.useMemo(() => {
        if (!trips || trips.length === 0) return [];

        const hotelMap = new Map<string, Hotel>();

        trips.forEach(trip => {
            if (trip.hotels && Array.isArray(trip.hotels)) {
                trip.hotels.forEach((tripHotel: any) => {
                    if (tripHotel.hotel && tripHotel.hotel.id) {
                        // Ensure we have a valid hotel object
                        // We might need to map some fields if they don't match exactly, 
                        // but based on the JSON, it looks like the 'hotel' object inside is what we want.
                        // The 'hotel' object in the JSON has 'city', 'country', 'address' at the top level 
                        // which matches the optional fields in the Hotel interface.
                        hotelMap.set(tripHotel.hotel.id, tripHotel.hotel as Hotel);
                    }
                });
            }
        });

        return Array.from(hotelMap.values());
    }, [trips]);

    if (uniqueHotels.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueHotels.map(hotel => (
                <div key={hotel.id} className="h-full">
                    <HotelCard hotel={hotel} />
                </div>
            ))}
        </div>
    );
}
