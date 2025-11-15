// ExcursionOverview.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Compass } from "lucide-react";

interface ExcursionOverviewProps {
  overview: string | null | undefined; // Changed: Allow undefined
  priceNote: string | null | undefined; // Changed: Allow undefined
}

export function ExcursionOverview({ overview, priceNote }: ExcursionOverviewProps) {
  return (
    <div className="grid-rows-2 space-y-3">
      {overview && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-base flex items-center gap-2">
              <Compass className="size-8 text-primary" />
              Преглед
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-foreground leading-relaxed">{overview}</p>
          </CardContent>
        </Card>
      )}


    </div>
  );
}