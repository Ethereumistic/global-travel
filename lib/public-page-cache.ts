// These routes render public catalogue data only. Preserve every query that
// changes their server-rendered output, while ignoring tracking/cache-bust args.
export const PUBLIC_PAGE_CACHE = [
  { source: '/holidays', query: ['country', '_rsc'], seconds: 300 },
  { source: '/hotels', query: ['country', '_rsc'], seconds: 300 },
  { source: '/yachts', query: ['country', '_rsc'], seconds: 300 },
  { source: '/holidays/:id', query: ['_rsc'], seconds: 3600 },
  { source: '/hotels/:id', query: ['_rsc'], seconds: 3600 },
  { source: '/yachts/:id', query: ['c', '_rsc'], seconds: 3600 },
  { source: '/flights/:id', query: ['_rsc'], seconds: 3600 },
];

export function publicPageHeaders() {
  return PUBLIC_PAGE_CACHE.map(({ source, query, seconds }) => ({
    source,
    // Never force shared caching for Server Actions or authenticated previews.
    missing: [
      { type: 'header' as const, key: 'next-action' },
      { type: 'cookie' as const, key: '__prerender_bypass' },
      { type: 'cookie' as const, key: '__next_preview_data' },
    ],
    headers: [
      { key: 'Vercel-CDN-Cache-Control', value: `public, s-maxage=${seconds}, stale-while-revalidate=60` },
      { key: 'Netlify-CDN-Cache-Control', value: `public, s-maxage=${seconds}, stale-while-revalidate=60, durable` },
      { key: 'Netlify-Vary', value: `query=${query.join('|')}` },
    ],
  }));
}
