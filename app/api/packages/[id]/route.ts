// app/api/packages/[id]/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import {
  adaptXmlPackageDetail,
  adaptNewApiPackageDetail,
  NewApiPackageDetail,
  UnifiedPackageDetail,
} from "@/lib/type-adapters";

// --- Helper Functions ---

async function fetcher(url: string, isXml: boolean = false): Promise<any> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: isXml ? { "Accept": "application/xml, text/xml, */*" } : {},
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText} (URL: ${url})`);
  }

  if (isXml) {
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

  return response.json();
}

function isUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// --- GET Function for Single Package Detail ---

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
  }

  try {
    let packageDetail: UnifiedPackageDetail;

    if (isUuid(id)) {
      // --- Fetch from the New JSON API ---
      const url = `https://live.planet.bg/api/v1/holidays/${id}/`;
      const rawNewApiPackage = await fetcher(url) as NewApiPackageDetail;
      
      if (!rawNewApiPackage) {
        return NextResponse.json({ error: "Package not found from New API" }, { status: 404 });
      }
      
      packageDetail = adaptNewApiPackageDetail(rawNewApiPackage);

    } else {
      // --- Fetch from the Old XML API ---
      const url = `https://www.profitours.bg/api/xml/GLOBALTRAVELMENIDJMA/Package/${id}`;
      const detailXml = await fetcher(url, true);
      const pkg = detailXml?.Package;

      if (!pkg) {
        return NextResponse.json({ error: "Package not found from XML API" }, { status: 404 });
      }
      
      packageDetail = adaptXmlPackageDetail(pkg);
    }

    return NextResponse.json(packageDetail, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });

  } catch (error) {
    console.error(`API Route Error (Package ID: ${id}):`, error);
    return NextResponse.json(
      { error: "Failed to fetch package details" },
      { status: 500 }
    );
  }
}
