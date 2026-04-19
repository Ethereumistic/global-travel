import { PageSlider } from "@/components/layout/page-slider";
import { YachtList } from "@/components/yacht/yacht-list";
import { Anchor } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants";
import { getYachts } from "@/app/actions/get-yachts";


import type { Metadata } from "next";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Яхти под наем | Global Travel",
  description: "Луксозни яхти под наем за незабравими морски приключения. Разгледайте нашия каталог.",
};

const YACHT_HERO_IMAGES = [
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/1.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/2.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/3.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/4.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/5.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/6.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/7.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/8.jpg",
  "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/yachts/9.jpg",
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function YachtsPage(props: PageProps) {
  const resolvedParams = await props.searchParams;

  const countryFilter = typeof resolvedParams.country === 'string'
    ? resolvedParams.country.toLowerCase()
    : null;

  // Fetch initial batch (limit 9 as per original desire)
  const initialYachts = await getYachts(9, 0, countryFilter);

  const countryName = countryFilter
    ? ALL_COUNTRIES.find(c => c.abbr === countryFilter)?.name || countryFilter.toUpperCase()
    : "Всички дестинации";

  return (
    <main className="min-h-screen bg-slate-50/50">
      <PageSlider
        images={YACHT_HERO_IMAGES}
        title="Наемете Яхта"
        subtitle="Открийте свободата на морето с нашата селекция от премиум яхти."
        icon={<Anchor className="h-8 w-8 text-white" />}
        className="h-96 rounded-b-xl"
        searchType="yachts"
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
            {countryFilter ? `Яхти в ${countryName}` : "Нашите Предложения"}
          </h2>
        </div>

        <YachtList
          initialYachts={initialYachts}
          country={countryFilter}
        />
      </div>
    </main>
  );
}