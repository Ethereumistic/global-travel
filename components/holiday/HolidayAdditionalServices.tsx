"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Info } from "lucide-react";

interface HolidayAdditionalServicesProps {
    services: any[];
}

export function HolidayAdditionalServices({ services }: HolidayAdditionalServicesProps) {
    if (!services || services.length === 0) return null;

    return (
        <div className="space-y-4">
            {services.map((service) => (
                <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-2">
                                    <Ticket className="h-5 w-5 text-primary mt-1 shrink-0" />
                                    {service.description}
                                </h4>
                                {service.remark && (
                                    <p className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-lg flex items-start gap-2">
                                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                        {service.remark}
                                    </p>
                                )}
                            </div>

                            <div className="md:text-right min-w-[150px]">
                                {service.prices && service.prices.length > 0 ? (
                                    <div className="space-y-2">
                                        {service.prices.map((price: any, idx: number) => (
                                            <div key={idx} className="flex md:flex-col justify-between md:justify-end items-center md:items-end gap-2 border-b md:border-0 pb-2 md:pb-0 last:border-0 last:pb-0">
                                                <span className="text-xs text-slate-500">
                                                    {price.age_group?.age_from}-{price.age_group?.age_to} г.
                                                </span>
                                                <span className="font-bold text-primary text-lg">
                                                    {price.total_price?.main?.value} {price.total_price?.main?.currency}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-500 italic">По запитване</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
