import { hotelSitemapPage } from '@/lib/planet';
import { HOTEL_SITEMAP_SIZE, SITE_URL, xmlEscape, xmlResponse } from '@/lib/sitemap';

export const revalidate = 3600;

export async function GET() {
  const { total } = await hotelSitemapPage(0, 1);
  const names = ['static', 'holidays', 'yachts', ...Array.from(
    { length: Math.ceil(total / HOTEL_SITEMAP_SIZE) }, (_, index) => `hotels-${index}`,
  )];
  return xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${names.map(name =>
    `<sitemap><loc>${xmlEscape(`${SITE_URL}/sitemaps/${name}.xml`)}</loc></sitemap>`,
  ).join('')}</sitemapindex>`);
}
