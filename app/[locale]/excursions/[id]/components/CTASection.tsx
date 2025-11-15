import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-3xl font-bold mb-2">Готови за незабравимо пътешествие?</h3>
            <p className="text-primary-foreground/90 text-lg">
              Свържете се с нас днес и резервирайте вашата екскурзия
            </p>
          </div>
          <Button size="lg" variant="secondary" className="whitespace-nowrap">
            Резервирай сега
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}