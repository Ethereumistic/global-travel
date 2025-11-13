// app/api/packages/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// --- Type Definitions ---
export type PackageListItem = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  overnights: number;
  transport: string;
  countries: string[];
  cities: string[];
  minPrice: string;
  priceNote: string;
  thumbnail: string | null;
  period: {
    from: string;
    to: string;
  };
};

export type XmlPackage = {
  Id: string;
  Title: string;
  Subtitle?: string;
  Duration: number;
  Overnights: number;
  Transport: {
    Name: string;
  };
  Period: {
    FromDate: string;
    ToDate: string;
  };
  Countries: {
    Country: { Name: string } | { Name: string }[];
  };
  Cities: {
    City: { Name: string } | { Name: string }[];
  };
  MinPrice: {
    Price: string;
    PriceNoteShort?: string;
  };
  Images?: {
    Image: { Url: string } | { Url: string }[];
  };
};

function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  
  return text.replace(/&[#\w]+;/g, (match) => {
    if (match.startsWith('&#x')) {
      const hex = match.slice(3, -1);
      return String.fromCharCode(parseInt(hex, 16));
    } else if (match.startsWith('&#')) {
      const decimal = match.slice(2, -1);
      return String.fromCharCode(parseInt(decimal, 10));
    }
    return entities[match] || match;
  });
}

async function fetchXML(url: string): Promise<any> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Accept": "application/xml, text/xml, */*",
    },
  });

  if (!response.ok) {
    // Тази грешка ще бъде хваната от enrichPackageWithThumbnail
    throw new Error(`Failed to fetch XML: ${response.statusText}`);
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

function parsePackages(packagesXml: any): XmlPackage[] {
  const packages = packagesXml?.Packages?.Package;
  return normalizeArray(packages);
}

// ПРОМЯНА: Функцията вече връща Promise<PackageListItem | null>
async function enrichPackageWithThumbnail(pkg: XmlPackage): Promise<PackageListItem | null> {
  let thumbnail: string | null = null;

  try {
    // Опитваме се да вземем детайлите (и thumbnail)
    const detailXml = await fetchXML(
      `https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Package/${pkg.Id}`
    );
    
    const images = detailXml?.Package?.Images?.Image;
    const imageArray = normalizeArray(images);
    
    if (imageArray.length > 0) {
      thumbnail = imageArray[0].Url;
    }
    
    // Ако успеем, връщаме пълния обект
    const countries = normalizeArray(pkg.Countries?.Country).map(c => decodeHtmlEntities(c.Name));
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
      period: {
        from: pkg.Period?.FromDate || "",
        to: pkg.Period?.ToDate || "",
      },
    };

  } catch (error) {
    // ПРОМЯНА: Ако има 404 или друга грешка, логваме я и връщаме null
    // Това ID е невалидно (връща 404) или има друг проблем
    console.warn(`Package ${pkg.Id} (${pkg.Title}) failed to fetch details. Skipping. Error:`, (error as Error).message);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch all packages
    const packagesXml = await fetchXML(
      "https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Packages"
    );

    const packages = parsePackages(packagesXml);
    const packagesToProcess = packages.slice(0, 20);
    
    const enrichedPackagesResults = await Promise.all(
      packagesToProcess.map(pkg => enrichPackageWithThumbnail(pkg))
    );

    // ПРОМЯНА: Филтрираме всички, които са върнали 'null'
    const validPackages = enrichedPackagesResults.filter(pkg => pkg !== null);

    return NextResponse.json(validPackages, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("API Route Error (Packages List):", error);
    return NextResponse.json(
      { error: "Failed to fetch packages list" },
      { status: 500 }
    );
  }
}