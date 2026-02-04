"use server";

import { Holiday } from "@/lib/types-holiday";
import { ALL_COUNTRIES } from "@/lib/constants";

export async function getHolidays(limit = 12, offset = 0, country: string | null = null): Promise<Holiday[]> {
    try {
        const fetchLimit = 1000;
        const fetchOffset = 0;

        let apiUrl = `https://live.planet.bg/api/v1/holidays/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error("Failed to fetch holidays:", res.statusText);
            return [];
        }

        const data = await res.json();
        let holidays: Holiday[] = data.holidays || [];

        // 2. Filter by country if provided
        if (country) {
            holidays = holidays.filter((h) => h.country?.iso_code?.toLowerCase() === country.toLowerCase());
        }

        // 3. Slice the results based on requested offset/limit
        // This ensures we only send the requested batch to the client
        const slicedHolidays = holidays.slice(offset, offset + limit);

        return slicedHolidays;
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
}

export async function getHolidayById(id: string): Promise<Holiday | null> {
    try {
        const apiUrl = `https://live.planet.bg/api/v1/holidays/${id}/`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`Failed to fetch holiday ${id}:`, res.statusText);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching holiday ${id}:`, error);
        return null;
    }
}

export async function getHolidayDestinations(): Promise<{ value: string; label: string }[]> {
    try {
        const fetchLimit = 1000;
        const fetchOffset = 0;
        let apiUrl = `https://live.planet.bg/api/v1/holidays/?limit=${fetchLimit}&offset=${fetchOffset}`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        const holidays: Holiday[] = data.holidays || [];

        const uniqueCountries = new Map<string, { value: string; label: string }>();

        holidays.forEach((holiday) => {
            if (holiday.country && holiday.country.iso_code) {
                const countryCodeLower = holiday.country.iso_code.toLowerCase();
                if (!uniqueCountries.has(countryCodeLower)) {
                    const countryData = ALL_COUNTRIES.find(c => c.abbr === countryCodeLower);
                    uniqueCountries.set(countryCodeLower, {
                        value: countryCodeLower,
                        label: countryData ? countryData.name : holiday.country.name,
                    });
                }
            }
        });

        return Array.from(uniqueCountries.values());
    } catch (error) {
        console.error("Error fetching holiday destinations:", error);
        return [];
    }
}
