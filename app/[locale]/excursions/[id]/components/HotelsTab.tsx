// HotelsTab.tsx (Reverted to include Accordion, with conditional logic)
"use client";

import * as React from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { HotelImageGallery } from "./HotelImageGallery";
import { HotelCard } from "./HotelCard";

import { Card } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  BedDouble,
  ConciergeBell,
  Utensils,
  Info,
} from "lucide-react";

// --- Types (No change) ---
export interface HotelDetailSection {
  title: string;
  content: string;
  icon: "MapPin" | "BedDouble" | "ConciergeBell" | "Utensils" | "Info";
}
export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  images: string[];
  board?: string;
  overview?: string;
  detailsSections?: HotelDetailSection[];
  minPriceInDouble?: number;
  currency?: string;
  website?: string;
}
// ------------------

interface HotelsTabProps {
  hotels: Hotel[];
}

const iconMap: Record<HotelDetailSection["icon"], React.ElementType> = {
  MapPin: MapPin,
  BedDouble: BedDouble,
  ConciergeBell: ConciergeBell,
  Utensils: Utensils,
  Info: Info,
};

export function HotelsTab({ hotels }: HotelsTabProps) {
  return (
    <div className="space-y-8">
      {hotels.map((hotel) => (
        <HotelEntry key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}

function HotelEntry({ hotel }: { hotel: Hotel }) {
  // ... (State hooks and useEffect for carousels remain exactly the same)
  const [hotelCarouselApi, setHotelCarouselApi] =
    React.useState<CarouselApi>();
  const [thumbCarouselApi, setThumbCarouselApi] =
    React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!hotelCarouselApi) return;
    const onMainSelect = () => {
      const selectedIdx = hotelCarouselApi.selectedScrollSnap();
      setCurrentIndex(selectedIdx);
      if (thumbCarouselApi) {
        thumbCarouselApi.scrollTo(selectedIdx);
      }
    };
    hotelCarouselApi.on("select", onMainSelect);
    onMainSelect();
    return () => {
      hotelCarouselApi.off("select", onMainSelect);
    };
  }, [hotelCarouselApi, thumbCarouselApi]);

  const onThumbClick = (index: number) => {
    hotelCarouselApi?.scrollTo(index);
  };

  return (
    <div className="space-y-4">
      {/* Row 1: The 2-column grid (image + info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Column 1: Main Carousel - ONLY render if images exist */}
        {hotel.images.length > 0 && (
          <HotelImageGallery
            images={hotel.images}
            hotelName={hotel.name}
            setApi={setHotelCarouselApi}
          />
        )}

        {/* Column 2: The Info Card */}
        <HotelCard
          hotel={hotel}
          images={hotel.images}
          hotelName={hotel.name}
          setThumbApi={setThumbCarouselApi}
          onThumbClick={onThumbClick}
          currentIndex={currentIndex}
        />
      </div>

      {/* --- ACCORDION GRID LAYOUT - CONDITIONAL RENDERING --- */}
      {hotel.detailsSections && hotel.detailsSections.length > 0 && (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-2  items-start"
        >
          {hotel.detailsSections.map((section, idx) => {
            // New Condition: Only render this section if it's NOT the single injected room section from the new API.
            // We use a heuristic: if there are NO images AND the icon is BedDouble, skip it.
            if (hotel.images.length === 0 && section.icon === 'BedDouble') {
                 return null;
            }
            
            const Icon = iconMap[section.icon] || Info;
            return (
              // Each item is now its own Card + Accordion
              <Card key={idx} className="border-0 shadow-sm">
                <Accordion type="multiple"  className="w-full">
                  <AccordionItem value={`item-${idx}`} className="border-b-0">
                    <AccordionTrigger className="p-4 font-semibold text-base hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {section.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <p className="text-sm text-foreground/80 whitespace-pre-line">
                        {section.content}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}