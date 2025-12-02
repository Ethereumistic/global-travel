import { PageSlider } from "@/components/layout/page-slider";
import { HotelList } from "@/components/hotel/hotel-list";
import { Building2 } from "lucide-react";
import { Hotel, HotelsResponse } from "@/lib/types-hotel";
import { ALL_COUNTRIES } from "@/lib/constants";

const HOTEL_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/1.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/2.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/3.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/4.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/5.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/6.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/7.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/8.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hotels/9.jpg",

];

async function getHotels(limit = 20, offset = 0): Promise<HotelsResponse> {
    try {
        const apiUrl = `https://live.planet.bg/api/v1/hotels/?limit=${limit}&offset=${offset}`;
        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error("Failed to fetch hotels:", res.statusText);
            return { hotels: [], total: 0 };
        }

        const data = await res.json();
        return {
            hotels: data.results || [],
            total: data.count || 0,
        };
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return { hotels: [], total: 0 };
    }
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HotelsPage(props: PageProps) {
    const resolvedParams = await props.searchParams;

    const countryFilter = typeof resolvedParams.country === 'string'
        ? resolvedParams.country.toLowerCase()
        : null;

    // Fetch initial data
    // Fetch a large number of hotels to allow for client-side filtering and pagination
    const { hotels: allHotels } = await getHotels(1000);

    // Filter data
    const filteredHotels = countryFilter
        ? allHotels.filter((h) => h.country_code?.toLowerCase() === countryFilter)
        : allHotels;

    // Only show enabled hotels
    const enabledHotels = filteredHotels.filter(h => h.status === 'enabled');

    const countryName = countryFilter
        ? ALL_COUNTRIES.find(c => c.abbr === countryFilter)?.name || countryFilter.toUpperCase()
        : "Всички дестинации";

    return (
        <main className="min-h-screen bg-slate-50/50">
            <PageSlider
                images={HOTEL_HERO_IMAGES}
                title="Луксозни Хотели"
                subtitle="Открийте комфорт и стил в нашата селекция от премиум хотели."
                icon={<Building2 className="h-8 w-8 text-white" />}
                className="h-96 rounded-b-xl"
                searchType="hotels"
            />

            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center gap-3 mb-8">
                    {countryFilter && (
                        <img
                            src={`https://flagcdn.com/${countryFilter}.svg`}
                            alt="flag"
                            className="w-8 h-auto shadow-sm rounded-sm"
                        />
                    )}
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        {countryFilter ? `Хотели в ${countryName}` : "Нашите Предложения"}
                    </h2>
                </div>

                <HotelList
                    initialHotels={enabledHotels}
                />
            </div>
        </main>
    );
}
