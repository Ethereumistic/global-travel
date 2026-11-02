"use server";

import { pageRequest } from "@/lib/catalogue";
import { holidayPage, holidayDestinations } from "@/lib/planet";
import type { HolidayCardData, Holiday } from "@/lib/types-holiday";

export async function getHolidayPage(limit = 12, offset = 0, country: string | null = null) {
    const request = pageRequest(limit, offset, country);
    return holidayPage(request.limit, request.offset, request.country);
}

export async function getHolidays(limit = 12, offset = 0, country: string | null = null): Promise<HolidayCardData[]> {
    const page = await getHolidayPage(limit, offset, country);
    return page.items;
}

export async function getHolidayDestinations() {
    return holidayDestinations();
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
