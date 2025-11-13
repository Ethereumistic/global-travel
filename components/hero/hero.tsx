"use client"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"
import { ImagesSlider } from "./images-slider"
import { DestinationSearch } from "../layout/destination-search"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "../ui/button"

type Package = {
  id: number;
  title: string;
  thumbnail: string | null;
};

export function Hero() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // This is now the single source of truth
  const params = useParams();
  const locale = params.locale || 'bg'; 

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data: Package[] = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []); 

  const images = packages
    .map((pkg) => pkg.thumbnail)
    .filter(Boolean) as string[];

  const slides = packages.map((pkg) => ({
    id: pkg.id,
    text: pkg.title,
    buttonText: "Разбери повече →",
  }));

  // 1. DEFINE HANDLER FUNCTIONS
  // These will be passed to the ImagesSlider
  const handleNext = () => {
    if (packages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % packages.length);
  };

  const handlePrevious = () => {
    if (packages.length === 0) return;
    // The (+ packages.length) handles the wrap-around from 0 to the end
    setCurrentIndex((prev) => (prev - 1 + packages.length) % packages.length);
  };

  // 2. MODIFIED AUTOPLAY EFFECT
  // This now calls handleNext() and depends on packages.length
  useEffect(() => {
    if (packages.length === 0) return; // Don't start interval if no packages

    const interval = setInterval(() => {
      handleNext(); // Use the new handler
    }, 7000);

    return () => clearInterval(interval);
  }, [packages.length]); // Re-run if packages.length changes

  // ... (loading and empty states are unchanged)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-900 text-white">
        Loading offers...
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-900 text-white">
        No offers found.
      </div>
    );
  }

  return (
    // 3. PASS NEW PROPS TO IMAGESLIDER
    <ImagesSlider
      className="h-[90vh]"
      images={images}
      currentIndex={currentIndex} // Pass the state down
      onNext={handleNext}         // Pass the handler down
      onPrevious={handlePrevious}   // Pass the handler down
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex} // This key is crucial and already correct
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="text-xl  md:text-6xl text-center text-white py-4 max-w-7xl"
          >
            {/* This will now be in sync */}
            {slides[currentIndex].text}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex} // This key is crucial and already correct
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Link
              href={`/${locale}/excursions/${slides[currentIndex].id}`}
              className=""
            >
              {/* This will also be in sync */}
              <Button size="lg" className="text-2xl">{slides[currentIndex].buttonText}</Button>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* <DestinationSearch /> */}

      </motion.div>
    </ImagesSlider>
  )
}