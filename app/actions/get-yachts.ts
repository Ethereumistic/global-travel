"use server";

import { Yacht } from "@/lib/types-yacht";
import { ALL_COUNTRIES } from "@/lib/constants";

// Cache for 1 hour
const REVALIDATE_SECONDS = 3600;

export async function getYachts(limit = 9, offset = 0, country: string | null = null): Promise<Yacht[]> {
    try {
        // 1. Fetch ALL yachts (or a large enough subset) to allow for filtering
        // Since the API doesn't support country filtering, we fetch a large batch.
        // In a real production scenario with thousands of items, we'd want the API to support filtering.
        // For now, 1000 is a safe upper bound for "all" items given the context.
        const fetchLimit = 1000;
        const fetchOffset = 0;

        const apiUrl = `https://live.planet.bg/api/v1/yachts/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.error("Failed to fetch yachts:", res.statusText);
            return [];
        }

        const data = await res.json();
        let yachts: Yacht[] = data.yachts || [];

        // 2. Filter by country if provided
        if (country) {
            yachts = yachts.filter((y) => y.country?.toLowerCase() === country.toLowerCase());
        }

        // 3. Paginate (Slice) the results
        // We slice based on the original requested limit and offset
        const slicedYachts = yachts.slice(offset, offset + limit);

        return slicedYachts;
    } catch (error) {
        console.error("Error fetching yachts:", error);
        return [];
    }
}

// Helper to fetch single yacht
export async function getYachtById(id: string): Promise<Yacht | null> {
    try {
        const apiUrl = `https://live.planet.bg/api/v1/yachts/${id}/`;

        const res = await fetch(apiUrl, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`Failed to fetch yacht ${id}:`, res.statusText);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching yacht ${id}:`, error);
        return null;
    }
}

export async function getYachtDestinations(): Promise<{ value: string; label: string }[]> {
    try {
        const fetchLimit = 1000;
        const fetchOffset = 0;
        let apiUrl = `https://live.planet.bg/api/v1/yachts/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        const yachts: Yacht[] = data.yachts || [];

        const uniqueCountries = new Map<string, { value: string; label: string }>();

        yachts.forEach((yacht) => {
            if (yacht.country) {
                const countryCodeLower = yacht.country.toLowerCase();
                if (!uniqueCountries.has(countryCodeLower)) {
                    const countryData = ALL_COUNTRIES.find(c => c.abbr === countryCodeLower);
                    uniqueCountries.set(countryCodeLower, {
                        value: countryCodeLower,
                        label: countryData ? countryData.name : yacht.country
                    });
                }
            }
        });

        return Array.from(uniqueCountries.values());
    } catch (error) {
        console.error("Error fetching yacht destinations:", error);
        return [];
    }
}
