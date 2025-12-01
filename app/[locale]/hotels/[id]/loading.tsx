import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-2">
            {/* Header Skeleton */}
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

            {/* Gallery Skeleton */}
            <div className="max-w-6xl mx-auto mt-2 relative z-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Skeleton className="w-full aspect-square lg:aspect-auto lg:h-[500px] rounded-xl lg:rounded-l-xl lg:rounded-r-none" />
                    <div className="hidden lg:grid grid-cols-2 gap-2 h-[500px]">
                        <Skeleton className="h-full w-full rounded-none" />
                        <Skeleton className="h-full w-full rounded-tr-xl" />
                        <Skeleton className="h-full w-full rounded-none" />
                        <Skeleton className="h-full w-full rounded-br-xl" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-5 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* LEFT COLUMN */}
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

                        {/* Facilities Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-7 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="lg:col-span-2 lg:-translate-x-4">
                        <Card className="sticky top-24 border-0 shadow-xl ring-1 ring-slate-200 bg-white">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-7 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-24 w-full rounded-md" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-md" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
