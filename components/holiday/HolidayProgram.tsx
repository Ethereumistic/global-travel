"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { HolidayProgramDay } from "@/lib/types-holiday";

interface HolidayProgramProps {
    program: HolidayProgramDay[];
}

export function HolidayProgram({ program }: HolidayProgramProps) {
    if (!program || program.length === 0) return null;

    // Default open the first day
    const defaultValue = `day-0`;

    return (
        <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full space-y-4">
            {program.map((day, index) => {
                const dayNumber = index + 1; // Calculate day number based on index
                return (
                    <AccordionItem
                        key={`day-${index}`}
                        value={`day-${index}`}
                        className="border rounded-lg px-4 bg-white shadow-sm data-[state=open]:border-primary/50 transition-all last:border-b"
                    >
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-4 text-left">
                                <div className="flex flex-col items-center min-w-[50px] bg-slate-100 rounded p-1">
                                    <span className="text-xl font-bold text-primary">
                                        {String(dayNumber).padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ден</span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg text-slate-900">
                                        {day.destinations && day.destinations.length > 0 ? (
                                            day.destinations.map(d => d.destination_name_str || d.destination_name).join(" - ")
                                        ) : (
                                            `Ден ${dayNumber}`
                                        )}
                                    </div>
                                    {day.distance && (
                                        <div className="text-xs text-slate-500 mt-1">
                                            Разстояние: {day.distance} км
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6 text-slate-600 leading-relaxed px-4">
                            <div dangerouslySetInnerHTML={{ __html: day.description }} />

                            {day.destinations && day.destinations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed">
                                    {day.destinations.map((dest, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {dest.destination_name_str || dest.destination_name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
