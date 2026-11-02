"use client";

import { useState } from "react";
import { HotelCard } from "@/components/hotel/hotel-card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import type { Hotel } from "@/lib/types-hotel";
import { getHotelPage } from "@/lib/catalogue-client";

interface HotelListProps {
    initialHotels: Hotel[];
    initialNextOffset: number | null;
    country?: string | null;
}

const LOAD_MORE_COUNT = 12;

export function HotelList({ initialHotels, initialNextOffset, country }: HotelListProps) {
    const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
    const [nextOffset, setNextOffset] = useState(initialNextOffset);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasMore = nextOffset !== null;

    const handleShowMore = async () => {
        if (isLoading || nextOffset === null) return;
        setIsLoading(true);
        setError(null);
        try {
            const page = await getHotelPage(LOAD_MORE_COUNT, nextOffset, country);
            setHotels(previous => [...new Map([...previous, ...page.items].map(item => [item.id, item])).values()]);
            setNextOffset(page.nextOffset);
        } catch (error) {
            console.error("Error loading more hotels:", error);
            setError("Не успяхме да заредим предложенията. Опитайте отново.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {error && <p role="alert" className="text-center text-red-600">{error}</p>}
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.map((hotel) => (
                    <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
                ))}
            </div>

            {/* Empty State */}
            {hotels.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-xl">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">
                        В момента няма налични хотели.
                    </h3>
                </div>
            )}

            {/* Show More Button */}
            {hasMore && (
                <div className="flex justify-center pb-8">
                    <Button
                        onClick={handleShowMore}
                        size="lg"
                        className=""
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Зареждане...
                            </>
                        ) : (
                            `Покажи още`
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}
        </div>
    );
}
