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
      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {parsedData.includes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-green-700 dark:text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              Цената включва
            </h3>
            <ul className="space-y-2">
              {parsedData.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-700 dark:text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {parsedData.excludes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700 dark:text-red-500">
              <XCircle className="h-5 w-5" />
              Цената не включва
            </h3>
            <ul className="space-y-2">
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
