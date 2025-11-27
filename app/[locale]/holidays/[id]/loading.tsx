import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
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
}
