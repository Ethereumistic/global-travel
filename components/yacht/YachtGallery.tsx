"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { YachtImage } from "@/lib/types-yacht";

interface YachtGalleryProps {
  images: YachtImage[];
  title: string;
}

export function YachtGallery({ images, title }: YachtGalleryProps) {
  const [mainCarouselApi, setMainCarouselApi] = React.useState<CarouselApi>();
  const [mainImageIndex, setMainImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!mainCarouselApi) return;

    mainCarouselApi.on("select", () => {
      setMainImageIndex(mainCarouselApi.selectedScrollSnap());
    });
  }, [mainCarouselApi]);

  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
      {/* LEFT SIDE: Main Carousel */}
      <div className="lg:col-span-1 relative">
        <Carousel setApi={setMainCarouselApi} className="w-full">
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={img.id || idx}>
                <div className="relative w-full aspect-square rounded-l-xl overflow-hidden shadow-lg bg-slate-100">
                  <Image
                    src={img.image || "/placeholder.svg"}
                    alt={`${title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious variant="ghost" className="left-4 bg-white/20 hover:bg-white/40 border-0 text-white backdrop-blur-sm" />
          <CarouselNext variant="ghost" className="right-4 bg-white/20 hover:bg-white/40 border-0 text-white backdrop-blur-sm" />

          {/* Counter Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60 backdrop-blur-md border-0">
                {mainImageIndex + 1} / {images.length}
              </Badge>
            </div>
          )}
        </Carousel>
      </div>

      {/* RIGHT SIDE: 2x2 Thumbnails Grid */}
      <div className="grid grid-cols-2 gap-2 h-full">
        {images.slice(1, 5).map((img, idx) => (
          <button
            key={img.id || idx}
            onClick={() => mainCarouselApi?.scrollTo(idx + 1)}
            className={`relative w-full aspect-square overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow bg-slate-100 ${idx === 1 ? "rounded-tr-xl" : idx === 3 ? "rounded-br-xl" : ""
              }`}
          >
            <Image
              src={img.image || "/placeholder.svg"}
              alt={`${title} ${idx + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}