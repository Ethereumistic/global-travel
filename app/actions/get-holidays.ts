import 'server-only';

import { getHolidayById as readHoliday } from "@/lib/planet-details";
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
    return readHoliday(id);
}
