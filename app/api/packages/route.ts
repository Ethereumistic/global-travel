// app/api/packages/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import {
  adaptNewApiPackage,
  adaptXmlPackage,
  NewApiPackage,
  UnifiedPackage,
  XmlPackage,
} from "@/lib/type-adapters";

// --- Helper Functions ---

async function fetchXML(url: string): Promise<any> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Accept": "application/xml, text/xml, */*" },
  });
  if (!response.ok) throw new Error(`Failed to fetch XML: ${response.statusText}`);
  
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder("windows-1251");
  const xmlText = decoder.decode(buffer);
  
  const parser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true, processEntities: false });
  return parser.parse(xmlText);
}

function normalizeArray<T>(data: T | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

// --- XML API Functions ---

function parsePackagesXml(packagesXml: any): XmlPackage[] {
  const packages = packagesXml?.Packages?.Package;
  return normalizeArray(packages);
}

async function enrichAndAdaptXmlPackage(pkg: XmlPackage): Promise<UnifiedPackage | null> {
  try {
    const detailXml = await fetchXML(`https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Package/${pkg.Id}`);
    const images = detailXml?.Package?.Images?.Image;
    const imageArray = normalizeArray(images);
    const thumbnail = imageArray.length > 0 ? imageArray[0].Url : null;
    
    return adaptXmlPackage(pkg, thumbnail);
  } catch (error) {
    console.warn(`XML Package ${pkg.Id} (${pkg.Title}) failed to fetch details. Skipping. Error:`, (error as Error).message);
    return null;
  }
}

// --- New JSON API Functions ---

async function fetchNewApiPackages(): Promise<UnifiedPackage[]> {
    try {
        const response = await fetch("https://live.planet.bg/api/v1/holidays/?limit=20&offset=0", {
            cache: "no-store",
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch new API: ${response.statusText}`);
        }
        const data = await response.json();
        const holidays = data.holidays as NewApiPackage[];
        
        return holidays.map(adaptNewApiPackage);

    } catch (error) {
        console.error("Failed to fetch or adapt packages from new API:", error);
        return []; // Return empty array on error
    }
}


// --- Main GET Handler ---

export async function GET() {
  try {
    // 1. Fetch and process data from the old XML API
    const packagesXml = await fetchXML("https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Packages");
    const xmlPackagesRaw = parsePackagesXml(packagesXml);
    const xmlPackagesToProcess = xmlPackagesRaw.slice(0, 20);
    
    const enrichedXmlPackagesResults = await Promise.all(
      xmlPackagesToProcess.map(pkg => enrichAndAdaptXmlPackage(pkg))
    );
    const validXmlPackages = enrichedXmlPackagesResults.filter((p): p is UnifiedPackage => p !== null);

    // 2. Fetch and process data from the new JSON API
    const newApiPackages = await fetchNewApiPackages();

    // 3. Combine the results
    const combinedPackages = [...validXmlPackages, ...newApiPackages];

    // 4. Sort by a common property if desired, e.g., title
    combinedPackages.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(combinedPackages, {
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
