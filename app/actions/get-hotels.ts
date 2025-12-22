"use server";

import { Hotel, HotelsResponse } from "@/lib/types-hotel";
import { ALL_COUNTRIES } from "@/lib/constants";

const REVALIDATE_SECONDS = 3600;

export async function getHotels(limit = 20, offset = 0, country: string | null = null): Promise<HotelsResponse> {
    try {
        // 1. Fetch large batch for filtering
        const fetchLimit = 1000;
        const fetchOffset = 0;

        const apiUrl = `https://live.planet.bg/api/v1/hotels/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.error("Failed to fetch hotels:", res.statusText);
            return { hotels: [], total: 0 };
        }

        const data = await res.json();
        let hotels: Hotel[] = data.results || [];

        // 2. Filter by country if provided
        if (country) {
            hotels = hotels.filter((h) => h.country_code?.toLowerCase() === country.toLowerCase());
        }

        // 3. Filter enabled only (replicating logic from original page)
        hotels = hotels.filter(h => h.status === 'enabled');

        // 4. Calculate total BEFORE slicing (for potential pagination UI)
        const total = hotels.length;

        // 5. Paginate
        const slicedHotels = hotels.slice(offset, offset + limit);

        return {
            hotels: slicedHotels,
            total: total
        };
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return { hotels: [], total: 0 };
    }
}

export async function getHotelDestinations(): Promise<{ value: string; label: string }[]> {
    try {
        const fetchLimit = 1000;
        const fetchOffset = 0;
        let apiUrl = `https://live.planet.bg/api/v1/hotels/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        let hotels: Hotel[] = data.results || [];

        hotels = hotels.filter(h => h.status === 'enabled');

        const uniqueCountries = new Map<string, { value: string; label: string }>();

        hotels.forEach((hotel) => {
            if (hotel.country_code) {
                const countryCodeLower = hotel.country_code.toLowerCase();
                const countryName = hotel.country || hotel.country_code;

                if (!uniqueCountries.has(countryCodeLower)) {
                    const countryData = ALL_COUNTRIES.find(c => c.abbr === countryCodeLower);
                    uniqueCountries.set(countryCodeLower, {
                        value: countryCodeLower,
                        label: countryData ? countryData.name : countryName,
                    });
                }
            }
        });

        return Array.from(uniqueCountries.values());
    } catch (error) {
        console.error("Error fetching hotel destinations:", error);
        return [];
    }
}
