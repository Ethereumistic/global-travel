export const SITE_URL = new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://global-travel.bg').origin;
export const HOTEL_SITEMAP_SIZE = 1000;

// Do not invite crawlers to fetch half a million cold, server-rendered pages
// unless that SEO scope and its traffic budget have been explicitly enabled.
export function hotelSitemapsEnabled() {
  return process.env.INDEX_HOTEL_CATALOGUE === 'true';
}

export function xmlEscape(value: string) {
  return value.replace(/[<>&'\"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
}

export function xmlResponse(body: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=300',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300, durable',
    },
  });
}
