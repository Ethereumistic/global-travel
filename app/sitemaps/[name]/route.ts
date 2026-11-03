import { holidayIds, hotelSitemapPage, yachtIds } from '@/lib/planet';
import { HOTEL_SITEMAP_SIZE, SITE_URL, hotelSitemapsEnabled, xmlEscape, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let paths: string[];
  if (name === 'static.xml') {
    paths = ['', '/holidays', '/hotels', '/flights', '/rent-a-car', '/transfers', '/yachts',
      '/contact', '/card', '/faq', '/license', '/privacy-policy', '/terms'];
  } else if (name === 'holidays.xml') {
    paths = (await holidayIds()).map(id => `/holidays/${id}`);
  } else if (name === 'yachts.xml') {
    paths = (await yachtIds()).map(id => `/yachts/${id}`);
  } else if (/^hotels-(0|[1-9]\d*)\.xml$/.test(name)) {
    if (!hotelSitemapsEnabled()) {
      return new Response('Hotel sitemap publishing is disabled', {
        status: 410,
        headers: { 'Netlify-CDN-Cache-Control': 'public, s-maxage=86400, durable', 'Cache-Control': 'public, max-age=3600' },
      });
    }
    const index = Number(name.slice(7, -4));
    if (!Number.isSafeInteger(index) || !Number.isSafeInteger(index * HOTEL_SITEMAP_SIZE)) {
      return new Response('Not found', { status: 404 });
    }
    const start = index * HOTEL_SITEMAP_SIZE;
    let cursor = start;
    let total = Infinity;
    paths = [];
    do {
      const page = await hotelSitemapPage(cursor, start + HOTEL_SITEMAP_SIZE - cursor);
      total = page.total;
      if (start >= total) return new Response('Not found', { status: 404 });
      if (!page.consumed) throw new Error('Hotel sitemap pagination made no progress');
      paths.push(...page.ids.map(id => `/hotels/${id}`));
      cursor += page.consumed;
    } while (cursor < Math.min(total, start + HOTEL_SITEMAP_SIZE));
  } else {
    return new Response('Not found', { status: 404 });
  }
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path =>
    `<url><loc>${xmlEscape(`${SITE_URL}${path}`)}</loc></url>`,
  ).join('')}</urlset>`);
}
