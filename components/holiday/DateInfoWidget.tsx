"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "../ui/card";

interface DateInfoWidgetProps {
    trips?: { departure_date: string }[];
    duration: number;
    availableFrom?: string;
}

export function DateInfoWidget({ trips, duration, availableFrom }: DateInfoWidgetProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Prepare list of start dates
    const startDates = React.useMemo(() => {
        if (trips && trips.length > 0) {
            return trips.map(t => t.departure_date);
        }
        if (availableFrom) {
            return [availableFrom];
        }
        return [];
    }, [trips, availableFrom]);

    // Cycle through dates if multiple exist
    React.useEffect(() => {
        if (startDates.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % startDates.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [startDates.length]);

    const currentStartDateStr = startDates[currentIndex];

    const dateDisplay = React.useMemo(() => {
        if (!currentStartDateStr) return { start: 'N/A', end: 'N/A' };

        const start = new Date(currentStartDateStr);
        const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));

        return {
            start: start.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' }),
            end: end.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })
        };
    }, [currentStartDateStr, duration]);

    return (
        <Card className="flex-row p-4.5 shadow-sm border flex items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                    <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Дати на пътуване</p>
                    <div className="relative h-6 w-full">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm font-bold text-slate-900 absolute inset-0 "
                            >
                                {dateDisplay.start} - {dateDisplay.end}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Продължителност</p>
                <p className="text-sm font-bold text-slate-900">{duration} дни</p>
            </div>
        </Card>
    );
}
