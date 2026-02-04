"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Yacht } from "@/lib/types-yacht";
import { getYachtById } from "@/app/actions/get-yachts";

// Components
import { YachtHeader } from "@/components/yacht/YachtHeader";
import { YachtGallery } from "@/components/yacht/YachtGallery";
import { YachtInventory } from "@/components/yacht/YachtInventory";
import { YachtSpecs } from "@/components/yacht/YachtSpecs";
import { SeasonalPricing } from "@/components/yacht/SeasonalPricing";
import { YachtBookingSidebar } from "@/components/yacht/YachtBookingSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Users, BedDouble, Droplets, Euro } from "lucide-react";


export default function YachtDetailClient({
    id,
    initialYacht,
    urlCountryCode
}: {
    id: string;
    initialYacht: Yacht | null;
    urlCountryCode?: string;
}) {
    const [yacht, setYacht] = React.useState<Yacht | null>(initialYacht);
    const [isLoading, setIsLoading] = React.useState(!initialYacht);

    React.useEffect(() => {
        if (initialYacht) return; // Skip fetch if we have initial data

        async function fetchYachtDetail() {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/yachts/${id}`);
                if (!response.ok) throw new Error("Error");
                const data = await response.json();
                setYacht(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchYachtDetail();
    }, [id, initialYacht]);

    if (isLoading || !yacht) return (
        <div className="min-h-screen bg-slate-50/50 pb-2">
            {/* Header Skeleton - Matches HolidayHeader height and positioning */}
            <div className="relative w-full h-96 -mt-20 overflow-hidden rounded-b-xl flex items-end">
                <Skeleton className="absolute inset-0 h-full w-full" />
                <div className="max-w-7xl relative z-10 mx-auto px-4 pb-24 md:pb-20 pt-20 w-full">
                    <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end gap-4 h-full">
                        <div className="space-y-4 max-w-7xl w-full">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
                                <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
                            </div>
                            <Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 bg-white/20" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-6 w-32 bg-white/20" />
                                <Skeleton className="h-6 w-24 bg-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Skeleton - Matches YachtGallery grid */}
            <div className="max-w-6xl mx-auto mt-2 relative z-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* Left: Main Carousel */}
                    <Skeleton className="w-full aspect-square lg:aspect-auto lg:h-[500px] rounded-xl lg:rounded-l-xl lg:rounded-r-none" />

                    {/* Right: Thumbnails Grid (Hidden on mobile) */}
                    <div className="hidden lg:grid grid-cols-2 gap-2 h-[500px]">
                        <Skeleton className="h-full w-full rounded-none" />
                        <Skeleton className="h-full w-full rounded-tr-xl" />
                        <Skeleton className="h-full w-full rounded-none" />
                        <Skeleton className="h-full w-full rounded-br-xl" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-2">
                {/* Info Grid Skeleton - Matches HolidayInfoGrid (5 cols max) */}
                <div className="grid gap-2 px-4 grid-cols-1 lg:grid-cols-2">
                    <div className="w-full max-w-6xl">
                        <div className="grid gap-2 mb-6 grid-cols-2 md:grid-cols-5">
                            {/* 5 Cards mimicking Date, Duration, Dest, Transport, Price */}
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl col-span-2 md:col-span-1" />
                        </div>
                    </div>
                    {/* Route Carousel Placeholder (only if route exists, but safe to show generic) */}
                    <div className="w-full hidden lg:block">
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 px-4 mt-5">
                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Description Skeleton */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                            <Skeleton className="h-7 w-32 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <div className="space-y-6">
                            {/* Tabs List */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                                <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                                <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                                <Skeleton className="h-10 w-28 rounded-lg shrink-0" />
                            </div>
                            {/* Tab Content */}
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <Skeleton className="h-6 w-1/3" />
                                    <div className="space-y-4">
                                        <Skeleton className="h-24 w-full rounded-lg" />
                                        <Skeleton className="h-24 w-full rounded-lg" />
                                        <Skeleton className="h-24 w-full rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR - Matches HolidayBookingSidebar */}
                    <div className="lg:col-span-2 lg:-translate-x-4">
                        <Card className="sticky top-24 border-0 shadow-xl ring-1 ring-slate-200 bg-white">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-7 w-3/4 mb-2" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-6 rounded-sm" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Trip Select */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-12 w-full rounded-md" />
                                </div>

                                {/* Guests */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-11 w-full rounded-md" />
                                </div>

                                <div className="h-px bg-slate-100 my-2" />

                                {/* Inputs */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-11 w-full rounded-md" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-11 w-full rounded-md" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-11 w-full rounded-md" />
                                    </div>
                                </div>

                                {/* Price Box */}
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mt-4 h-24 flex justify-between items-start">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>

                                {/* Submit Button */}
                                <Skeleton className="h-12 w-full rounded-md" />
                                <Skeleton className="h-3 w-48 mx-auto" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );

    const hasInventory = yacht.inventory && Object.keys(yacht.inventory).length > 0;
    const displayInventory = hasInventory ? yacht.inventory : (yacht.facilities || null);

    return (
        <>
            <YachtHeader yacht={yacht} />

            <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 -mt-6 relative z-20">
                <YachtGallery mainImage={yacht.main_image} images={yacht.images} title={yacht.name} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <Users className="h-6 w-6 text-primary mb-2" />
                                <span className="font-bold text-lg text-slate-800">{yacht.guests}</span>
                                <span className="text-xs text-muted-foreground uppercase font-medium">Гости</span>
                            </div>
                            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <BedDouble className="h-6 w-6 text-primary mb-2" />
                                <span className="font-bold text-lg text-slate-800">{yacht.cabins}</span>
                                <span className="text-xs text-muted-foreground uppercase font-medium">Каюти</span>
                            </div>
                            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <Droplets className="h-6 w-6 text-primary mb-2" />
                                <span className="font-semibold text-lg text-slate-800">WC</span>
                            </div>
                            <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <Euro className="h-6 w-6 text-primary mb-2" />
                                <span className="font-bold text-lg text-slate-800">{yacht.min_price.value}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-slate-600 leading-relaxed">
                            <p>{yacht.description}</p>
                        </div>

                        {/* Sticky Tabs Implementation */}
                        <div className="relative min-h-[500px]">
                            <Tabs defaultValue="inventory" className="w-full">
                                <div className="sticky top-20 z-30  backdrop-blur-sm py-2 -mx-1 px-1">
                                    <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg shadow-sm overflow-x-auto h-auto flex-wrap">
                                        <TabsTrigger value="inventory">Оборудване</TabsTrigger>
                                        <TabsTrigger value="specs">Характеристики</TabsTrigger>
                                        <TabsTrigger value="prices">Цени</TabsTrigger>
                                        {yacht.layouts?.length > 0 && (
                                            <TabsTrigger value="layout">Схема</TabsTrigger>
                                        )}
                                    </TabsList>
                                </div>

                                <div className="mt-4">
                                    <TabsContent value="inventory"><YachtInventory inventory={displayInventory} /></TabsContent>
                                    <TabsContent value="specs"><YachtSpecs specs={yacht.specs} /></TabsContent>
                                    <TabsContent value="prices"><SeasonalPricing prices={yacht.prices} /></TabsContent>
                                    <TabsContent value="layout">
                                        <div className="bg-white p-4 border rounded-xl shadow-sm">
                                            {yacht.layouts?.map((l) => (
                                                <div key={l.id} className="relative w-full h-[300px]">
                                                    <Image src={l.image} alt="Layout" fill className="object-contain" />
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <div id="booking-sidebar" className="lg:col-span-1">
                        <YachtBookingSidebar yacht={yacht} externalCountryCode={urlCountryCode} />
                    </div>

                </div>
            </div>
        </>
    );
}
