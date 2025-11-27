"use client";

import { useState, useEffect } from "react";
import { Holiday } from "@/lib/types-holiday";
import { HolidayCard } from "@/components/holiday/holiday-card";
import { Palmtree, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HolidayListProps {
    allHolidays: Holiday[];
}

const INITIAL_DISPLAY_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export function HolidayList({ allHolidays }: HolidayListProps) {
    const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
    const [loadingMore, setLoadingMore] = useState(false);

    // Reset display count when the underlying data changes (e.g. filter change)
    useEffect(() => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
    }, [allHolidays]);

    const handleShowMore = () => {
        setLoadingMore(true);
        // Simulate a small delay for better UX, similar to root page
        setTimeout(() => {
            setDisplayCount(prev => prev + LOAD_MORE_COUNT);
            setLoadingMore(false);
        }, 300);
    };

    const displayedHolidays = allHolidays.slice(0, displayCount);
    const hasMore = displayedHolidays.length < allHolidays.length;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedHolidays.map((holiday) => (
                    <div key={holiday.id} className="h-full">
                        <HolidayCard holiday={holiday} />
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button
                        onClick={handleShowMore}
                        disabled={loadingMore}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Зареждане...
                            </>
                        ) : (
                            <>
                                Покажи още ({Math.min(LOAD_MORE_COUNT, allHolidays.length - displayCount)})
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && allHolidays.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}

            {allHolidays.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Palmtree className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Няма намерени почивки</h3>
                    <p className="text-slate-500 mt-2">Нямаме налични оферти за тази дестинация в момента.</p>
                </div>
            )}
        </>
    );
}
