import 'server-only';

export const catalogueHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
  'Netlify-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60, durable',
  // Tracking/random arguments do not change catalogue data. Varying on every
  // query argument lets a scraper bypass the CDN with a new cache-buster.
  'Netlify-Vary': 'query=limit|offset|country',
};

export const destinationHeaders = {
  'Cache-Control': catalogueHeaders['Cache-Control'],
  'Netlify-CDN-Cache-Control': catalogueHeaders['Netlify-CDN-Cache-Control'],
};

export function catalogueError(status: number) {
  return Response.json({ error: status === 400 ? 'Invalid catalogue request' : 'Catalogue temporarily unavailable' }, {
    status, headers: { 'Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store', 'Netlify-Vary': 'query' },
  });
}
