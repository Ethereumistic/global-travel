import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Euro, Percent, ClipboardList, Plane, Info, ArrowRight } from "lucide-react";
// This import path is correct based on your file structure
import { ParsedPriceNote } from "../types"; 

interface AdditionalInfoCardsProps {
  parsedData: ParsedPriceNote;
}

export function AdditionalInfoCards({ parsedData }: AdditionalInfoCardsProps) {
  const hasAnyContent =
    parsedData.surcharges.length > 0 ||
    parsedData.discounts.length > 0 ||
    parsedData.conditions.length > 0 ||
    parsedData.flightInfo.length > 0; // <-- Check array length

  if (!hasAnyContent) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Surcharges Card (No change) */}
      {parsedData.surcharges.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Euro className="h-5 w-5 text-primary" />
              Доплащане
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {parsedData.surcharges.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary/50 mt-1 flex-shrink-0" />
                <p className="text-sm text-foreground/80">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Discounts Card (No change) */}
      {parsedData.discounts.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Percent className="h-5 w-5 text-primary" />
              Отстъпки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {parsedData.discounts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary/50 mt-1 flex-shrink-0" />
                <p className="text-sm text-foreground/80">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conditions Card (No change) */}
      {parsedData.conditions.length > 0 && (
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              Други условия
            </CardTitle>
          </CardHeader>
          {/* Use Tailwind's column classes for an internal 2-column layout */}
          <CardContent className="md:columns-2 md:gap-x-8 space-y-2 md:space-y-0">
            {parsedData.conditions.map((item, idx) => (
              // Add break-inside-avoid to prevent list items from splitting
              <div key={idx} className="flex items-start gap-2 break-inside-avoid mb-2">
                <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p
                  className="text-sm text-foreground/80"
                  dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* === UPDATED FLIGHT INFO SECTION === */}
      {/* We now map over the flightInfo array */}
      {parsedData.flightInfo.map((flightSection, index) => (
        <Card key={index} className="border-0 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plane className="h-5 w-5 text-primary" />
              {/* The title is now dynamic from the parsed section */}
              {flightSection.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* We render the table if it exists... */}
            {flightSection.table ? (
              <div className="overflow-x-auto">
                <Table className="bg-muted/50 rounded-lg min-w-full">
                  <TableHeader>
                    <TableRow>
                      {flightSection.table.headers.map((header, hIdx) => (
                        <TableHead key={hIdx} className={hIdx === 0 ? "lg:w-[50%]" : ""}>
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flightSection.table.rows.map((row, rIdx) => (
                      <TableRow key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <TableCell key={cIdx} className="text-sm font-medium">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* ...otherwise we render the fallback text */
              <p className="text-sm text-foreground/80 whitespace-pre-line">
                {flightSection.textFallback}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}