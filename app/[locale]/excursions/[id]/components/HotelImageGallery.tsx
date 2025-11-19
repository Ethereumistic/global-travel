// HotelImageGallery.tsx (Updated & Simplified)

"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface HotelImageGalleryProps {
  images: string[];
  hotelName: string;
  setApi: (api: CarouselApi) => void;
}

export function HotelImageGallery({
  images,
  hotelName,
  setApi,
}: HotelImageGalleryProps) {
  
  if (!images || images.length === 0) {
    return (
       <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md bg-gray-100">
         <Image
           src={"/placeholder.svg"} // This placeholder image will be shown
           alt={`${hotelName} placeholder`}
           fill
           className="object-cover"
         />
       </div>
    );
  }
  
  return (
    // --- ПРЕМАХНАТ Е ВЪНШНИЯТ `div` ---
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md">
              <Image
                src={img || "/placeholder.svg"}
                alt={`${hotelName} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="glass" className="left-4" />
      <CarouselNext variant="glass" className="right-4" />
    </Carousel>
  );
}