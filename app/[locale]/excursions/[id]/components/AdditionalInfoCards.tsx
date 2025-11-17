// /app/[locale]/excursions/[id]/components/AdditionalInfoCards.tsx (UPDATED)

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Euro,
  Percent,
  ClipboardList,
  Plane,
  Info,
  ArrowRight,
} from "lucide-react";
import { ParsedPriceNote } from "../types";

// 1. Import the Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdditionalInfoCardsProps {
  parsedData: ParsedPriceNote;
}

export function AdditionalInfoCards({ parsedData }: AdditionalInfoCardsProps) {
  const hasAnyContent =
    parsedData.surcharges.length > 0 ||
    parsedData.discounts.length > 0 ||
    parsedData.conditions.length > 0 ||
    parsedData.flightInfo.length > 0;

  if (!hasAnyContent) return null;

  const isSingleFlightCard = parsedData.flightInfo.length === 1;

  // 2. Wrap the entire return in <TooltipProvider>
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        {/* === Surcharges Card (No change) === */}
        {parsedData.surcharges.length > 0 && (
          <Card className="border-0 shadow-sm">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="surcharges" className="border-b-0">
                <AccordionTrigger className="px-4 py-2 font-semibold text-base hover:no-underline">
                  <div className="flex items-center gap-2 text-xl">
                    <Euro className="size-6 text-primary" />
                    Доплащане
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-0 pt-0">
                  <div className="space-y-2">
                    {parsedData.surcharges.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary/50 mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        {/* === Discounts Card (No change) === */}
        {parsedData.discounts.length > 0 && (
          <Card className="border-0 shadow-sm">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="discounts" className="border-b-0">
                <AccordionTrigger className="px-4 py-2 font-semibold text-base hover:no-underline">
                  <div className="flex items-center gap-2 text-xl">
                    <Percent className="size-6 text-primary" />
                    Отстъпки
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-0 pt-0">
                  <div className="space-y-2">
                    {parsedData.discounts.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary/50 mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        {/* === Conditions Card (No change) === */}
        {parsedData.conditions.length > 0 && (
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="size-6 text-primary" />
                Други условия
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const midPoint = Math.ceil(parsedData.conditions.length / 2);
                const column1 = parsedData.conditions.slice(0, midPoint);
                const column2 = parsedData.conditions.slice(midPoint);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                    <div className="flex flex-col">
                      <ul className="flex-1 flex flex-col justify-around">
                        {column1.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 mb-2">
                            <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <p
                              className="text-sm text-foreground/80"
                              dangerouslySetInnerHTML={{
                                __html: item.replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>",
                                ),
                              }}
                            />
                          </div>
                        ))}
                      </ul>
                    </div>

                    {column2.length > 0 && (
                      <div className="flex flex-col">
                        <ul className="flex-1 flex flex-col justify-around">
                          {column2.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 mb-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                              <p
                                className="text-sm text-foreground/80"
                                dangerouslySetInnerHTML={{
                                  __html: item.replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>",
                                  ),
                                }}
                              />
                            </div>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* --- Flight Info Section (MODIFIED) --- */}
        {parsedData.flightInfo.map((flightSection, index) => (
          <Card
            key={index}
            className={`border-0 shadow-sm ${
              isSingleFlightCard ? "lg:col-span-2" : "lg:col-span-1"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plane className="h-5 w-5 text-primary" />
                {flightSection.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flightSection.tables.length > 0 ? (
                <div
                  className={`grid grid-cols-1 ${
                    flightSection.tables.length > 1 ? "lg:grid-cols-2" : ""
                  } gap-4`}
                >
                  {flightSection.tables.map((table, tIdx) => (
                    // 3. Removed `overflow-x-auto`
                    <div key={tIdx}>
                      {/* ------------ */}
                      <Table className="bg-secondary-foreground/30  min-w-full">
                        <TableHeader>
                          <TableRow>
                            {table.headers.map((header, hIdx) => (
                              <TableHead
                                key={hIdx}
                                className={hIdx === 0 ? "lg:w-[50%]" : ""}
                              >
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.rows.map((row, rIdx) => (
                            <TableRow key={rIdx}>
                              {row.map((cell, cIdx) => (
                                // 4. Add a max-width (e.g., max-w-60)
                                <TableCell
                                  key={cIdx}
                                  className="text-sm font-medium max-w-60"
                                >
                                  {/* 5. Add the Tooltip wrapper */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      {/* 6. Add a div with the `truncate` class */}
                                      <div className="truncate">{cell}</div>
                                    </TooltipTrigger>
                                    {/* --- THIS IS THE CHANGE --- */}
                                    <TooltipContent
                                      className={
                                        flightSection.tables.length === 1 && isSingleFlightCard
                                          ? "-translate-x-24"
                                          : ""
                                      }
                                    >
                                      {/* 7. The content is the full cell text */}
                                      <p>{cell}</p>
                                    </TooltipContent>
                                    {/* --- END OF CHANGE --- */}
                                  </Tooltip>
                                </TableCell>
                                // --- END MODIFIED CELL ---
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/80 whitespace-pre-line">
                  {flightSection.textFallback}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider> // 2. Closing tag for TooltipProvider
  );
}