import Image from "next/image";
import { Users, DoorOpen, Bath, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Yacht } from "@/lib/types-yacht";
import { ALL_COUNTRIES } from "@/lib/constants";
import Link from "next/link";

interface YachtCardProps {
  yacht: Yacht;
}

export function YachtCard({ yacht }: YachtCardProps) {
  // Resolve full country name from constants if possible
  const countryObj = ALL_COUNTRIES.find(
    (c) => c.abbr === yacht.country?.toLowerCase()
  );
  const countryName = countryObj ? countryObj.name : yacht.country;
  
  // Get lowercase code for flagcdn (assuming yacht.country is the ISO code e.g. "BG")
  const countryCode = yacht.country?.toLowerCase();
  const yachtLink = yacht.id ? `/yachts/${yacht.id}` : "#";

  return (
    <Link href={`/yachts/${yacht.id}?c=${yacht.country}`} 
    className="block h-full group focus:outline-none">
    <Card className="group overflow-hidden border-none shadow-lg transition-all hover:shadow-xl flex flex-col h-full p-0">
      {/* Image Section */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={yacht.main_image.image}
          alt={yacht.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="glass">
             {yacht.available_as}
          </Badge>
        </div>
        
        {/* Flag Overlay (Bottom Left of Image) - Replaced Price */}
        {countryCode && (
            <div className="absolute bottom-3 left-3">
                <div className="relative w-8 h-6 rounded shadow-sm overflow-hidden border border-white/20">
                    {/* Using standard img for external flagcdn to avoid Next/Image config allowlist issues, 
                        or you can use Next Image if flagcdn is in your next.config.js */}
                    <img 
                        src={`https://flagcdn.com/${countryCode}.svg`} 
                        alt={countryName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 pt-0 flex-grow ">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg line-clamp-1 text-foreground group-hover:text-blue-600 transition-colors">
                {yacht.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {yacht.home_port}, {countryName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 py-2 border-t border-border/50">
            <div className="flex flex-col items-center justify-center text-center p-2 bg-muted/30 rounded-lg">
                <Users className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs text-muted-foreground">Гости</span>
                <span className="text-sm font-semibold">{yacht.guests}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 bg-muted/30 rounded-lg">
                <DoorOpen className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs text-muted-foreground">Каюти</span>
                <span className="text-sm font-semibold">{yacht.cabins}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 bg-muted/30 rounded-lg">
                <Bath className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs text-muted-foreground">WC</span>
                <span className="text-sm font-semibold">{yacht.wc || 0}</span>
            </div>
        </div>

        <div className="">
        <span className="text-sm font-light opacity-90 ">Цени от</span>
        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white flex justify-center mt-2">
            <span className="text-xl font-bold">€ {yacht.min_price.value}</span>
            <span className="text-xs font-normal opacity-80"> / седмица</span>
        </Button>
        </div>
      </CardContent>

    </Card>
    </Link>
  );
}