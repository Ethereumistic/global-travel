"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import type { YachtImage } from "@/lib/types-yacht"; 

export function YachtGallery({ images, title }: { images: YachtImage[], title: string }) {
  const displayImages = images.slice(0, 5);
  const remaining = images.length - 5;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-6 relative">
      {/* Main Large Image */}
      <div className="md:col-span-2 md:row-span-2 relative h-full w-full bg-gray-100">
        {displayImages[0] && (
          <Image
            src={displayImages[0].image}
            alt={`${title} main`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        )}
      </div>

      {/* Smaller Images Grid */}
      <div className="hidden md:grid grid-cols-2 md:col-span-2 md:row-span-2 gap-2">
        {displayImages.slice(1).map((img, idx) => (
          <div key={img.id} className="relative w-full h-full bg-gray-100">
            <Image
              src={img.image}
              alt={`${title} ${idx + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            {idx === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <span className="text-white font-bold text-lg">+{remaining} снимки</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile "Show All" Button (simplistic approach) */}
      <Button 
        variant="secondary" 
        size="sm" 
        className="absolute bottom-4 right-4 shadow-lg gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        Галерия
      </Button>
    </div>
  );
}