// components/ExcursionOverview.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Sparkles } from "lucide-react";

interface ExcursionOverviewProps {
  overview: string | null | undefined;
  priceNote: string | null | undefined;
}

export function ExcursionOverview({ overview, priceNote }: ExcursionOverviewProps) {
  if (!overview && !priceNote) return null;

  return (
    <div className="grid-rows-2 space-y-3">
      {/* Highlights / Price Note (Visible for XML API) */}
      {/* {priceNote && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              Акценти
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground/90 leading-relaxed">
              {priceNote}
            </p>
          </CardContent>
        </Card>
      )} */}

      {/* Overview (Visible for XML [Overview] and New API [Subtitle]) */}
      {overview && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-base flex items-center gap-2">
              <Compass className="size-8 text-primary" />
              Преглед
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
              {overview}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}