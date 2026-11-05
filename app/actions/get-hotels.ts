import 'server-only';

import { pageRequest } from "@/lib/catalogue";
import { hotelPage, hotelDestinations } from "@/lib/planet";
import type { Hotel } from "@/lib/types-hotel";

export async function getHotelPage(limit = 12, offset = 0, country: string | null = null) {
    const request = pageRequest(limit, offset, country);
    return hotelPage(request.limit, request.offset, request.country);
}

export async function getHotels(limit = 12, offset = 0, country: string | null = null): Promise<{ hotels: Hotel[]; total: number }> {
    const page = await getHotelPage(limit, offset, country);
    return { hotels: page.items, total: page.total };
}

export async function getHotelDestinations() {
    return hotelDestinations();
}
