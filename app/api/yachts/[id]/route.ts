// app/api/yachts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiUrl = `https://live.planet.bg/api/v1/yachts/${id}/`;

  try {
    const res = await fetch(apiUrl, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching yacht: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching yacht detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch yacht data" },
      { status: 500 }
    );
  }
}