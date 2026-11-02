import 'server-only';
import { unstable_cache } from 'next/cache';
import { ALL_COUNTRIES } from './constants';
import { priceSortValue, readCompleteCatalogue, readVisiblePage, sliceCatalogue } from './catalogue';
import type { Holiday, HolidayCardData } from './types-holiday';
import type { Hotel } from './types-hotel';
import type { Yacht, YachtCardData } from './types-yacht';

export const CATALOGUE_TTL = 3600;
const RESULT_TTL = 300;
const API = 'https://live.planet.bg/api/v1/';
const INDEX_CHUNK_SIZE = 100;

interface PlanetCountry { id: string; name: string; iso: string }

async function json<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Planet API ${path.split('?')[0]} returned ${response.status}`);
  return response.json() as Promise<T>;
}

function rows<T>(value: unknown, key: string): { items: T[]; total: number } {
  if (!value || typeof value !== 'object') throw new Error('Invalid Planet API response');
  const data = value as Record<string, unknown>;
  const total = data.total_count ?? data.count;
  if (!Array.isArray(data[key]) || typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) {
    throw new Error('Invalid Planet API pagination');
  }
  return { items: data[key] as T[], total };
}

export const getPlanetCountries = unstable_cache(async (): Promise<PlanetCountry[]> => {
  const data = await json<PlanetCountry[]>('countries/');
  if (!Array.isArray(data) || data.some(c => !c.id || !c.name || !/^[A-Z]{2}$/.test(c.iso))) {
    throw new Error('Invalid Planet country directory');
  }
  return data;
}, ['planet-countries-v1'], { revalidate: CATALOGUE_TTL });

function destinations(countries: { code: string; name: string }[]) {
  const unique = new Map<string, { value: string; label: string }>();
  for (const { code, name } of countries) {
    const value = code.toLowerCase();
    if (value && !unique.has(value)) {
      unique.set(value, { value, label: ALL_COUNTRIES.find(c => c.abbr === value)?.name || name });
    }
  }
  return [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, 'bg'));
}

// Only compact card fields are cached, never descriptions, inventory or galleries.
// Chunks stay small enough for the Next.js Data Cache as catalogues grow.
const holidayChunk = unstable_cache(async (offset: number) => {
  const page = rows<Holiday>(await json(`holidays/?limit=${INDEX_CHUNK_SIZE}&offset=${offset}`), 'holidays');
  return { ...page, items: page.items.map((h): HolidayCardData => ({
    id: h.id, title: h.title, subtitle: h.subtitle, main_image: h.main_image,
    min_price: h.min_price, country: h.country, route: h.route, transport: h.transport,
    duration: h.duration, available_from: h.available_from, available_to: h.available_to,
  })) };
}, ['planet-holiday-card-chunk-v1'], { revalidate: CATALOGUE_TTL });

const yachtChunk = unstable_cache(async (offset: number) => {
  const page = rows<Yacht>(await json(`yachts/?limit=${INDEX_CHUNK_SIZE}&offset=${offset}`), 'yachts');
  return { ...page, items: page.items.map((y): YachtCardData => ({
    id: y.id, name: y.name, main_image: y.main_image, min_price: y.min_price,
    country: y.country, home_port: y.home_port, guests: y.guests,
    cabins: y.cabins, wc: y.wc, available_as: y.available_as,
  })) };
}, ['planet-yacht-card-chunk-v1'], { revalidate: CATALOGUE_TTL });

async function holidays() {
  return (await readCompleteCatalogue(holidayChunk)).sort((a, b) => priceSortValue(a.min_price) - priceSortValue(b.min_price));
}

async function yachts() {
  return (await readCompleteCatalogue(yachtChunk)).sort((a, b) => priceSortValue(a.min_price) - priceSortValue(b.min_price));
}

// Cache the final small pages too: a hot request never deserializes a full index.
export const holidayPage = unstable_cache(async (limit: number, offset: number, country: string | null) => {
  const items = await holidays();
  return sliceCatalogue(country ? items.filter(h => h.country?.iso_code?.toLowerCase() === country) : items, limit, offset);
}, ['planet-holiday-page-v1'], { revalidate: RESULT_TTL });

export const yachtPage = unstable_cache(async (limit: number, offset: number, country: string | null) => {
  const items = await yachts();
  return sliceCatalogue(country ? items.filter(y => y.country?.toLowerCase() === country) : items, limit, offset);
}, ['planet-yacht-page-v1'], { revalidate: RESULT_TTL });

export const holidayDestinations = unstable_cache(async () => destinations(
  (await holidays()).filter(h => h.country?.iso_code).map(h => ({ code: h.country.iso_code!, name: h.country.name })),
), ['planet-holiday-destinations-v1'], { revalidate: RESULT_TTL });

export const yachtDestinations = unstable_cache(async () => destinations(
  (await yachts()).filter(y => y.country).map(y => ({ code: y.country!, name: y.country! })),
), ['planet-yacht-destinations-v1'], { revalidate: RESULT_TTL });

// Use the country directory, not the countries represented in the first 1,000 hotels.
export const hotelDestinations = unstable_cache(async () => destinations(
  (await getPlanetCountries()).map(c => ({ code: c.iso, name: c.name })),
), ['planet-hotel-destinations-v1'], { revalidate: CATALOGUE_TTL });

export const hotelPage = unstable_cache(async (limit: number, offset: number, country: string | null) => {
  const filter = country ? (await getPlanetCountries()).find(c => c.iso.toLowerCase() === country) : null;
  if (country && !filter) return { items: [], total: 0, nextOffset: null };
  return readVisiblePage(async (size, cursor) => {
    const query = new URLSearchParams({ limit: String(size), offset: String(cursor) });
    if (filter) query.set('country', filter.id);
    const page = rows<Hotel>(await json(`hotels/?${query}`), 'results');
    if (country && page.items.some(h => h.country_code?.toLowerCase() !== country)) {
      throw new Error('Planet API did not apply the hotel country filter');
    }
    return page;
  }, limit, offset, h => h.status === 'enabled');
}, ['planet-hotel-page-v1'], { revalidate: CATALOGUE_TTL });

export const holidayIds = unstable_cache(async () => (await holidays()).map(h => h.id),
  ['planet-holiday-ids-v1'], { revalidate: CATALOGUE_TTL });
export const yachtIds = unstable_cache(async () => (await yachts()).flatMap(y => y.id ? [y.id] : []),
  ['planet-yacht-ids-v1'], { revalidate: CATALOGUE_TTL });

// Sitemap partitions read a bounded upstream range; they never crawl all hotels.
export const hotelSitemapPage = unstable_cache(async (offset: number, limit: number) => {
  const page = rows<Hotel>(await json(`hotels/?limit=${limit}&offset=${offset}`), 'results');
  return { total: page.total, consumed: page.items.length, ids: page.items.filter(h => h.status === 'enabled').map(h => h.id) };
}, ['planet-hotel-sitemap-v1'], { revalidate: CATALOGUE_TTL });
