"use client";

import { Card } from "@/components/ui/card";
import { Hotel, Bed, User, Users, BedDouble, Home, Plus, Combine } from "lucide-react";
import type { HolidayAccommodation } from "@/lib/types-holiday";
import { Badge } from "@/components/ui/badge";

interface HolidayAccommodationsProps {
    accommodations: HolidayAccommodation[];
}

const getAccommodationDetails = (type: string) => {
    // Normalize type for comparison
    const normalizedType = type?.toUpperCase() || "";

    if (normalizedType === "DOUBLE_DOUBLE") {
        return {
            icon: <BedDouble className="h-10 w-10" />,
            label: "Двойна стая със спалня",
            color: "text-indigo-500"
        };
    }
    if (normalizedType === "DOUBLE_TWIN") {
        return {
            icon: (
                <div className="flex items-center justify-center space-x-4">
                    <Bed className="h-10 w-10 translate-x-1" />
                    <Bed className="h-10 w-10 -scale-x-100 -translate-x-1" />
                </div>
            ),
            label: "Двойна стая с отделни легла",
            color: "text-blue-500"
        };
    }
    if (normalizedType === "DOUBLE_EXTRABED") {
        return {
            icon: (
                <div className="flex items-center justify-center gap-1">
                    <Plus className="h-6 w-6" />
                    <Bed className="h-10 w-10" />
                </div>
            ),
            label: "Допълнително легло в двойна стая",
            color: "text-sky-500"
        };
    }
    if (normalizedType === "SINGLE") {
        return {
            icon: <Bed className="h-10 w-10" />,
            label: "Единична стая",
            color: "text-emerald-500"
        };
    }
    if (normalizedType === "DOUBLE_COMBINE") {
        return {
            icon: <Combine className="h-10 w-10" />,
            label: "Двойна стая за комбиниране",
            color: "text-amber-500"
        };
    }

    // Fallbacks
    if (normalizedType.includes("TRIPLE")) {
        return { icon: <Users className="h-10 w-10" />, label: "Тройна стая", color: "text-purple-500" };
    }
    if (normalizedType.includes("APARTMENT")) {
        return { icon: <Home className="h-10 w-10" />, label: "Апартамент", color: "text-amber-500" };
    }

    return {
        icon: <Hotel className="h-10 w-10" />,
        label: type || "Настаняване",
        color: "text-slate-500"
    };
};

export function HolidayAccommodations({ accommodations }: HolidayAccommodationsProps) {
    if (!accommodations || accommodations.length === 0) return null;

    return (
        <div className="grid gap-4">
            {accommodations.map((acc) => {
                const { icon, label, color } = getAccommodationDetails(acc.accommodation_type);

                return (
                    <Card key={acc.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ring-1 ring-slate-200/50">
                        <div className="flex flex-col md:flex-row">
                            {/* Icon Section */}
                            <div className={`p-6 flex items-center justify-center md:w-32 shrink-0 transition-colors ${color}`}>
                                {icon}
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex-1 flex flex-col justify-center">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`${color} border-current font-medium bg-transparent`}>
                                                {label}
                                            </Badge>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-900">
                                            {acc.description || "Настаняване"}
                                        </h4>

                                        {acc.hotel_name && (
                                            <p className="text-slate-600 flex items-center gap-2 text-sm">
                                                <Hotel className="h-4 w-4 text-slate-400" />
                                                <span className="font-medium">{acc.hotel_name}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Price Section */}
                                    <div className="text-right pl-4 md:border-l border-slate-100 min-w-[140px]">
                                        {acc.total_price?.main?.value ? (
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Цена</p>
                                                <div className="flex items-baseline justify-end gap-1">
                                                    <span className="text-2xl font-black text-primary">
                                                        {Math.abs(acc.total_price.main.value)}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-600">
                                                        {acc.total_price.main.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-slate-500">
                                                <span className="text-sm font-medium italic">По запитване</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
