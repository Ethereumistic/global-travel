"use server";

import { Holiday } from "@/lib/types-holiday";

export async function getHolidays(limit = 12, offset = 0, country: string | null = null): Promise<Holiday[]> {
    try {
        let apiUrl = `https://live.planet.bg/api/v1/holidays/?limit=${limit}&offset=${offset}`;

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
        }

        return holidays;
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
}
