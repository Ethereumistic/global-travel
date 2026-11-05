import 'server-only';

import { getYachtById as readYacht } from "@/lib/planet-details";
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
    return readYacht(id);
}
