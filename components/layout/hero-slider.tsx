// components/layout/hero-slider.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DestinationListItem } from "@/app/api/destinations/route";
import { DestinationSearchbar } from "@/components/hero/destination-searchbar";
import { Button } from "@/components/ui/button";

// List of available images
const heroImages = [
  "spain", "brazil", "cambodia", "china", "egypt", "germany",
  "india", "japan", "mexico", "peru", "petra", "romania", "rome", "turkey",
];
const imageBaseUrl =
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/";

interface HeroSliderProps {
  /**
   * Tailwind CSS class for the hero height. Defaults to 'h-96'.
   */
  heightClass?: string;
  /**
   * Optional: A title to display.
   */
  title?: string;
  /**
   * Optional: A subtitle to display below the title.
   */
  subtitle?: string;
  /**
   * Optional: A lucide-react icon component to display.
   */
  icon?: LucideIcon;
  /**
   * The currently selected destination (or null).
   */
  selectedDestination: DestinationListItem | null;
  /**
   * Callback function to update the selected destination.
   */
  onDestinationSelect: (destination: DestinationListItem | null) => void;
}

/**
 * A full-width hero component with a fading image slider background.
 * It renders a vertically centered row containing an optional
 * title/icon block and the destination search bar.
 */
export function HeroSlider({
  heightClass = "h-96", // Default height
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
    // Use the dynamic heightClass and the -translate-y-20 from your original file
    // I've removed the buggy 'h-[26rem]' that was overriding your heightClass
    <div className={`relative w-full -translate-y-20 ${heightClass}`}>
      {/* Image Slider */}
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

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 " />

      {/* Content */}
      {/* This outer div vertically centers the content grid using flex.
        It accounts for the navbar height with `pt-20`.
      */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center">
        
        {/* This grid creates the 2-column layout (1-col on mobile)
          and aligns the content within.
        */}
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

          {/* Right Side: Searchbar and Clear Button */}
          {/* This column justifies itself to the end on desktop */}
          <div className="relative w-full max-w-xs md:justify-self-end">
            <DestinationSearchbar
              // Pass the onSelect, but only the `DestinationListItem`
              onSelect={(dest) => onDestinationSelect(dest)}
            />
            {selectedDestination && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDestinationSelect(null)} // Call the handler with null
                title="Изчисти филтъra"
                className="absolute top-1/2 -translate-y-1/2 right-2 text-white/60 hover:text-white p-1 h-auto"
              >
                <X className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}