import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Plane, Euro } from "lucide-react";

interface TravelInfoGridProps {
  duration: number;
  countries: { name: string; abbr: string }[];
  transport: string;
  minPrice: string;
  period: { from: string; to: string };
}

export function TravelInfoGrid({
  duration,
  countries,
  transport,
  minPrice,
  period,
}: TravelInfoGridProps) {
  return (
    <>


      <div className=" gap-2 mb-3">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-1 text-center">
                <Clock className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-base text-muted-foreground mb-1">Продължителност</p>
                <p className="text-xl font-bold">{duration} дни</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-1 text-center mx-auto">
                {countries.length > 0 && (
                  <div className="flex items-center justify-center flex-shrink-0 mb-2 gap-1">
                    {countries.map((country) => (
                      <Image
                        key={country.abbr}
                        src={`https://flagcdn.com/${country.abbr}.svg`}
                        alt={`${country.name} flag`}
                        width={48}
                        height={32}
                        className="border border-gray-300 rounded-[4px]"
                        title={country.name}
                      />
                    ))}
                  </div>
                )}
                <p className="text-base text-muted-foreground mb-1">Дестинации</p>
                <p className="text-lg font-bold line-clamp-1">
                  {countries.map((c) => c.name).join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-1 text-center">
                <Plane className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-base text-muted-foreground mb-1">Транспорт</p>
                <p className="text-lg font-bold line-clamp-1">{transport}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-1 text-center">
                <Euro className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-base text-muted-foreground mb-1">Цена от</p>
                <p className="text-2xl font-bold text-primary">{minPrice}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - placeholder for overview */}
        <div className="grid-rows-2 space-y-3">
          {/* Overview and Price Note will be inserted here */}
        </div>
      </div>
    </>
  );
}