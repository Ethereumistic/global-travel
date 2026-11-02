import type { CataloguePage } from './catalogue';
import type { HolidayCardData } from './types-holiday';
import type { Hotel } from './types-hotel';
import type { YachtCardData } from './types-yacht';

async function read<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Catalogue temporarily unavailable');
  return response.json() as Promise<T>;
}

function page<T>(kind: string, limit: number, offset: number, country?: string | null) {
  const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (country) query.set('country', country);
  return read<CataloguePage<T>>(`/api/catalogue/${kind}?${query}`);
}

export const getHolidayPage = (limit: number, offset: number, country?: string | null) => page<HolidayCardData>('holidays', limit, offset, country);
export const getHotelPage = (limit: number, offset: number, country?: string | null) => page<Hotel>('hotels', limit, offset, country);
export const getYachtPage = (limit: number, offset: number, country?: string | null) => page<YachtCardData>('yachts', limit, offset, country);

type Destination = { value: string; label: string };
export const getHolidayDestinations = () => read<Destination[]>('/api/catalogue/holidays/destinations');
export const getHotelDestinations = () => read<Destination[]>('/api/catalogue/hotels/destinations');
export const getYachtDestinations = () => read<Destination[]>('/api/catalogue/yachts/destinations');
