import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Default to 100 items if not specified, to get a good list for filtering
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const apiUrl = `https://live.planet.bg/api/v1/holidays/?limit=${limit}&offset=${offset}`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
            },
            // Revalidate every hour
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            throw new Error(`External API error: ${res.statusText}`);
        }

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return NextResponse.json(
            { error: "Failed to fetch holidays" },
            { status: 500 }
        );
    }
}
