import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/studio/', '/api/'],
            crawlDelay: 10,
        },
        sitemap: 'https://global-travel.bg/sitemap.xml',
    }
}
