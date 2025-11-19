import { Ruler, Fuel, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function YachtSpecs({ specs }: { specs: Record<string, string>[] }) {
  // The API returns an array, usually with 1 object. We take the first one.
  const specData = specs[0] || {};

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {Object.entries(specData).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center border-b border-dashed border-border/60 pb-2 last:border-0">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                {/* We can add conditional icons based on key name here if we want */}
                {key === "Мощност на двигателя" && <Gauge className="h-3 w-3" />}
                {key === "Капацитет на горивото" && <Fuel className="h-3 w-3" />}
                {key}
              </span>
              <span className="font-medium text-foreground text-sm text-right">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}