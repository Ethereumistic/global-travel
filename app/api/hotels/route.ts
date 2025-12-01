import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    try {
        const res = await fetch(
            `https://live.planet.bg/api/v1/hotels/?limit=${limit}&offset=${offset}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch hotels: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json({
            hotels: data.results || [],
            total: data.count || 0,
        });
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return NextResponse.json(
            { error: "Failed to fetch hotels" },
            { status: 500 }
        );
    }
}
