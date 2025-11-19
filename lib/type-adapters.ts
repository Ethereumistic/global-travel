// lib/type-adapters.ts

import {
  HotelDetailSection,
} from "@/app/[locale]/excursions/[id]/types";
import { parseHotelDetails } from "@/app/[locale]/excursions/[id]/utils/hotelDetailsParser";

// --- Helper for Flags ---
function generateFlagUrl(isoCode?: string): string | null {
  if (!isoCode) return null;
  // Ensure we trim and lowercase the code (e.g., "DE" -> "de")
  return `https://flagcdn.com/48x36/${isoCode.toLowerCase().trim()}.png`;
}

// --- 1. Unified Type Definitions ---

export type CountryData = {
  name: string;
  isoCode?: string;
  flagUrl?: string | null;
};

export type UnifiedPackage = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  overnights: number;
  transport: string;
  countries: CountryData[];
  cities: string[];
  minPrice: string;
  priceNote: string;
  thumbnail: string | null;
  period: {
    from: string;
    to: string;
  };
  source: 'xml' | 'newApi';
};

export type UnifiedPackageDetail = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  overnights: number;
  transport: string;
  countries: Array<{ id: string; name: string; iso?: string; flagUrl?: string | null }>;
  cities: Array<{ id: string; name: string }>;
  minPrice: {
    price: string;
    priceNote: string;
    priceNoteShort: string;
  };
  board?: string;
  
  includes: string[];
  excludes: string[];

  priceNote1?: string;
  priceNote2?: string;
  images: string[];
  period: {
    from: string;
    to: string;
  };
  overview?: string;
  additionalConditions?: string;
  dailySchedule: Array<{
    id: string;
    title: string;
    details: string;
  }>;
  hotels: Array<{
    id: string;
    name: string;
    country: string;
    city: string;
    website?: string;
    images: string[];
    overview?: string;
    detailsSections: HotelDetailSection[];
    board?: string;
    minPriceInDouble?: number;
    currency?: string;
  }>;
  additionalPayments: Array<{
    title: string;
    price: string;
    currency: string;
  }>;
  additionalExcursions: Array<{
    id: string;
    title: string;
    subtitle?: string;
    type?: string;
    price?: string;
    images: string[];
    overview?: string;
    details?: string;
  }>;
};


// --- 2. Raw Type Definitions for the APIs ---

export type XmlPackage = any; 

export type NewApiPackage = {
  id: string;
  main_image: { image: string } | null;
  title: string;
  subtitle: string | null;
  route: string | null;
  transport: string;
  available_from: string;
  available_to: string;
  duration: number;
  nights: number;
  min_price: { value: number; display_currency: string };
  country: { 
    name: string; 
    iso_code?: string; 
    // FIXED: Added 'country' field which actually holds the ISO code (e.g., "DE")
    country?: string; 
    id?: string; 
  }; 
};

// --- Definition for the daily program item in New API ---
type DailyProgramItem = {
  day: string;
  description: string;
  destinations: Array<{
    destination_name_str: string;
  }>;
};

export type NewApiPackageDetail = NewApiPackage & {
    images: Array<{ image: string }>;
    description: string; 
    programme: Record<string, string>; 
    included?: Array<{ text: string }>;
    not_included?: Array<{ text: string }>;
    daily_program?: DailyProgramItem[];
};


// --- 3. Helper Functions ---

function decodeHtmlEntities(text: string): string {
    if (!text) return "";
    const entities: Record<string, string> = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&bdquo': '"', '&rdquo': '"'
    };
    let result = text.replace(/&[#\w]+;/g, (match) => {
      if (match.startsWith('&#x')) return String.fromCharCode(parseInt(match.slice(3, -1), 16));
      if (match.startsWith('&#')) return String.fromCharCode(parseInt(match.slice(2, -1), 10));
      return entities[match] || match;
    });
    result = result.replace(/<p\b[^>]*>|<\/p>/gi, '\n');
    result = result.replace(/<(div|h2)\b[^>]*>|<\/(div|h2)>/gi, '');
    result = result.replace(/<br\s*\/?>/gi, '\n');
    return result;
}

function normalizeArray<T>(data: T | T[] | undefined): T[] {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
}


// --- 4. Adapter Functions ---

export function adaptXmlPackage(pkg: XmlPackage, thumbnail: string | null): UnifiedPackage {
  const countries: CountryData[] = normalizeArray(pkg.Countries?.Country).map(c => ({
      name: decodeHtmlEntities(c.Name),
      isoCode: undefined, 
      flagUrl: null
  }));
  const cities = normalizeArray(pkg.Cities?.City).map(c => decodeHtmlEntities(c.Name));
  
  return {
    id: pkg.Id,
    title: decodeHtmlEntities(pkg.Title),
    subtitle: pkg.Subtitle ? decodeHtmlEntities(pkg.Subtitle) : "",
    duration: pkg.Duration,
    overnights: pkg.Overnights,
    transport: decodeHtmlEntities(pkg.Transport?.Name || ""),
    countries,
    cities,
    minPrice: decodeHtmlEntities(pkg.MinPrice?.Price || ""),
    priceNote: pkg.MinPrice?.PriceNoteShort ? decodeHtmlEntities(pkg.MinPrice.PriceNoteShort) : "",
    thumbnail,
    period: { from: pkg.Period?.FromDate || "", to: pkg.Period?.ToDate || "" },
    source: 'xml',
  };
}

export function adaptNewApiPackage(pkg: NewApiPackage): UnifiedPackage {
  const cities = pkg.route ? pkg.route.split(" - ") : [];
  
  // FIXED: Check 'iso_code' OR 'country' (which contains "DE")
  const rawIso = pkg.country?.iso_code || pkg.country?.country;
  // Only use it if it looks like a 2-letter ISO code (avoids using full names or IDs)
  const isoCode = (rawIso && rawIso.length === 2) ? rawIso : undefined;
  
  const flagUrl = generateFlagUrl(isoCode);

  return {
    id: pkg.id,
    title: pkg.title,
    subtitle: pkg.subtitle || "",
    duration: pkg.duration,
    overnights: pkg.nights,
    transport: pkg.transport === "Bus" ? "Автобус" : (pkg.transport === "Airplane" ? "Самолет" : pkg.transport),
    countries: [{ 
        name: pkg.country.name, 
        isoCode: isoCode,
        flagUrl: flagUrl
    }],
    cities: cities,
    minPrice: `${pkg.min_price.value} ${pkg.min_price.display_currency}`,
    priceNote: "",
    thumbnail: pkg.main_image?.image || null,
    period: { from: pkg.available_from, to: pkg.available_to },
    source: 'newApi',
  };
}

export function adaptXmlPackageDetail(pkg: XmlPackage): UnifiedPackageDetail {
    const hotels = normalizeArray(pkg.Hotels?.Hotel).map((hotel: any) => {
        const rawDetails = hotel.Details ? decodeHtmlEntities(hotel.Details) : null;
        return {
          id: String(hotel.Id || Math.random()),
          name: decodeHtmlEntities(hotel.Name || ""),
          country: decodeHtmlEntities(hotel.Country?.Name || ""),
          city: decodeHtmlEntities(hotel.City?.Name || ""),
          website: hotel.Website || undefined,
          images: normalizeArray(hotel.Images?.Image).map((img: any) => img.Url || img),
          overview: hotel.Overview ? decodeHtmlEntities(hotel.Overview) : undefined,
          detailsSections: parseHotelDetails(rawDetails),
          board: hotel.Board?.Name ? decodeHtmlEntities(hotel.Board.Name) : undefined,
          minPriceInDouble: hotel.MinPriceInDouble || undefined,
          currency: hotel.Currency || undefined
        };
    });

    return {
        id: String(pkg.Id),
        title: decodeHtmlEntities(pkg.Title || ""),
        subtitle: pkg.Subtitle ? decodeHtmlEntities(pkg.Subtitle) : "",
        duration: pkg.Duration || 0,
        overnights: pkg.Overnights || 0,
        transport: decodeHtmlEntities(pkg.Transport?.Name || ""),
        countries: normalizeArray(pkg.Countries?.Country).map((c: any) => ({ 
            id: String(c.Id || Math.random()), 
            name: decodeHtmlEntities(c.Name || "") 
        })),
        cities: normalizeArray(pkg.Cities?.City).map((c: any) => ({ 
            id: String(c.Id || Math.random()), 
            name: decodeHtmlEntities(c.Name || "") 
        })),
        minPrice: {
            price: decodeHtmlEntities(pkg.MinPrice?.Price || ""),
            priceNote: pkg.MinPrice?.PriceNote ? decodeHtmlEntities(pkg.MinPrice.PriceNote) : "",
            priceNoteShort: pkg.MinPrice?.PriceNoteShort ? decodeHtmlEntities(pkg.MinPrice.PriceNoteShort) : ""
        },
        board: pkg.Board?.Name ? decodeHtmlEntities(pkg.Board.Name) : undefined,
        
        includes: [],
        excludes: [],

        priceNote1: pkg.PriceNote1 ? decodeHtmlEntities(pkg.PriceNote1) : undefined,
        priceNote2: pkg.PriceNote2 ? decodeHtmlEntities(pkg.PriceNote2) : undefined,
        images: normalizeArray(pkg.Images?.Image).map((img: any) => img.Url || img),
        period: { from: pkg.Period?.FromDate || "", to: pkg.Period?.ToDate || "" },
        overview: pkg.Overview ? decodeHtmlEntities(pkg.Overview) : undefined,
        additionalConditions: pkg.AdditionalConditions ? decodeHtmlEntities(pkg.AdditionalConditions) : undefined,
        
        // XML API Mapping
        dailySchedule: normalizeArray(pkg.DailySchedule?.Day).map((day: any) => ({ 
            id: String(day.Id || Math.random()), 
            title: decodeHtmlEntities(day.Title || ""), 
            details: decodeHtmlEntities(day.Details || "") 
        })),
        
        hotels,
        additionalPayments: normalizeArray(pkg.AdditionalPayments?.AdditionalPayment).map((p: any) => ({ 
            title: decodeHtmlEntities(p.Title || ""), 
            price: String(p.Price || ""), 
            currency: p.Currency || "BGN" 
        })),
        additionalExcursions: normalizeArray(pkg.AdditionalExcursions?.AdditionalExcursion).map((e: any) => ({
            id: String(e.Id || Math.random()),
            title: decodeHtmlEntities(e.Title || ""),
            subtitle: e.Subtitle ? decodeHtmlEntities(e.Subtitle) : undefined,
            type: e.Type ? decodeHtmlEntities(e.Type) : undefined,
            price: e.Price ? decodeHtmlEntities(e.Price) : undefined,
            images: normalizeArray(e.Images?.Image).map((img: any) => img.Url || img),
            overview: e.Overview ? decodeHtmlEntities(e.Overview) : undefined,
            details: e.Details ? decodeHtmlEntities(e.Details) : undefined
        }))
    };
}

export function adaptNewApiPackageDetail(pkg: NewApiPackageDetail): UnifiedPackageDetail {
    let dailySchedule: Array<{ id: string; title: string; details: string }> = [];

    if (pkg.daily_program && Array.isArray(pkg.daily_program)) {
        dailySchedule = pkg.daily_program.map((item) => {
            let title = `Ден ${item.day}`;
            if (item.destinations && item.destinations.length > 0) {
                title = item.destinations.map(d => d.destination_name_str).join(" - ");
            }
            return {
                id: item.day,
                title: title,
                details: decodeHtmlEntities(item.description || ""),
            };
        });
    } else if (pkg.programme) {
        dailySchedule = Object.entries(pkg.programme).map(([day, details], index) => ({
            id: `day-${index + 1}`,
            title: day,
            details: details,
        }));
    }

    // FIXED: Check 'iso_code' OR 'country' (which contains "DE")
    const rawIso = pkg.country?.iso_code || pkg.country?.country;
    const isoCode = (rawIso && rawIso.length === 2) ? rawIso : undefined;
    
    const flagUrl = generateFlagUrl(isoCode);

    return {
        id: pkg.id,
        title: pkg.title,
        subtitle: pkg.subtitle || "",
        duration: pkg.duration,
        overnights: pkg.nights,
        transport: pkg.transport === "Bus" ? "Автобус" : (pkg.transport === "Airplane" ? "Самолет" : pkg.transport),
        countries: [{ 
            id: pkg.country.name, 
            name: pkg.country.name,
            iso: isoCode,
            flagUrl: flagUrl
        }],
        cities: pkg.route ? pkg.route.split(" - ").map(c => ({ id: c, name: c })) : [],
        minPrice: {
            price: `${pkg.min_price.value} ${pkg.min_price.display_currency}`,
            priceNote: "",
            priceNoteShort: ""
        },
        images: pkg.images?.map(i => i.image) || [],
        period: { from: pkg.available_from, to: pkg.available_to },
        overview: pkg.description || pkg.subtitle || undefined, 
        dailySchedule,
        includes: pkg.included ? pkg.included.map(i => i.text) : [],
        excludes: pkg.not_included ? pkg.not_included.map(i => i.text) : [],
        hotels: [], 
        additionalPayments: [],
        additionalExcursions: [],
        board: undefined, 
        priceNote1: undefined, 
        priceNote2: undefined, 
        additionalConditions: undefined,
    };
}