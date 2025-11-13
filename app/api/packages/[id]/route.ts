// app/api/packages/[id]/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// --- Expanded Type Definitions for Package Detail ---

export type PackageDetail = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  overnights: number;
  transport: string;
  countries: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
  minPrice: {
    price: string;
    priceNote: string;
    priceNoteShort: string;
  };
  board?: string;
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
    details?: string;
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

// --- Helper Functions ---

function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  
  let result = text.replace(/&[#\w]+;/g, (match) => {
    if (match.startsWith('&#x')) {
      const hex = match.slice(3, -1);
      return String.fromCharCode(parseInt(hex, 16));
    } else if (match.startsWith('&#')) {
      const decimal = match.slice(2, -1);
      return String.fromCharCode(parseInt(decimal, 10));
    }
    return entities[match] || match;
  });

  // Filter out <p> and </p> tags, handling attributes in the opening tag.
  result = result.replace(/<p\b[^>]*>|<\/p>/gi, ''); 

  // NEW: Filter out <div> and <h2> tags, handling attributes in the opening tag.
  // This will eliminate the user's pattern: <div style='...'><h2>...</h2></div>
  result = result.replace(/<(div|h2)\b[^>]*>|<\/(div|h2)>/gi, '');
  
  return result;
}

async function fetchXML(url: string): Promise<any> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Accept": "application/xml, text/xml, */*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch XML: ${response.statusText} (URL: ${url})`);
  }

  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder("windows-1251");
  const xmlText = decoder.decode(buffer);

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
    processEntities: false,
  });

  return parser.parse(xmlText);
}

function normalizeArray<T>(data: T | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

// --- GET Function for Single Package Detail ---

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;

  console.log("Fetching package with ID:", id);

  if (!id) {
    return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
  }

  try {
    // Fetch the specific package details
    const detailXml = await fetchXML(
      `https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Package/${id}`
    );

    const pkg = detailXml?.Package;

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Parse images
    const images = normalizeArray(pkg.Images?.Image).map((img: any) => img.Url || img);

    // Parse countries
    const countries = normalizeArray(pkg.Countries?.Country).map((c: any) => ({
      id: String(c.Id || Math.random()),
      name: decodeHtmlEntities(c.Name || "")
    }));

    // Parse cities
    const cities = normalizeArray(pkg.Cities?.City).map((c: any) => ({
      id: String(c.Id || Math.random()),
      name: decodeHtmlEntities(c.Name || "")
    }));

    // Parse daily schedule
    const dailySchedule = normalizeArray(pkg.DailySchedule?.Day).map((day: any) => ({
      id: String(day.Id || Math.random()),
      title: decodeHtmlEntities(day.Title || ""),
      details: decodeHtmlEntities(day.Details || "")
    }));

    // Parse hotels
    const hotels = normalizeArray(pkg.Hotels?.Hotel).map((hotel: any) => {
      const hotelImages = normalizeArray(hotel.Images?.Image).map((img: any) => img.Url || img);
      
      return {
        id: String(hotel.Id || Math.random()),
        name: decodeHtmlEntities(hotel.Name || ""),
        country: decodeHtmlEntities(hotel.Country?.Name || ""),
        city: decodeHtmlEntities(hotel.City?.Name || ""),
        website: hotel.Website || undefined,
        images: hotelImages,
        overview: hotel.Overview ? decodeHtmlEntities(hotel.Overview) : undefined,
        details: hotel.Details ? decodeHtmlEntities(hotel.Details) : undefined,
        board: hotel.Board?.Name ? decodeHtmlEntities(hotel.Board.Name) : undefined,
        minPriceInDouble: hotel.MinPriceInDouble || undefined,
        currency: hotel.Currency || undefined
      };
    });

    // Parse additional payments
    const additionalPayments = normalizeArray(pkg.AdditionalPayments?.AdditionalPayment).map((payment: any) => ({
      title: decodeHtmlEntities(payment.Title || ""),
      price: String(payment.Price || ""),
      currency: payment.Currency || "BGN"
    }));

    // Parse additional excursions - FIXED: using AdditionalExcursion not Excursion
    const additionalExcursions = normalizeArray(pkg.AdditionalExcursions?.AdditionalExcursion).map((excursion: any) => {
      const excursionImages = normalizeArray(excursion.Images?.Image).map((img: any) => img.Url || img);
      
      return {
        id: String(excursion.Id || Math.random()),
        title: decodeHtmlEntities(excursion.Title || ""),
        subtitle: excursion.Subtitle ? decodeHtmlEntities(excursion.Subtitle) : undefined,
        type: excursion.Type ? decodeHtmlEntities(excursion.Type) : undefined,
        price: excursion.Price ? decodeHtmlEntities(excursion.Price) : undefined,
        images: excursionImages,
        overview: excursion.Overview ? decodeHtmlEntities(excursion.Overview) : undefined,
        details: excursion.Details ? decodeHtmlEntities(excursion.Details) : undefined
      };
    });

    // Build the complete package detail
    const packageDetail: PackageDetail = {
      id: String(pkg.Id),
      title: decodeHtmlEntities(pkg.Title || ""),
      subtitle: pkg.Subtitle ? decodeHtmlEntities(pkg.Subtitle) : "",
      duration: pkg.Duration || 0,
      overnights: pkg.Overnights || 0,
      transport: decodeHtmlEntities(pkg.Transport?.Name || ""),
      countries,
      cities,
      minPrice: {
        price: decodeHtmlEntities(pkg.MinPrice?.Price || ""),
        priceNote: pkg.MinPrice?.PriceNote ? decodeHtmlEntities(pkg.MinPrice.PriceNote) : "",
        priceNoteShort: pkg.MinPrice?.PriceNoteShort ? decodeHtmlEntities(pkg.MinPrice.PriceNoteShort) : ""
      },
      board: pkg.Board?.Name ? decodeHtmlEntities(pkg.Board.Name) : undefined,
      priceNote1: pkg.PriceNote1 ? decodeHtmlEntities(pkg.PriceNote1) : undefined,
      priceNote2: pkg.PriceNote2 ? decodeHtmlEntities(pkg.PriceNote2) : undefined,
      images,
      period: {
        from: pkg.Period?.FromDate || "",
        to: pkg.Period?.ToDate || ""
      },
      overview: pkg.Overview ? decodeHtmlEntities(pkg.Overview) : undefined,
      additionalConditions: pkg.AdditionalConditions ? decodeHtmlEntities(pkg.AdditionalConditions) : undefined,
      dailySchedule,
      hotels,
      additionalPayments,
      additionalExcursions
    };

    console.log("Successfully parsed package:", packageDetail.id);
    console.log("Images count:", packageDetail.images.length);
    console.log("Hotels count:", packageDetail.hotels.length);
    console.log("Daily schedule count:", packageDetail.dailySchedule.length);

    return NextResponse.json(packageDetail, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      },
    });

  } catch (error) {
    console.error(`API Route Error (Package ID: ${id}):`, error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    if (error instanceof Error && error.message.includes("404")) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch package details" },
      { status: 500 }
    );
  }
} 