"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Bed, User, Users } from "lucide-react";
import type { HolidayAccommodation } from "@/lib/types-holiday";
import { Badge } from "@/components/ui/badge";

interface HolidayAccommodationsProps {
    accommodations: HolidayAccommodation[];
}

export function HolidayAccommodations({ accommodations }: HolidayAccommodationsProps) {
    if (!accommodations || accommodations.length === 0) return null;

    return (
        <div className="space-y-4">
            {accommodations.map((acc) => (
                <Card key={acc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="bg-slate-100 p-6 flex items-center justify-center md:w-48 shrink-0">
                            <Hotel className="h-10 w-10 text-slate-400" />
                        </div>
                        <div className="p-6 flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{acc.description || "Настаняване"}</h4>
                                    {acc.hotel_name && (
                                        <p className="text-slate-600 flex items-center gap-2 mb-2">
                                            <Hotel className="h-4 w-4" /> {acc.hotel_name}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="text-slate-500 border-slate-200">
                                            {acc.accommodation_type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {acc.total_price?.main?.value ? (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase">Цена</p>
                                            <p className="text-2xl font-black text-primary">
                                                {acc.total_price.main.value} {acc.total_price.main.currency}
                                            </p>
                                            {acc.total_price.secondary && (
                                                <p className="text-sm text-slate-400">
                                                    / {acc.total_price.secondary.value} {acc.total_price.secondary.currency}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-500 italic">По запитване</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
