"use client";

import { useState } from "react";
import { YachtCard } from "@/components/yacht/yacht-card"; // Ensure this path matches where you saved the card
import { Button } from "@/components/ui/button";
import { Loader2, Anchor } from "lucide-react";
import type { Yacht } from "@/lib/types-yacht";

interface YachtListProps {
  initialYachts: Yacht[];
  initialTotal: number;
}

export function YachtList({ initialYachts, initialTotal }: YachtListProps) {
  const [yachts, setYachts] = useState<Yacht[]>(initialYachts);
  const [offset, setOffset] = useState(initialYachts.length);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate if there are more to show
  const hasMore = yachts.length < initialTotal;

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      // We fetch 9 more, using the current length as the offset
      const res = await fetch(`/api/yachts?limit=9&offset=${offset}`);
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      
      if (data.yachts && Array.isArray(data.yachts)) {
        setYachts((prev) => [...prev, ...data.yachts]);
        setOffset((prev) => prev + 9);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yachts.map((yacht) => (
          <YachtCard key={`${yacht.id}-${yacht.name}`} yacht={yacht} />
        ))}
      </div>

      {/* Empty State */}
      {yachts.length === 0 && (
        <div className="text-center py-20 bg-secondary/20 rounded-xl">
          <Anchor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">
            В момента няма налични яхти.
          </h3>
        </div>
      )}

      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center pb-8">
          <Button 
            onClick={loadMore} 
            size="lg" 
            variant="outline"
            className="min-w-[200px] border-primary/20 hover:bg-primary/5 text-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Зареждане...
              </>
            ) : (
              `Покажи още (${initialTotal - yachts.length})`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}