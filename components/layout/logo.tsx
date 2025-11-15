// @/components/layout/logo.tsx

"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Import motion

// Define logo URLs using the new local paths from /public
const LOGO = "/logo/logo.svg";
const LOGOTYPE = "/logo/logotype.svg";
const LOGOMARK = "/logo/logomark.svg";

/**
 * This is the new Loader component, now powered by Framer Motion.
 */
export const Loader = () => {
  return (
    <motion.div
      className="
        fixed inset-0 h-screen w-full 
        flex items-center justify-center 
        bg-linear-to-br from-primary via-secondary to-third z-5000
      "
      // Animate the background container
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // On exit, just fade the background
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* We animate the logo separately for the zoom effect */}
      <motion.div
        initial={{ opacity: 0, scale: 1 }} // Start invisible and at normal size
        animate={{ opacity: 1, scale: 1.5 }} // Fade in and zoom to 125%
        exit={{ opacity: 0, scale: 2 }} // On exit, fade out and zoom in further
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Image
          src={LOGO}
          alt="Global Travel Loading..."
          className="object-contain w-64 h-auto animate-pulse " // Keep the pulse
          width={250}
          height={125}
          priority
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * This is your original default exported Logo component.
 * (No changes needed here)
 */
const Logo = () => {
  return (
    <Link
      href="/"
      className="
        flex items-center 
        gap-2
      "
      aria-label="Global Travel Homepage"
    >
      <Image
        src={LOGOMARK}
        alt="Global Travel Logo"
        className="
          object-contain
          w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14  drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]
        "
        width={60}
        height={60}
      />
      <Image
        src={LOGOTYPE}
        alt="Global Travel Logo"
        className="
          object-contain
          w-48 h-auto md:w-36 lg:w-48  drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]  
        "
        width={200}
        height={100}
      />
    </Link>
  );
};

export default Logo;