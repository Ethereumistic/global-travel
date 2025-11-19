// app/api/yachts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Default to 9 items, offset 0 if not specified
  const limit = searchParams.get("limit") || "9";
  const offset = searchParams.get("offset") || "0";

  const apiUrl = `https://live.planet.bg/api/v1/yachts/?limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      // Revalidate every hour or use 'no-store' if you need real-time
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) {
      throw new Error(`External API error: ${res.statusText}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching yachts:", error);
    return NextResponse.json(
      { error: "Failed to fetch yachts" },
      { status: 500 }
    );
  }
}