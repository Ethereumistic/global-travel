// components/hero-video.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { DestinationSearchbar } from "./destination-searchbar";
import type { DestinationListItem } from '@/app/api/destinations/route';

type Props = {
  // path or absolute CDN urls; by default looks in /videos/
  webmSrc?: string;   // e.g. "/videos/hero.webm"
  mp4Src?: string;    // e.g. "/videos/hero.mp4"
  poster?: string;    // e.g. "/images/hero-poster.jpg"
  className?: string;
};

const BULGARIAN_SLOGANS = [
    "Твоето следващо приключение те очаква.",
    "Създай спомени, които остават завинаги.",
    "Светът е книга. Отвори нова страница.",
    "Открий непознатото. Изживей повече.",
    "Нови места, нови приятели, нов свят."
  ];

// --- MODIFICATION: This handler is no longer needed here ---
// const handleDestinationSelect = (destination: DestinationListItem) => {
//     console.log('Selected destination:', destination);
//     // You can add navigation or other logic here
//   };
// --- END MODIFICATION ---

export default function HeroVideo({
  webmSrc = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/hero-video.webm",
  mp4Src = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/hero-video.webm",
  poster = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/hero-video.webm",
  className = "",
}: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- MODIFICATION: Add state for the searchbar ---
  const [selectedDestination, setSelectedDestination] = 
    useState<DestinationListItem | null>(null);
  // --- END MODIFICATION ---

  const slogans = useMemo(() => BULGARIAN_SLOGANS, []);

  useEffect(() => {
    // rotate every 6s
    if (reduceMotion) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slogans.length);
    }, 6000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reduceMotion, slogans.length]);

  // mobile autoplay tweaks: ensure muted + playsInline for iOS
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    // try to play on mount (browsers may block if not user-initiated)
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // suppressed - user gesture required, fallback to showing poster
      });
    }
  }, []);

  // --- MODIFICATION: Add handlers for the searchbar ---
  const handleSelect = (destination: DestinationListItem) => {
    setSelectedDestination(destination);
    console.log('Selected:', destination);
    // You can add navigation logic here, e.g.:
    // router.push(`/destinations/${destination.id}`);
  };

  const handleClear = () => {
    setSelectedDestination(null);
    console.log('Cleared selection');
  };
  // --- END MODIFICATION ---


  return (
    <section
      className={`relative w-full h-[90vh] overflow-hidden bg-black rounded-b-2xl ${className}`}
      aria-label="Hero video"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Optional higher-efficiency source first (browser chooses first it supports) */}
        {/* webm (VP9 or AV1 WebM) */}
        <source src={webmSrc} type="video/webm" />
        {/* fallback h264 mp4 */}
        <source src={mp4Src} type="video/mp4" />
        {/* ultimate fallback */}
        Your browser does not support the video element.
      </video>

      {/* Poster <Image> fallback for browsers that block autoplay or when js disabled */}
      {/* <div className="sr-only">
        <Image src={poster} alt="Hero poster" width={1600} height={900} />
      </div> */}

      {/* Black overlay (40%) */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content container */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-5xl font-geologica text-center text-white">
          <motion.h1
            key={index}
            initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-5xl font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]

 "
          >
            {slogans[index]}
          </motion.h1>

          <motion.div
            initial={reduceMotion ? {} : { opacity: 0 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 flex justify-center gap-4"
          >
            {/* ... commented out links ... */}
            
            {/* --- MODIFICATION: Update Searchbar props --- */}
            <div className="absolute bottom-[33%] left-0 right-0 transform -translate-y-1/2 z-10 w-full">
                <DestinationSearchbar
                    selectedDestination={selectedDestination}
                    onSelect={handleSelect}
                    onClear={handleClear}
                />
            </div>
            {/* --- END MODIFICATION --- */}
          </motion.div>


        </div>
      </div>
    </section>
  );
}