import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define logo URLs
const LOGO = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logo.svg";
const LOGOTYPE = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logotype.svg";
const LOGOMARK = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logomark.svg";

/**
 * A responsive logo component for ULTRABUILD.
 * Assumes you are using Tailwind CSS with the 'dark' class strategy.
 *
 * - Mobile (default): Logo stacked on top of smaller text.
 * - Desktop (md breakpoint): Logo to the left of larger text.
 */
const Logo = () => {
  // --- Mobile dimensions (1.5x smaller than 90x62) ---
  // Width: 90 / 1.5 = 60px
  // Height: 62 / 1.5 = 41.33px (we'll use 41px)
  
  return (
    <Link
      href="/"
      className="
        flex items-center 
        gap-4
      "
      aria-label="Global Travel Homepage"
    >
      <Image
        src={LOGOMARK}
        alt="Global Travel Logo"
        className="
          object-contain
        "
        width={60}  // Base width (largest size)
        height={60} // Base height (largest size)
      />
      <Image
        src={LOGOTYPE}
        alt="Global Travel Logo"
        className="
          object-contain
        "
        width={200}  // Base width (largest size)
        height={110} // Base height (largest size)
      />


    </Link>
  );
};

export default Logo;