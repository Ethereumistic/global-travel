import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
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
    ],
  },};

export default withNextIntl(nextConfig);