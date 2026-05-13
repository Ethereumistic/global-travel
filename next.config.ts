import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // 'domains' is deprecated. 'remotePatterns' is the new, more secure standard.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/gh/Ethereumistic/**", // Allows all images from this host
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "**", // Allows all images from this host
      },
      {
        protocol: "https",
        hostname: "www.profitours.bg",
        port: "",
        pathname: "**", // Allows all images from this host
      },
      {
        protocol: "https",
        hostname: "planet-media.s3.amazonaws.com",
        port: "",
        pathname: "**", // Allows all images from this host
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**", // Allows all images from this host
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "**", // Allows all images from this host
      },
    ],
  },
};

export default nextConfig;