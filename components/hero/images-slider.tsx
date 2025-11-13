"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

// 1. MODIFIED PROPS
// We now require currentIndex, onNext, and onPrevious from the parent.
// We remove the internal 'autoplay' logic, as the parent will handle it.
export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  direction = "up",
  currentIndex, // ADDED: The current index to display
  onNext,       // ADDED: Function to call on next
  onPrevious,   // ADDED: Function to call on previous
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  direction?: "up" | "down";
  currentIndex: number; // ADDED
  onNext: () => void;     // ADDED
  onPrevious: () => void; // ADDED
}) => {
  // 2. REMOVED INTERNAL STATE
  // const [currentIndex, setCurrentIndex] = useState(0); // <-- REMOVED
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  // 3. REMOVED handleNext / handlePrevious
  // They are no longer needed as we call props directly.

  useEffect(() => {
    loadImages();
  }, []); // This loadImages effect is still fine

  const loadImages = () => {
    setLoading(true);
    const loadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages as string[]);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to load images", error));
  };

  // 4. MODIFIED KEYDOWN EFFECT
  // It now calls the onNext/onPrevious props directly.
  // The dependency array is updated to [onNext, onPrevious].
  // The autoplay interval is completely REMOVED.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        onNext(); // Call prop
      } else if (event.key === "ArrowLeft") {
        onPrevious(); // Call prop
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious]); // Add props to dependency array

  const slideVariants = {
    // ... (slideVariants are unchanged)
    initial: {
      scale: 0,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
    upExit: {
      opacity: 1,
      y: "-150%",
      transition: {
        duration: 1,
      },
    },
    downExit: {
      opacity: 1,
      y: "150%",
      transition: {
        duration: 1,
      },
    },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
      style={{
        perspective: "1000px",
      }}
    >
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div
          className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
        />
      )}

      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            // 5. USE PROPS FOR KEY AND SRC
            key={currentIndex} // Use the currentIndex prop
            src={loadedImages[currentIndex]} // Use the currentIndex prop
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants as any}
            className="image h-full w-full absolute inset-0 object-cover object-center"
          />
        </AnimatePresence>
      )}
    </div>
  );
};