/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output for Cloudflare Workers
  output: 'standalone',
  
  // Exclude studio route and Sanity studio dependencies from Cloudflare build
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './app/studio/**/*',
        './node_modules/sanity/**',
        './node_modules/styled-components/**',
        './node_modules/@sanity/**',
      ],
    },
  },
  
  // Redirect /studio to Vercel URL
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: process.env.NEXT_PUBLIC_STUDIO_URL + '/:path*',
      },
    ]
  },
  
  // Optimize for edge runtime
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
