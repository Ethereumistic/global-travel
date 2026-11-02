import 'server-only';

export const catalogueHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
  'Netlify-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60, durable',
  'Netlify-Vary': 'query',
};

export function catalogueError(status: number) {
  return Response.json({ error: status === 400 ? 'Invalid catalogue request' : 'Catalogue temporarily unavailable' }, {
    status, headers: { 'Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store', 'Netlify-Vary': 'query' },
  });
}
