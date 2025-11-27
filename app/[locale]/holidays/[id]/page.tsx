import * as React from "react";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { getHolidayById } from "@/app/actions/get-holidays";
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

export default async function HolidayDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const holiday = await getHolidayById(id);

    if (!holiday) {
        notFound();
    }

    // Extract cities for carousel (flattened and deduplicated consecutive)
    const routeCities = (() => {
        if (!holiday?.daily_program) return [];

        const allDestinations: { id: string; name: string }[] = [];

        holiday.daily_program.forEach((day: any) => {
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
    })();

    // Determine which tabs should be visible based on available data
    const availableTabs = (() => {
        const tabs = [];

        // Program tab - check if daily_program exists and has items
        if (holiday.daily_program && holiday.daily_program.length > 0) {
            tabs.push({ value: 'program', label: 'Програма' });
        }

        // Included tab - check if included or not_included exists
        if (holiday.included || holiday.not_included) {
            tabs.push({ value: 'included', label: 'Условия' });
        }

        // Accommodations tab - check if accommodations exists and has items
        if (holiday.accommodations && holiday.accommodations.length > 0) {
            tabs.push({ value: 'accommodations', label: 'Настаняване' });
        }

        // Services tab - check if additional_services exists and has items
        if (holiday.additional_services && holiday.additional_services.length > 0) {
            tabs.push({ value: 'services', label: 'Услуги' });
        }

        // Useful info tab - check if useful_info exists and has items
        if (holiday.useful_info && holiday.useful_info.length > 0) {
            tabs.push({ value: 'useful', label: 'Информация' });
        }

        return tabs;
    })();

    // Get the default tab (first available tab)
    const defaultTab = availableTabs.length > 0 ? availableTabs[0].value : 'program';

    return (
        <div className="min-h-screen bg-slate-50/50 pb-2">

            {/* Header with Slider */}
            <HolidayHeader holiday={holiday} />

            {/* Gallery - Moved to top as requested */}
            {(holiday.main_image || (holiday.images && holiday.images.length > 0)) && (
                <div className="max-w-6xl mx-auto mt-2 relative z-20 px-4 ">
                    <YachtGallery mainImage={holiday.main_image} images={holiday.images || []} title={holiday.title} />
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

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-3 space-y-8">

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
                        {availableTabs.length > 0 && (
                            <div className="relative min-h-[500px]">
                                <Tabs defaultValue={defaultTab} className="w-[99%] pl-4 -pr-6">
                                    <div className="sticky top-20 z-30 backdrop-blur-sm pt-1">
                                        <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg shadow-sm overflow-x-auto h-auto flex-wrap">
                                            {availableTabs.map(tab => (
                                                <TabsTrigger key={tab.value} value={tab.value} className="py-2">
                                                    {tab.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>

                                    <div className="mt-6 space-y-6 ">

                                        {/* PROGRAM TAB */}
                                        {holiday.daily_program && holiday.daily_program.length > 0 && (
                                            <TabsContent value="program" className="space-y-6">
                                                <HolidayProgram program={holiday.daily_program} />
                                            </TabsContent>
                                        )}

                                        {/* INCLUDED TAB (Prices & Conditions) */}
                                        {(holiday.included || holiday.not_included) && (
                                            <TabsContent value="included" className="space-y-6">
                                                <HolidayIncluded included={holiday.included} notIncluded={holiday.not_included} />
                                            </TabsContent>
                                        )}

                                        {/* ACCOMMODATIONS TAB */}
                                        {holiday.accommodations && holiday.accommodations.length > 0 && (
                                            <TabsContent value="accommodations">
                                                <HolidayAccommodations accommodations={holiday.accommodations} />
                                            </TabsContent>
                                        )}

                                        {/* ADDITIONAL SERVICES TAB */}
                                        {holiday.additional_services && holiday.additional_services.length > 0 && (
                                            <TabsContent value="services">
                                                <HolidayAdditionalServices services={holiday.additional_services} />
                                            </TabsContent>
                                        )}

                                        {/* USEFUL INFO TAB */}
                                        {holiday.useful_info && holiday.useful_info.length > 0 && (
                                            <TabsContent value="useful">
                                                <Card>
                                                    <CardContent className="pt-6 space-y-4">
                                                        {holiday.useful_info.map((info: any, idx: number) => (
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
                                        )}

                                    </div>
                                </Tabs>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div id="booking-sidebar" className="lg:col-span-2 lg:-translate-x-4">
                        <HolidayBookingSidebar holiday={holiday} />
                    </div>

                </div>
            </div >
        </div >
    );
}
