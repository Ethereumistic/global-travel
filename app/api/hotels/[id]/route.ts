import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const apiUrl = `https://live.planet.bg/api/v1/hotels/${id}/`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
            }
            throw new Error(`External API error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching hotel details:", error);
        return NextResponse.json(
            { error: "Failed to fetch hotel details" },
            { status: 500 }
        );
    }
}
