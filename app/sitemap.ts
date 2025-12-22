import { MetadataRoute } from 'next'
import { getHolidays } from './actions/get-holidays'
import { getHotels } from './actions/get-hotels'
import { getYachts } from './actions/get-yachts'

const BASE_URL = 'https://globaltravel.bg'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes for both locales
    const routes = [
        '',
        '/holidays',
        '/hotels',
        '/flights',
        '/rect-a-car',
        '/transfers',
        '/yachts',
        '/contact',
        '/card',
    ]

    const staticEntries = routes.flatMap(route => [
        {
            url: `${BASE_URL}/bg${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        },
        {
            url: `${BASE_URL}/en${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        },
    ])

    // Fetch data for dynamic routes
    // We fetch a large batch to cover most items. In a huge site, we'd need pagination logic here.
    const [holidays, hotelsData, yachts] = await Promise.all([
        getHolidays(1000),
        getHotels(1000),
        getYachts(1000),
    ])

    const holidaysEntries = holidays.flatMap(holiday => [
        {
            url: `${BASE_URL}/bg/holidays/${holiday.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/en/holidays/${holiday.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
    ])

    const hotelsEntries = hotelsData.hotels.flatMap(hotel => [
        {
            url: `${BASE_URL}/bg/hotels/${hotel.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/en/hotels/${hotel.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
    ])

    const yachtsEntries = yachts.flatMap(yacht => [
        {
            url: `${BASE_URL}/bg/yachts/${yacht.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/en/yachts/${yacht.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
    ])

    return [
        ...staticEntries,
        ...holidaysEntries,
        ...hotelsEntries,
        ...yachtsEntries,
    ]
}
