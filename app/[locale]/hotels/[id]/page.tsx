import * as React from "react";
import { notFound } from "next/navigation";
import { HotelHeader } from "@/components/hotel/HotelHeader";
import { HotelGallery } from "@/components/hotel/HotelGallery";
import { HotelDescription } from "@/components/hotel/HotelDescription";
import { HotelFacilities } from "@/components/hotel/HotelFacilities";
import { HotelInfo } from "@/components/hotel/HotelInfo";
import { HotelBookingSidebar } from "@/components/hotel/HotelBookingSidebar";
import type { Hotel } from "@/lib/types-hotel";

// Helper to fetch hotel data
async function getHotelById(id: string): Promise<Hotel | null> {
    try {
        // Use absolute URL for server-side fetch if needed, but here we can use the same logic as the API route
        // or call the external API directly to avoid self-request issues during build/runtime
        const apiUrl = `https://live.planet.bg/api/v1/hotels/${id}/`;
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error fetching hotel:", error);
        return null;
    }
}

export default async function HotelDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const hotel = await getHotelById(id);

    if (!hotel) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-2">
            {/* Header */}
            <HotelHeader hotel={hotel} />

            {/* Gallery */}
            {(hotel.main_image || (hotel.images && hotel.images.length > 0)) && (
                <div className="max-w-6xl mx-auto mt-2 relative z-20 px-4">
                    <HotelGallery
                        mainImage={hotel.main_image}
                        images={hotel.images || []}
                        title={hotel.name}
                    />
                </div>
            )}

            <div className="max-w-6xl mx-auto mt-2 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Description */}
                        <HotelDescription description={hotel.description} />

                        {/* Facilities */}
                        <HotelFacilities facilities={hotel.facilities} />

                        {/* Info (Policies, Fees) */}
                        <HotelInfo hotel={hotel} />
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div id="booking-sidebar" className="lg:col-span-2 lg:-translate-x-4">
                        <HotelBookingSidebar hotel={hotel} />
                    </div>

                </div>
            </div>
        </div>
    );
}
