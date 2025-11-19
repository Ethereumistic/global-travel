import { Check, Anchor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function YachtInventory({ inventory }: { inventory: Record<string, string[]> | null }) {
  if (!inventory) return null;

  return (
    <div className="space-y-6">
      {Object.entries(inventory).map(([category, items], idx) => (
        <Card key={idx} className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Anchor className="h-4 w-4 text-third" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground group">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}