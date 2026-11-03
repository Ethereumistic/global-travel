import * as React from "react";
import { notFound } from "next/navigation";
import { HotelHeader } from "@/components/hotel/HotelHeader";
import { HotelGallery } from "@/components/hotel/HotelGallery";
import { HotelDescription } from "@/components/hotel/HotelDescription";
import { HotelFacilities } from "@/components/hotel/HotelFacilities";
import { HotelInfo } from "@/components/hotel/HotelInfo";
import { HotelBookingSidebar } from "@/components/hotel/HotelBookingSidebar";

import type { Metadata } from "next";
import { getHotelById } from '@/lib/planet-details';

export const revalidate = 3600;

export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const hotel = await getHotelById(id);

    if (!hotel) {
        return {
            title: "Хотел | Global Travel",
        };
    }

    const description = hotel.description
        ? hotel.description.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
        : `Хотел ${hotel.name} - Global Travel`;

    return {
        title: hotel.name,
        description: description,
        openGraph: {
            title: hotel.name,
            description: description,
            images: hotel.main_image ? [hotel.main_image.image] : [],
        },
    };
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
