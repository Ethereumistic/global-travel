"use client";

import { useState } from "react";
import { HolidayCardData } from "@/lib/types-holiday";
import { HolidayCard } from "@/components/holiday/holiday-card";
import { Palmtree, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHolidayPage } from "@/lib/catalogue-client";

interface HolidayListProps {
    initialHolidays: HolidayCardData[];
    initialNextOffset: number | null;
    country?: string | null;
}

const LOAD_MORE_COUNT = 12;

export function HolidayList({ initialHolidays, initialNextOffset, country }: HolidayListProps) {
    const [holidays, setHolidays] = useState<HolidayCardData[]>(initialHolidays);
    const [nextOffset, setNextOffset] = useState(initialNextOffset);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasMore = nextOffset !== null;

    const handleShowMore = async () => {
        if (isLoading || nextOffset === null) return;
        setIsLoading(true);
        setError(null);
        try {
            const page = await getHolidayPage(LOAD_MORE_COUNT, nextOffset, country);
            setHolidays(previous => [...new Map([...previous, ...page.items].map(item => [item.id, item])).values()]);
            setNextOffset(page.nextOffset);
        } catch (error) {
            console.error("Error loading more holidays:", error);
            setError("Не успяхме да заредим предложенията. Опитайте отново.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && <p role="alert" className="text-center text-red-600 mb-4">{error}</p>}
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
                        disabled={isLoading}
                        size="lg"
                        variant="default"
                        className=""
                    >
                        {isLoading ? (
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
