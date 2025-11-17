import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle2, XCircle } from "lucide-react";
import { ParsedPriceNote } from "../types/index";

interface PriceIncludesExcludesProps {
  parsedData: ParsedPriceNote;
}

export function PriceIncludesExcludes({ parsedData }: PriceIncludesExcludesProps) {
  if (parsedData.includes.length === 0 && parsedData.excludes.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* This grid will make both columns equal height by default.
        The flex utilities inside will handle the content distribution.
      */}
      <CardContent className="px-4 py-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === INCLUDES COLUMN === */}
        {parsedData.includes.length > 0 && (
          // We add `flex flex-col` to this div...
          <div className="space-y-4 flex flex-col">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700 ">
              <CheckCircle2 className="size-6" />
              Цената включва
            </h3>
            
            {/* ...and then make the <ul> grow and space its content.
              - `flex-1`: Makes the list grow to fill the empty space.
              - `justify-around`: Spaces the list items evenly.
            */}
            <ul className="flex-1 flex flex-col justify-around space-y-4">
              {parsedData.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-700 dark:text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* === EXCLUDES COLUMN === */}
        {parsedData.excludes.length > 0 && (
          // We apply the exact same logic here.
          <div className="space-y-2 flex flex-col">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-red-700 dark:text-red-500">
              <XCircle className="size-6" />
              Цената не включва
            </h3>
            
            {/* This <ul> will also grow and space its items. */}
            <ul className="flex-1 flex flex-col justify-around">
              {parsedData.excludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-700 dark:text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}