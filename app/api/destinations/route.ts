// app/api/destinations/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// --- Type Definitions ---
type Destination = {
  id: string;
  name: string;
  type: "Country" | "City";
  countryName: string;
};

type XmlCity = {
  Id: string;
  Name: string;
};

type XmlCountry = {
  Id: string;
  Name: string;
  Cities: {
    City: XmlCity | XmlCity[];
  };
};

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  
  return text
    .replace(/&[#\w]+;/g, (match) => {
      // Handle numeric entities like &#x410; (hex) or &#1040; (decimal)
      if (match.startsWith('&#x')) {
        const hex = match.slice(3, -1);
        return String.fromCharCode(parseInt(hex, 16));
      } else if (match.startsWith('&#')) {
        const decimal = match.slice(2, -1);
        return String.fromCharCode(parseInt(decimal, 10));
      }
      // Handle named entities
      return entities[match] || match;
    });
}

function parseDestinations(rawJson: any): Destination[] {
  const destinations: Destination[] = [];
  const countries: XmlCountry[] = rawJson?.Destinations?.Country || [];

  for (const country of countries) {
    destinations.push({
      id: `country-${country.Id}`,
      name: decodeHtmlEntities(country.Name),
      type: "Country",
      countryName: decodeHtmlEntities(country.Name),
    });

    const citiesRaw = country.Cities?.City;
    let cities: XmlCity[] = [];

    if (Array.isArray(citiesRaw)) {
      cities = citiesRaw;
    } else if (citiesRaw) {
      cities = [citiesRaw];
    }

    for (const city of cities) {
      destinations.push({
        id: `city-${city.Id}`,
        name: decodeHtmlEntities(city.Name),
        type: "City",
        countryName: decodeHtmlEntities(country.Name),
      });
    }
  }
  return destinations;
}

// --- GET Handler ---
export async function GET() {
  try {
    const response = await fetch(
      "https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Destinations",
      {
        cache: "no-store",
        headers: {
          "Accept": "application/xml, text/xml, */*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch XML: ${response.statusText}`);
    }

    // Get raw bytes
    const buffer = await response.arrayBuffer();

    // Decode from Windows-1251 (Cyrillic)
    const decoder = new TextDecoder("windows-1251");
    const xmlText = decoder.decode(buffer);

    // Parse XML with processEntities disabled to prevent double-encoding
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      processEntities: false, // Important: don't let the parser decode entities
    });
    const jsonObj = parser.parse(xmlText);

    const data = parseDestinations(jsonObj);

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch or parse destinations" },
      { status: 500 }
    );
  }
}