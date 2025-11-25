"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Holiday } from "@/lib/types-holiday";
import { HolidayCard } from "@/components/holiday/holiday-card";
import { HolidayCardSkeleton } from "@/components/holiday/holiday-card-skeleton";
import { getHolidays } from "@/app/actions/get-holidays";
import { Palmtree } from "lucide-react";

interface HolidayListProps {
    initialHolidays: Holiday[];
    countryFilter: string | null;
}

const LIMIT = 12;

export function HolidayList({ initialHolidays, countryFilter }: HolidayListProps) {
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
    const [offset, setOffset] = useState(initialHolidays.length);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastHolidayElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreHolidays();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Reset state when country filter changes
    // Actually, since this component is likely re-mounted when the page params change (key={countryFilter} in parent),
    // we might not need this useEffect if the parent handles the key.
    // But to be safe, if the parent doesn't unmount us:
    useEffect(() => {
        setHolidays(initialHolidays);
        setOffset(initialHolidays.length);
        setHasMore(true);
    }, [initialHolidays, countryFilter]);


    const loadMoreHolidays = async () => {
        setLoading(true);
        try {
            // If we filtered client-side initially, our offset might be wrong for the API if the API doesn't filter.
            // But we assumed in the server action that we are passing params to API.
            // If the API doesn't support filtering, this whole pagination is tricky.
            // Assuming the server action handles it best effort.

            const newHolidays = await getHolidays(LIMIT, offset, countryFilter);

            if (newHolidays.length < LIMIT) {
                setHasMore(false);
            }

            setHolidays(prev => [...prev, ...newHolidays]);
            setOffset(prev => prev + LIMIT);
        } catch (error) {
            console.error("Error loading more holidays:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {holidays.map((holiday, index) => {
                    if (holidays.length === index + 1) {
                        return (
                            <div ref={lastHolidayElementRef} key={`${holiday.id}-${index}`} className="h-full">
                                <HolidayCard holiday={holiday} />
                            </div>
                        );
                    } else {
                        return (
                            <div key={`${holiday.id}-${index}`} className="h-full">
                                <HolidayCard holiday={holiday} />
                            </div>
                        );
                    }
                })}

                {loading && (
                    <>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={`skeleton-${i}`} className="h-full">
                                <HolidayCardSkeleton />
                            </div>
                        ))}
                    </>
                )}
            </div>

            {!hasMore && holidays.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}

            {holidays.length === 0 && !loading && (
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
