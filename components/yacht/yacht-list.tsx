"use client";

import { useState, useEffect } from "react";
import { YachtCard } from "@/components/yacht/yacht-card";
import { Button } from "@/components/ui/button";
import { Loader2, Anchor } from "lucide-react";
import type { Yacht } from "@/lib/types-yacht";
import { getYachts } from "@/app/actions/get-yachts";

interface YachtListProps {
  initialYachts: Yacht[];
  country?: string | null;
}

const LOAD_MORE_COUNT = 9;

export function YachtList({ initialYachts, country }: YachtListProps) {
  const [yachts, setYachts] = useState<Yacht[]>(initialYachts);
  const [offset, setOffset] = useState(initialYachts.length);
  const [isLoading, setIsLoading] = useState(false);
  // Initial heuristic: if we got full batch, likely more exists. 
  // If initial fetch was < 9, then definitely no more.
  const [hasMore, setHasMore] = useState(initialYachts.length >= 1);

  // Reset state when filters change
  useEffect(() => {
    setYachts(initialYachts);
    setOffset(initialYachts.length);
    setHasMore(initialYachts.length >= 1);
  }, [initialYachts]);

  const handleShowMore = async () => {
    setIsLoading(true);
    try {
      const newYachts = await getYachts(LOAD_MORE_COUNT, offset, country);

      if (newYachts.length < LOAD_MORE_COUNT) {
        setHasMore(false);
      }

      if (newYachts.length > 0) {
        setYachts(prev => [...prev, ...newYachts]);
        setOffset(prev => prev + newYachts.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more yachts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {yachts.map((yacht) => (
          <YachtCard key={yacht.id} yacht={yacht} />
        ))}
      </div>

      {/* Empty State */}
      {yachts.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Anchor className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Няма намерени яхти</h3>
          <p className="text-slate-500 mt-2">Нямаме налични лодки за тази дестинация в момента.</p>
        </div>
      )}

      {/* Show More Button */}
      {hasMore && yachts.length > 0 && (
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

      {!hasMore && yachts.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Това са всички предложения за момента.</p>
        </div>
      )}
    </div>
  );
}