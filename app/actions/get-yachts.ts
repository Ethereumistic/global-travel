"use server";

import { pageRequest } from "@/lib/catalogue";
import { yachtPage, yachtDestinations } from "@/lib/planet";
import type { YachtCardData, Yacht } from "@/lib/types-yacht";

export async function getYachtPage(limit = 9, offset = 0, country: string | null = null) {
    const request = pageRequest(limit, offset, country);
    return yachtPage(request.limit, request.offset, request.country);
}

export async function getYachts(limit = 9, offset = 0, country: string | null = null): Promise<YachtCardData[]> {
    const page = await getYachtPage(limit, offset, country);
    return page.items;
}

export async function getYachtDestinations() {
    return yachtDestinations();
}

export async function getYachtById(id: string): Promise<Yacht | null> {
    try {
        const apiUrl = `https://live.planet.bg/api/v1/yachts/${id}/`;

        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
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
