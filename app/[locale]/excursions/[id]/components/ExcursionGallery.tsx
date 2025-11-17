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

interface ExcursionGalleryProps {
  images: string[];
  title: string;
}

export function ExcursionGallery({ images, title }: ExcursionGalleryProps) {
  const [mainCarouselApi, setMainCarouselApi] = React.useState<CarouselApi>();
  const [mainImageIndex, setMainImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!mainCarouselApi) return;
    mainCarouselApi.on("select", () => {
      setMainImageIndex(mainCarouselApi.selectedScrollSnap());
    });
  }, [mainCarouselApi]);

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
      <div className="lg:col-span-1 relative">
        <Carousel setApi={setMainCarouselApi} className="w-full">
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="relative w-full aspect-square rounded-l-xl overflow-hidden shadow-lg">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${title} ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="glass" className="left-4" />
          <CarouselNext variant="glass" className="right-4" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <Badge variant="glass" >
                {mainImageIndex + 1} / {images.length}
              </Badge>
            </div>
          )}
        </Carousel>
      </div>

      <div className="grid grid-cols-2 gap-2 h-full">
        {images.slice(1, 5).map((img, idx) => (
          <button
            key={idx}
            onClick={() => mainCarouselApi?.scrollTo(idx + 1)}
            className={`relative w-full aspect-square overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow ${
              idx === 1 ? "rounded-tr-xl" : idx === 3 ? "rounded-br-xl" : ""
            }`}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={`${title} ${idx + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}