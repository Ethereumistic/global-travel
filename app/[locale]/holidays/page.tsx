import { PageSlider } from "@/components/layout/page-slider";
import { Palmtree } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants";
import { getHolidays } from "@/app/actions/get-holidays";
import { HolidayList } from "@/components/holiday/holiday-list";

const HOLIDAY_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HolidaysPage(props: PageProps) {
    const resolvedParams = await props.searchParams;

    const countryFilter = typeof resolvedParams.country === 'string'
        ? resolvedParams.country.toLowerCase()
        : null;

    // Fetch initial batch of holidays
    const initialHolidays = await getHolidays(12, 0, countryFilter);

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
                </div>

                <HolidayList
                    initialHolidays={initialHolidays}
                    countryFilter={countryFilter}
                />
            </div>
        </main>
    );
}
