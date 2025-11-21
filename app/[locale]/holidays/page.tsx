import { PageSlider } from "@/components/layout/page-slider";
import { HolidayCard } from "@/components/holiday/holiday-card";
import { Palmtree } from "lucide-react";
import { Holiday } from "@/lib/types-holiday";
import { ALL_COUNTRIES } from "@/lib/constants";

const HOLIDAY_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

async function getHolidays(limit = 100, offset = 0): Promise<Holiday[]> {
    try {
        const apiUrl = `https://live.planet.bg/api/v1/holidays/?limit=${limit}&offset=${offset}`;
        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error("Failed to fetch holidays:", res.statusText);
            return [];
        }

        const data = await res.json();
        return data.holidays || [];
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HolidaysPage(props: PageProps) {
    const resolvedParams = await props.searchParams;

    const countryFilter = typeof resolvedParams.country === 'string'
        ? resolvedParams.country.toLowerCase()
        : null;

    const allHolidays = await getHolidays(100);

    const filteredHolidays = countryFilter
        ? allHolidays.filter((h) => h.country?.iso_code?.toLowerCase() === countryFilter)
        : allHolidays;

    const countryName = countryFilter
        ? ALL_COUNTRIES.find(c => c.abbr === countryFilter)?.name || countryFilter.toUpperCase()
        : "Всички дестинации";

    return (
        <main className="min-h-screen bg-slate-50/50">
            <PageSlider
                images={HOLIDAY_HERO_IMAGES}
                title="Почивки и Екскурзии"
                subtitle="Открийте мечтаната почивка с нашите специални предложения."
                icon={<Palmtree className="h-8 w-8 text-white" />}
                className="h-96"
                searchType="holidays"
            />

            <div className="container mx-auto py-12 px-4">
                <div className="flex items-center gap-3 mb-8">
                    {countryFilter && (
                        <img
                            src={`https://flagcdn.com/${countryFilter}.svg`}
                            alt="flag"
                            className="w-8 h-auto shadow-sm rounded-sm"
                        />
                    )}
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        {countryFilter ? `Почивки в ${countryName}` : "Нашите Предложения"}
                    </h2>
                    <span className="ml-auto text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
                        {filteredHolidays.length} резултата
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredHolidays.map((holiday) => (
                        <div key={holiday.id} className="h-full">
                            <HolidayCard holiday={holiday} />
                        </div>
                    ))}
                </div>

                {filteredHolidays.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Palmtree className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Няма намерени почивки</h3>
                        <p className="text-slate-500 mt-2">Нямаме налични оферти за тази дестинация в момента.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
