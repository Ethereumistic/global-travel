import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Plane, Euro } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants";

interface TravelInfoGridProps {
  duration: number;
  countries: Array<{
    id?: string;
    name: string;
    iso?: string;
    flagUrl?: string | null;
  }>;
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

  // Helper to resolve Bulgarian Name and Flag URL
  const getCountryDisplayData = (country: TravelInfoGridProps["countries"][0]) => {
    let displayName = country.name;
    let isoCode = country.iso ? country.iso.toLowerCase() : null;

    // 1. Find match in ALL_COUNTRIES
    //    PRIORITY: Match by ISO code (New API provides this, e.g., "de")
    //    FALLBACK: Match by Name (Old API provides this, e.g., "Германия")
    let match = null;
    
    if (isoCode) {
      match = ALL_COUNTRIES.find((c) => c.abbr.toLowerCase() === isoCode);
    } else {
      match = ALL_COUNTRIES.find((c) => c.name.toLowerCase() === country.name.toLowerCase());
    }

    // 2. If a match is found in constants.ts:
    //    - Use the Bulgarian name from the constant (fixes English names from New API)
    //    - Update/Ensure we have the correct ISO code for the flag
    if (match) {
      displayName = match.name;
      isoCode = match.abbr;
    }

    // 3. Construct FlagCDN URL using the resolved ISO code
    //    Using 48x36 PNG for crisp rendering at small sizes, or use .svg if preferred
    const finalFlagUrl = isoCode
      ? `https://flagcdn.com/${isoCode}.svg`
      : null;

    return { name: displayName, flagUrl: finalFlagUrl };
  };

  return (
    <div className="gap-2 mb-3">
      <div className="lg:col-span-1">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Duration Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-1 text-center">
              <Clock className="size-8 mx-auto mb-2 text-primary" />
              <p className="text-base text-muted-foreground mb-1">Продължителност</p>
              <p className="text-xl font-bold">{duration} дни</p>
            </CardContent>
          </Card>

          {/* Destinations Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-1 text-center mx-auto">
              {countries.length > 0 && (
                <div className="flex items-center justify-center flex-wrap mb-2 gap-1">
                  {countries.map((country, idx) => {
                    const { name, flagUrl } = getCountryDisplayData(country);
                    if (!flagUrl) return null;

                    return (
                      <div key={country.id || idx} className="relative w-12 h-8">
                        <Image
                          src={flagUrl}
                          alt={`${name} flag`}
                          fill
                          className="object-cover border border-gray-300 rounded-[4px]"
                          sizes="48px"
                          title={name}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-base text-muted-foreground mb-1">Дестинации</p>
              <p className="text-lg font-bold line-clamp-1">
                {/* Use the helper to get the translated Bulgarian names */}
                {countries.map((c) => getCountryDisplayData(c).name).join(", ")}
              </p>
            </CardContent>
          </Card>

          {/* Transport Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-1 text-center">
              <Plane className="size-8 mx-auto mb-2 text-primary" />
              <p className="text-base text-muted-foreground mb-1">Транспорт</p>
              <p className="text-lg font-bold line-clamp-1">{transport}</p>
            </CardContent>
          </Card>

          {/* Price Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-1 text-center">
              <Euro className="size-8 mx-auto mb-2 text-primary" />
              <p className="text-base text-muted-foreground mb-1">Цена от</p>
              <p className="text-2xl font-bold text-primary">{minPrice}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}