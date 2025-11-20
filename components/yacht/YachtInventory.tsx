import { Check, Anchor } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function YachtInventory({ inventory }: { inventory: Record<string, string[]> | null }) {
  if (!inventory) return null;

  return (
    <div className="w-full">
      {/* type="multiple" allows opening several sections at once. 
          Change to type="single" collapsible if you only want one open at a time. */}
      <Accordion type="multiple" className="w-full space-y-4">
        {Object.entries(inventory).map(([category, items], idx) => (
          <AccordionItem 
            key={idx} 
            value={`item-${idx}`} 
            className="border rounded-xl px-4 bg-white shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg text-primary font-semibold">
                <Anchor className="h-4 w-4 text-third" />
                {category}
                <span className="ml-2 text-xs font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600 group">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}