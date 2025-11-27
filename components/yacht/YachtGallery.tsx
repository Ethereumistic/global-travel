"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
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
  mainImage: YachtImage;
  images: YachtImage[];
  title: string;
}

// Helper component for Image with loading state
const ImageWithLoader = ({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};

export function YachtGallery({ mainImage, images, title }: YachtGalleryProps) {
  const [mainCarouselApi, setMainCarouselApi] = React.useState<CarouselApi>();
  const [mainImageIndex, setMainImageIndex] = React.useState(0);

  // Combine main image with other images for the carousel
  const allImages = React.useMemo(() => {
    const imgs = [mainImage];
    if (images && images.length > 0) {
      imgs.push(...images);
    }
    return imgs;
  }, [mainImage, images]);

  React.useEffect(() => {
    if (!mainCarouselApi) return;

    mainCarouselApi.on("select", () => {
      setMainImageIndex(mainCarouselApi.selectedScrollSnap());
    });
  }, [mainCarouselApi]);

  if (!mainImage && (!images || images.length === 0)) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
      {/* LEFT SIDE: Main Carousel */}
      <div className={`relative ${images.length === 0 ? "lg:col-span-2" : "lg:col-span-1"}`}>
        <Carousel setApi={setMainCarouselApi} className="w-full">
          <CarouselContent>
            {allImages.map((img, idx) => (
              <CarouselItem key={img.id || idx}>
                <div className={`relative w-full ${images.length === 0 ? "aspect-[21/9]" : "aspect-square"} rounded-xl ${images.length > 0 ? "lg:rounded-none lg:rounded-l-xl" : ""} overflow-hidden shadow-lg bg-slate-100`}>
                  <ImageWithLoader
                    src={img.image || "/placeholder.svg"}
                    alt={`${title} ${idx + 1}`}
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious variant="ghost" className="left-4 bg-white/20 hover:bg-white/40 border-0 text-white backdrop-blur-sm" />
          <CarouselNext variant="ghost" className="right-4 bg-white/20 hover:bg-white/40 border-0 text-white backdrop-blur-sm" />

          {/* Counter Badge */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60 backdrop-blur-md border-0">
                {mainImageIndex + 1} / {allImages.length}
              </Badge>
            </div>
          )}
        </Carousel>
      </div>

      {/* RIGHT SIDE: Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 h-full hidden lg:grid">
          {(() => {
            // Logic for grid display based on number of sub-images

            // Case 0: 1 sub image (Total 2) -> 1 large image filling the right side
            if (images.length === 1) {
              return (
                <button
                  key={images[0].id || 0}
                  onClick={() => mainCarouselApi?.scrollTo(1)}
                  className="relative w-full h-full overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow bg-slate-100 rounded-r-xl col-span-2 row-span-2"
                >
                  <ImageWithLoader
                    src={images[0].image || "/placeholder.svg"}
                    alt={`${title} sub 1`}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              );
            }

            // Case 1: 2 sub images (Total 3) -> 2 tall images side-by-side
            if (images.length === 2) {
              return images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => mainCarouselApi?.scrollTo(idx + 1)}
                  className={`relative w-full h-full overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow bg-slate-100 ${idx === 0 ? "rounded-none" : "rounded-r-xl"}`}
                  style={{ gridRow: "span 2" }}
                >
                  <ImageWithLoader
                    src={img.image || "/placeholder.svg"}
                    alt={`${title} sub ${idx + 1}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ));
            }

            // Case 2: 3 sub images (Total 4) -> 3 images + 1 repeated (main image)
            let gridImages = [];
            if (images.length === 3) {
              gridImages = [...images, mainImage];
            } else {
              // Default behavior (4 or more sub images) -> take first 4
              gridImages = images.slice(0, 4);
            }

            return gridImages.map((img, idx) => {
              // Calculate actual index for carousel scroll
              // If we are repeating the main image at index 3, we should scroll to 0
              let scrollIndex = idx + 1;
              if (images.length === 3 && idx === 3) {
                scrollIndex = 0; // Scroll to main image
              }

              return (
                <button
                  key={`${img.id || idx}-${idx}`}
                  onClick={() => mainCarouselApi?.scrollTo(scrollIndex)}
                  className={`relative w-full aspect-square overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow bg-slate-100 ${idx === 1 ? "rounded-tr-xl" : idx === 3 ? "rounded-br-xl" : ""
                    }`}
                >
                  <ImageWithLoader
                    src={img.image || "/placeholder.svg"}
                    alt={`${title} grid ${idx + 1}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}