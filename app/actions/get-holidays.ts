"use server";

import { Holiday } from "@/lib/types-holiday";

export async function getHolidays(limit = 12, offset = 0, country: string | null = null): Promise<Holiday[]> {
    try {
        // If filtering by country, we need to fetch all (or a large number) of holidays first,
        // then filter, then paginate. The API doesn't seem to support server-side filtering by country with pagination.
        const fetchLimit = country ? 1000 : limit;
        const fetchOffset = country ? 0 : offset;

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

        if (country) {
            holidays = holidays.filter((h) => h.country?.iso_code?.toLowerCase() === country.toLowerCase());
            // Apply pagination manually after filtering
            holidays = holidays.slice(offset, offset + limit);
        }

        return holidays;
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
