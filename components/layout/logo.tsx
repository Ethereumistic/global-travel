import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define logo URLs
const LOGO = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logo.svg";
const LOGOTYPE = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logotype.svg";
const LOGOMARK = "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/logo/logomark.svg";

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
          w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14
        "
        width={60}  // Base width for aspect ratio
        height={60} // Base height for aspect ratio
      />
      <Image
        src={LOGOTYPE}
        alt="Global Travel Logo"
        className="
          object-contain
          w-48 h-auto md:w-36 lg:w-48  
        "
        width={200}  // Base width for aspect ratio
        height={100} // Base height for aspect ratio
      />


    </Link>
  );
};

export default Logo;