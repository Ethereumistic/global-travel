// components/layout/hero-slider.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { DestinationListItem } from "@/app/api/destinations/route";
import { DestinationSearchbar } from "@/components/hero/destination-searchbar";

// ... heroImages and imageBaseUrl ...
const heroImages = [
  "spain", "brazil", "cambodia", "china", "egypt", "germany",
  "india", "japan", "mexico", "peru", "petra", "romania", "rome", "turkey",
];
const imageBaseUrl =
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/";

interface HeroSliderProps {
  // --- MODIFICATION: Renamed 'heightClass' to 'className' ---
  /**
   * Optional additional class names to apply to the root wrapper.
   * Defaults to 'h-96'.
   */
  className?: string;
  // --- END MODIFICATION ---
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  selectedDestination: DestinationListItem | null;
  onDestinationSelect: (destination: DestinationListItem | null) => void;
}

export function HeroSlider({
  // --- MODIFICATION: Renamed prop and kept the default value ---
  className = "h-96",
  // --- END MODIFICATION ---
  title,
  subtitle,
  icon: Icon,
  selectedDestination,
  onDestinationSelect,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    // --- MODIFICATION: Applied the 'className' prop to the div ---
    <div className={`relative w-full -translate-y-20 ${className}`}>
    {/* --- END MODIFICATION --- */}
      
      {/* ... Image Slider and Overlay ... */}
      {heroImages.map((imgName, index) => (
        <Image
          key={imgName}
          src={`${imageBaseUrl}${imgName}.png`}
          alt={`View of ${imgName}`}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          sizes="100vw"
        />
      ))}
      <div className="absolute inset-0 bg-black/40 " />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side: Title and Subtitle */}
          <div className="text-white">
            <div className="flex gap-4 items-center">
              {Icon && <Icon className="size-12 flex-shrink-0" />}
              <div>
                {title && (
                  <h1 className="text-4xl font-bold  drop-shadow-md">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="hidden md:block text-lg drop-shadow">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Searchbar */}
          <div className="w-full max-w-xs md:justify-self-end">
            <DestinationSearchbar
              onSelect={(dest) => onDestinationSelect(dest)}
              selectedDestination={selectedDestination}
              onClear={() => onDestinationSelect(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}