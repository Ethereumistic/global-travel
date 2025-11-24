"use client";

import { Card } from "@/components/ui/card";
import { Plus, Info } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface HolidayAdditionalServicesProps {
    services: any[];
}

const parseServiceDescription = (description: string) => {
    if (!description) return { title: "", body: "" };

    const bracketIndex = description.indexOf('(');
    const dashIndex = description.indexOf(' - ');

    // If neither exists
    if (bracketIndex === -1 && dashIndex === -1) {
        return { title: description, body: "" };
    }

    // Determine which separator comes first
    let splitIndex = -1;
    let separatorType: 'bracket' | 'dash' = 'bracket';

    if (bracketIndex !== -1 && dashIndex !== -1) {
        if (bracketIndex < dashIndex) {
            splitIndex = bracketIndex;
            separatorType = 'bracket';
        } else {
            splitIndex = dashIndex;
            separatorType = 'dash';
        }
    } else if (bracketIndex !== -1) {
        splitIndex = bracketIndex;
        separatorType = 'bracket';
    } else {
        splitIndex = dashIndex;
        separatorType = 'dash';
    }

    if (separatorType === 'bracket') {
        return {
            title: description.substring(0, splitIndex).trim(),
            body: description.substring(splitIndex).trim()
        };
    } else {
        // For dash, we skip the " - " (3 chars)
        return {
            title: description.substring(0, splitIndex).trim(),
            body: description.substring(splitIndex + 3).trim()
        };
    }
};

export function HolidayAdditionalServices({ services }: HolidayAdditionalServicesProps) {
    if (!services || services.length === 0) return null;

    return (
        <div className="space-y-4">
            {services.map((service, index) => {
                const { title, body } = parseServiceDescription(service.description);

                // Determine if the service should be an accordion
                const hasSplit = body.length > 0;
                const isLong = hasSplit || (service.description && service.description.length > 100) || (service.remark && service.remark.length > 50);

                const IconBox = () => (
                    <div className="flex items-center justify-center h-10 w-10 bg-slate-100 rounded-lg shrink-0 text-primary">
                        <Plus className="h-6 w-6" />
                    </div>
                );

                // Helper to get the highest price for display
                const getHighestPrice = () => {
                    if (!service.prices || service.prices.length === 0) return null;
                    return service.prices.reduce((prev: any, current: any) => {
                        return (prev.total_price?.main?.value > current.total_price?.main?.value) ? prev : current;
                    });
                };

                const highestPrice = getHighestPrice();

                const TriggerPriceDisplay = () => (
                    <div className="md:text-right shrink-0 ml-auto pl-2">
                        {highestPrice ? (
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-primary text-lg">
                                    {highestPrice.total_price?.main?.value} {highestPrice.total_price?.main?.currency}
                                </span>
                                {service.prices.length > 1 && (
                                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                                        (от {service.prices.length} опции)
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-slate-500 italic">По запитване</span>
                        )}
                    </div>
                );

                const ContentPriceDisplay = () => (
                    <div className="md:text-right min-w-[120px] shrink-0">
                        {service.prices && service.prices.length > 0 ? (
                            <div className="flex flex-col items-end gap-2">
                                {service.prices.map((price: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between w-full md:w-auto gap-4 border-b md:border-0 pb-2 md:pb-0 last:border-0 last:pb-0">
                                        <span className="text-sm text-slate-600">
                                            {price.age_group?.age_from}-{price.age_group?.age_to} г.
                                        </span>
                                        <span className="font-bold text-primary text-lg">
                                            {price.total_price?.main?.value} {price.total_price?.main?.currency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                );

                if (isLong) {
                    return (
                        <Accordion key={service.id || index} type="single" collapsible className="w-full">
                            <AccordionItem
                                value={`item-${index}`}
                                className="border rounded-lg px-4 bg-white shadow-sm data-[state=open]:border-primary/50 transition-all last:border-b-0"
                            >
                                <AccordionTrigger className="hover:no-underline py-4 group">
                                    <div className="flex items-center gap-4 text-left w-full pr-4">
                                        <IconBox />
                                        <div className="flex-1 font-bold text-base text-slate-900 line-clamp-2 group-data-[state=open]:line-clamp-none transition-all">
                                            {title}
                                        </div>
                                        <div className="hidden md:block group-data-[state=open]:hidden">
                                            <TriggerPriceDisplay />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-6 text-slate-600 leading-relaxed px-4 border-t border-dashed mt-2">
                                    <div className="space-y-4">
                                        <div className="text-base text-slate-900">
                                            {body || service.description}
                                        </div>

                                        {service.remark && (
                                            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg flex items-start gap-2">
                                                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                                {service.remark}
                                            </p>
                                        )}

                                        <div className="flex flex-col md:flex-row justify-between items-end pt-4 border-t gap-4">
                                            <div className="text-sm text-slate-400 italic w-full md:w-auto">
                                                * Цените са за един турист
                                            </div>
                                            <ContentPriceDisplay />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                }

                // Short version (Card style)
                return (
                    <div key={service.id || index} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                        <IconBox />
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900">
                                {service.description}
                            </h4>
                            {service.remark && (
                                <p className="text-sm text-slate-500 mt-1 flex items-start gap-1">
                                    <Info className="h-3 w-3 shrink-0 mt-1" />
                                    {service.remark}
                                </p>
                            )}
                        </div>
                        <div className="ml-auto">
                            <TriggerPriceDisplay />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
