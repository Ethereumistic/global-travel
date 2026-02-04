import { PageSlider } from "@/components/layout/page-slider";
import { HotelList } from "@/components/hotel/hotel-list";
import { Building2 } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants";
import { getHotels } from "@/app/actions/get-hotels";


import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Хотели | Global Travel",
    description: "Резервирайте хотел за вашата почивка. Богат избор от хотели в цял свят.",
};

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

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HotelsPage(props: PageProps) {
    const resolvedParams = await props.searchParams;

    const countryFilter = typeof resolvedParams.country === 'string'
        ? resolvedParams.country.toLowerCase()
        : null;

    // Fetch initial data (limit 12)
    // getHotels returns { hotels, total }
    const { hotels: initialHotels } = await getHotels(12, 0, countryFilter);

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
                    initialHotels={initialHotels}
                    country={countryFilter}
                />
            </div>
        </main>
    );
}
