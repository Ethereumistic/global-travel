"use client";

import { useState, useEffect } from "react";
import { HotelCard } from "@/components/hotel/hotel-card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import type { Hotel } from "@/lib/types-hotel";
import { getHotels } from "@/app/actions/get-hotels";

interface HotelListProps {
    initialHotels: Hotel[];
    country?: string | null;
}

const LOAD_MORE_COUNT = 12;

export function HotelList({ initialHotels, country }: HotelListProps) {
    const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
    const [offset, setOffset] = useState(initialHotels.length);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHotels.length >= 1); // Assuming if we got data, there might be more. Or passed explicitly. 
    // Actually, checking if length < requested limit is safer, but initial fetch might be large.
    // Let's assume initial fetch was limited to 12.
    // If we received fewer than 12, likely no more.

    // Note: getHotels returns { hotels, total }. If we want perfect "hasMore", we need total.
    // For now, let's just use the "received full batch" heuristic for simplicity, 
    // or assume if we render, we try to fetch.
    // Let's stick to the "length < LOAD_MORE_COUNT" check on fetch. 
    // On init, if initial < 12, false.
    // Let's stick to the "length < LOAD_MORE_COUNT" check on fetch. 
    // On init, if initial < 12, false.
    // Wait, the previous logic was slicing 1000 items. Code below:

    // Reset state when filters change
    useEffect(() => {
        setHotels(initialHotels);
        setOffset(initialHotels.length);
        setHasMore(initialHotels.length >= 1);
    }, [initialHotels]);

    const handleShowMore = async () => {
        setIsLoading(true);
        try {
            const { hotels: newHotels } = await getHotels(LOAD_MORE_COUNT, offset, country);

            if (newHotels.length < LOAD_MORE_COUNT) {
                setHasMore(false);
            }

            if (newHotels.length > 0) {
                setHotels(prev => [...prev, ...newHotels]);
                setOffset(prev => prev + newHotels.length);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more hotels:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10">
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
            {hasMore && hotels.length > 0 && (
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

            {!hasMore && hotels.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Това са всички предложения за момента.</p>
                </div>
            )}
        </div>
    );
}
