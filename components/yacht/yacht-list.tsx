"use client";

import { useState } from "react";
import { YachtCard } from "@/components/yacht/yacht-card";
import { Button } from "@/components/ui/button";
import { Loader2, Anchor } from "lucide-react";
import type { YachtCardData } from "@/lib/types-yacht";
import { getYachtPage } from "@/app/actions/get-yachts";

interface YachtListProps {
  initialYachts: YachtCardData[];
    initialNextOffset: number | null;
  country?: string | null;
}

const LOAD_MORE_COUNT = 9;

export function YachtList({ initialYachts, initialNextOffset, country }: YachtListProps) {
    const [yachts, setYachts] = useState<YachtCardData[]>(initialYachts);
    const [nextOffset, setNextOffset] = useState(initialNextOffset);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasMore = nextOffset !== null;

    const handleShowMore = async () => {
        if (isLoading || nextOffset === null) return;
        setIsLoading(true);
        setError(null);
        try {
            const page = await getYachtPage(LOAD_MORE_COUNT, nextOffset, country);
            setYachts(previous => [...new Map([...previous, ...page.items].map(item => [item.id, item])).values()]);
            setNextOffset(page.nextOffset);
        } catch (error) {
            console.error("Error loading more yachts:", error);
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