import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Plane, Euro } from "lucide-react";

interface TimeIntervalProps {

  period: { from: string; to: string };
}

export function TimeInterval({

  period,
}: TimeIntervalProps) {
  return (
    <>

        <div className=" mb-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="">
              <div className="flex items-center gap-3">
                <Calendar className="size-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Период на пътуване</p>
                  <p className="text-base font-semibold">
                    {new Date(period.from).toLocaleDateString("bg-BG")} -{" "}
                    {new Date(period.to).toLocaleDateString("bg-BG")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

    </>
  );
}