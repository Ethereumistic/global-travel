"use client";

import * as React from "react";
import Image from "next/image";

// List of available images
const heroImages = [
  "spain",
  "brazil",
  "cambodia",
  "china",
  "egypt",
  "germany",
  "india",
  "japan",
  "mexico",
  "peru",
  "petra",
  "romania",
  "rome",
  "turkey",
];
const imageBaseUrl =
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/";

interface HeroSliderProps {
  /**
   * The content to display on top of the hero (e.g., titles, search bars).
   */
  children: React.ReactNode;
  /**
   * Tailwind CSS class for the hero height. Defaults to 'h-80'.
   * Examples: 'h-80', 'h-96', 'h-[500px]'
   */
  heightClass?: string;
}

/**
 * A full-width hero component with a fading image slider background.
 * It accepts children to be overlaid on top.
 */
export function HeroSlider({
  children,
  heightClass = "h-80", // Default height
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    // Set up an interval to change the image every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    // Use the dynamic heightClass
    <div className={`relative w-full -translate-y-20 ${heightClass} h-[26rem]`}>
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
          priority={index === 0} // Load the first image faster
          sizes="100vw"
        />
      ))}

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 " />

      {/* Content */}
      {/* pt-20 for navbar, pb-8 for spacing */}
      <div className="absolute inset-0 z-10 max-w-7xl mx-auto px-4 py-38 md:py-20 flex flex-col justify-end">
        {children}
      </div>
    </div>
  );
}