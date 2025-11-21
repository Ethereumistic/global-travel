"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import type { Holiday } from "@/lib/types-holiday";
import { HolidayBookingSidebar } from "@/components/holiday/holiday-booking-sidebar";
import { HolidayHeader } from "@/components/holiday/HolidayHeader";
import { HolidayInfoGrid } from "@/components/holiday/HolidayInfoGrid";
import { HolidayProgram } from "@/components/holiday/HolidayProgram";
import { HolidayIncluded } from "@/components/holiday/HolidayIncluded";
import { HolidayAccommodations } from "@/components/holiday/HolidayAccommodations";
import { HolidayAdditionalServices } from "@/components/holiday/HolidayAdditionalServices";
import { CityRouteCarousel } from "@/components/holiday/CityRouteCarousel";
import { DateInfoWidget } from "@/components/holiday/DateInfoWidget";
import { YachtGallery } from "@/components/yacht/YachtGallery";

export default function HolidayDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = React.use(params);
    const [holiday, setHoliday] = React.useState<Holiday | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchHolidayDetail() {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/holidays/${id}`);
                if (!response.ok) throw new Error("Error");
                const data = await response.json();
                setHoliday(data);
            } catch (err: unknown) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchHolidayDetail();
    }, [id]);

    // Prepare images for gallery
    const galleryImages = React.useMemo(() => {
        if (!holiday) return [];
        return holiday.images?.map(img => img.image) || (holiday.main_image ? [holiday.main_image.image] : []);
    }, [holiday]);

    // Extract cities for carousel (flattened and deduplicated consecutive)
    const routeCities = React.useMemo(() => {
        if (!holiday?.daily_program) return [];

        const allDestinations: { id: string; name: string }[] = [];

        holiday.daily_program.forEach(day => {
            day.destinations?.forEach((dest: { destination_name: string; destination_id: string; destination_name_str: string }) => {
                const name = dest.destination_name_str || dest.destination_name;
                const id = dest.destination_id || dest.destination_name;

                if (name) {
                    const lastDest = allDestinations[allDestinations.length - 1];
                    if (!lastDest || lastDest.name !== name) {
                        allDestinations.push({ id, name });
                    }
                }
            });
        });

        return allDestinations;
    }, [holiday]);

    if (isLoading || !holiday) {
        return (
            <div className="container py-20 space-y-8">
                <Skeleton className="h-96 w-full rounded-b-xl" />
                <div className="container mx-auto px-4 mt-8">
                    <div className="grid grid-cols-3 gap-8">
                        <Skeleton className="col-span-2 h-96" />
                        <Skeleton className="col-span-1 h-96" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 ">

            {/* Header with Slider */}
            <HolidayHeader holiday={holiday} />

            {/* Gallery - Moved to top as requested */}
            {galleryImages.length > 0 && (
                <div className="max-w-6xl mx-auto mt-2 relative z-20 px-4 ">
                    <YachtGallery images={galleryImages.map((img, i) => ({ id: String(i), image: img }))} title={holiday.title} />
                </div>
            )}

            <div className="max-w-6xl mx-auto mt-2">

                {/* Info Grid and Route Carousel - Split View */}
                <div className={`grid gap-2 px-4 ${routeCities.length > 0 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1  justify-items-center"}`}>
                    {/* Left: Info Grid */}
                    <div className={routeCities.length === 0 ? "w-full max-w-6xl" : "w-full"}>
                        <HolidayInfoGrid holiday={holiday} showDateCard={routeCities.length === 0} />
                    </div>

                    {/* Right: Route Carousel */}
                    {routeCities.length > 0 && (
                        <div className="mx-auto w-full">
                            <CityRouteCarousel cities={routeCities} transport={holiday.transport} />

                            {/* Date Info Widget (Only when route exists) */}
                            <DateInfoWidget
                                trips={holiday.trips}
                                duration={holiday.duration}
                                availableFrom={holiday.available_from}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description / Overview */}
                        {holiday.description && (
                            <div className="prose max-w-none text-slate-600 leading-relaxed bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Описание
                                </h3>
                                <div dangerouslySetInnerHTML={{ __html: holiday.description }} />
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="relative min-h-[500px]">
                            <Tabs defaultValue="program" className="w-[99%]">
                                <div className="sticky top-20 z-30 backdrop-blur-sm pt-1">
                                    <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg shadow-sm overflow-x-auto h-auto flex-wrap">
                                        <TabsTrigger value="program" className="py-2">Програма</TabsTrigger>
                                        <TabsTrigger value="included" className="py-2">Условия</TabsTrigger>
                                        <TabsTrigger value="accommodations" className="py-2">Настаняване</TabsTrigger>
                                        <TabsTrigger value="services" className="py-2">Услуги</TabsTrigger>
                                        <TabsTrigger value="useful" className="py-2">Информация</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="mt-6 space-y-6">

                                    {/* PROGRAM TAB */}
                                    <TabsContent value="program" className="space-y-6">
                                        {holiday.daily_program && <HolidayProgram program={holiday.daily_program} />}
                                    </TabsContent>

                                    {/* INCLUDED TAB (Prices & Conditions) */}
                                    <TabsContent value="included" className="space-y-6">
                                        <HolidayIncluded included={holiday.included} notIncluded={holiday.not_included} />
                                    </TabsContent>

                                    {/* ACCOMMODATIONS TAB */}
                                    <TabsContent value="accommodations">
                                        {holiday.accommodations && holiday.accommodations.length > 0 ? (
                                            <HolidayAccommodations accommodations={holiday.accommodations} />
                                        ) : (
                                            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed">
                                                Няма информация за настаняване
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* ADDITIONAL SERVICES TAB */}
                                    <TabsContent value="services">
                                        {holiday.additional_services && holiday.additional_services.length > 0 ? (
                                            <HolidayAdditionalServices services={holiday.additional_services} />
                                        ) : (
                                            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed">
                                                Няма допълнителни услуги
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* USEFUL INFO TAB */}
                                    <TabsContent value="useful">
                                        <Card>
                                            <CardContent className="pt-6 space-y-4">
                                                {holiday.useful_info?.map((info, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                                                        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                                                        <div>
                                                            {info.type && (
                                                                <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">
                                                                    {info.type === 'GENERAL' ? 'Обща информация' :
                                                                        info.type === 'MEDICAL' ? 'Медицински изисквания' :
                                                                            info.type === 'ENTRY' ? 'Паспортен режим' : info.type}
                                                                    {info.country_name ? ` - ${info.country_name}` : ''}
                                                                </span>
                                                            )}
                                                            <p className="text-sm text-slate-700">{info.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                </div>
                            </Tabs>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="lg:col-span-1 lg:-translate-x-4">
                        <HolidayBookingSidebar holiday={holiday} />
                    </div>

                </div>
            </div >
        </div >
    );
}
