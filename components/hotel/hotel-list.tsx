"use client";

import { useState, useEffect } from "react";
import { HotelCard } from "@/components/hotel/hotel-card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import type { Hotel } from "@/lib/types-hotel";



export function HotelList({ initialHotels }: { initialHotels: Hotel[] }) {
    const [displayCount, setDisplayCount] = useState(12);
    const [isLoading, setIsLoading] = useState(false);

    // Reset display count when the underlying data changes (e.g. filter change)
    useEffect(() => {
        setDisplayCount(12);
    }, [initialHotels]);

    const handleShowMore = () => {
        setIsLoading(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            setDisplayCount((prev) => prev + 12);
            setIsLoading(false);
        }, 300);
    };

    const displayedHotels = initialHotels.slice(0, displayCount);
    const hasMore = displayedHotels.length < initialHotels.length;

    return (
        <div className="space-y-10">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedHotels.map((hotel) => (
                    <HotelCard key={`${hotel.id}-${hotel.name}`} hotel={hotel} />
                ))}
            </div>

            {/* Empty State */}
            {initialHotels.length === 0 && (
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
                            // `Покажи още (${Math.min(12, initialHotels.length - displayCount)})`
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && initialHotels.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}
        </div>
    );
}
