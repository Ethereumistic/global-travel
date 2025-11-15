import { NextResponse } from "next/server";
import { ALL_COUNTRIES } from "@/lib/constants"; // Assuming constants.ts is in lib/
import { XMLParser } from "fast-xml-parser";

// --- Тип за дестинация (както преди) ---
export interface DestinationListItem {
  id: string; // Използваме абревиатурата на държавата
  name: string; // Име на държавата
  abbr: string; // Абревиатура на държавата
  continent: string;
  cities: string[]; // Списък с градове в тази държава
}

// --- Типове и помощни функции, копирани от /api/packages/route.ts ---
// Това е необходимо, за да можем да извлечем и обработим същите данни
// ---

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

async function enrichPackageWithThumbnail(pkg: XmlPackage): Promise<PackageListItem | null> {
  let thumbnail: string | null = null;

  try {
    const detailXml = await fetchXML(
      `https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Package/${pkg.Id}`
    );
    
    const images = detailXml?.Package?.Images?.Image;
    const imageArray = normalizeArray(images);
    
    if (imageArray.length > 0) {
      thumbnail = imageArray[0].Url;
    }
    
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
    console.warn(`Package ${pkg.Id} (${pkg.Title}) failed to fetch details. Skipping. Error:`, (error as Error).message);
    return null;
  }
}

// --- НОВ GET ХЕНДЛЪР за /api/destinations ---

export async function GET() {
  try {
    // 1. Извличаме всички пакети, точно както прави /api/packages
    const packagesXml = await fetchXML(
      "https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Packages"
    );

    const packages = parsePackages(packagesXml);
    // Обработваме *всички* пакети, не само първите 20, за да получим всички дестинации
    const enrichedPackagesResults = await Promise.all(
      packages.map(pkg => enrichPackageWithThumbnail(pkg))
    );

    const validPackages = enrichedPackagesResults.filter(
        (pkg): pkg is PackageListItem => pkg !== null
    );

    // 2. Агрегираме данните
    // Използваме Map за събиране на уникални градове за всяка държава
    const destinationMap = new Map<string, {
      countryData: (typeof ALL_COUNTRIES)[0];
      cities: Set<string>;
    }>();

    for (const pkg of validPackages) {
      for (const countryName of pkg.countries) {
        // Намираме съответната държава в нашия константен списък
        const countryInfo = ALL_COUNTRIES.find(c => c.name === countryName);

        if (countryInfo) {
          // Ако държавата още я няма в Map-a, я добавяме
          if (!destinationMap.has(countryName)) {
            destinationMap.set(countryName, {
              countryData: countryInfo,
              cities: new Set<string>(),
            });
          }

          // Добавяме всички градове от този пакет към Set-a на държавата
          // Set() автоматично се грижи за дублажите
          const entry = destinationMap.get(countryName)!;
          pkg.cities.forEach(city => entry.cities.add(city));
        }
        // else {
        //   console.warn(`Country "${countryName}" from package ${pkg.id} not found in ALL_COUNTRIES`);
        // }
      }
    }

    // 3. Преобразуваме Map-a в масив от DestinationListItem
    const destinations: DestinationListItem[] = Array.from(destinationMap.values())
      .map(entry => ({
        id: entry.countryData.abbr,
        name: entry.countryData.name,
        abbr: entry.countryData.abbr,
        continent: entry.countryData.continent,
        cities: Array.from(entry.cities).sort((a, b) => a.localeCompare(b, 'bg')), // Сортираме градовете
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'bg')); // Сортираме държавите

    return NextResponse.json(destinations, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Кешираме за 1 час
      },
    });

  } catch (error) {
    console.error("API Route Error (Destinations):", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}