"use client";

import { useState, useEffect } from "react";
import { Holiday } from "@/lib/types-holiday";
import { HolidayCard } from "@/components/holiday/holiday-card";
import { Palmtree, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHolidays } from "@/app/actions/get-holidays";

interface HolidayListProps {
    initialHolidays: Holiday[];
    country?: string | null;
}

const LOAD_MORE_COUNT = 12;

export function HolidayList({ initialHolidays, country }: HolidayListProps) {
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
    const [offset, setOffset] = useState(initialHolidays.length);
    const [hasMore, setHasMore] = useState(initialHolidays.length >= LOAD_MORE_COUNT);
    const [loadingMore, setLoadingMore] = useState(false);

    // Reset state when filters change (initialHolidays updates)
    useEffect(() => {
        setHolidays(initialHolidays);
        setOffset(initialHolidays.length);
        setHasMore(initialHolidays.length >= LOAD_MORE_COUNT);
    }, [initialHolidays]);

    const handleShowMore = async () => {
        setLoadingMore(true);
        try {
            const newHolidays = await getHolidays(LOAD_MORE_COUNT, offset, country);

            if (newHolidays.length < LOAD_MORE_COUNT) {
                setHasMore(false);
            }

            if (newHolidays.length > 0) {
                setHolidays(prev => [...prev, ...newHolidays]);
                setOffset(prev => prev + newHolidays.length);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more holidays:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {holidays.map((holiday) => (
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
                        variant="default"
                        className=""
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Зареждане...
                            </>
                        ) : (
                            <>
                                Покажи още
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && holidays.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}

            {holidays.length === 0 && (
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
