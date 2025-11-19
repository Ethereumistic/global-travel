import { Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SeasonalPrice } from "@/lib/types-yacht";

export function SeasonalPricing({ prices }: { prices: SeasonalPrice[] }) {
  return (
    <div className="border rounded-xl overflow-hidden">
        <div className="bg-secondary/30 p-3 font-semibold text-sm grid grid-cols-2 gap-4">
            <span>Период</span>
            <span className="text-right">Цена (седмица)</span>
        </div>
        <ScrollArea className="h-[300px]">
            <div className="divide-y">
                {prices.map((p, i) => (
                    <div key={i} className="p-3 text-sm grid grid-cols-2 gap-4 hover:bg-slate-50">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(p.from_date).toLocaleDateString("bg-BG")} - {new Date(p.to_date).toLocaleDateString("bg-BG")}
                        </div>
                        <div className="text-right font-medium text-primary">
                            {p.price} {p.currency}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    </div>
  );
}