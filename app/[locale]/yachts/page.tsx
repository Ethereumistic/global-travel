import { PageSlider } from "@/components/layout/page-slider";
import { YachtCard } from "@/components/yacht/yacht-card";
import { Anchor } from "lucide-react";
import { Yacht } from "@/lib/types-yacht";
import { ALL_COUNTRIES } from "@/lib/constants";

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

// Function to fetch data directly from the external API
// It is better to fetch externally in Server Components to avoid localhost DNS issues during build/deploy
async function getYachts(limit = 50, offset = 0): Promise<Yacht[]> {
  try {
    const apiUrl = `https://live.planet.bg/api/v1/yachts/?limit=${limit}&offset=${offset}`;
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error("Failed to fetch yachts:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data.yachts || [];
  } catch (error) {
    console.error("Error fetching yachts:", error);
    return [];
  }
}

interface PageProps {
  // In Next.js 15+, searchParams is a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function YachtsPage(props: PageProps) {
  // 1. Await the params to resolve the Promise
  const resolvedParams = await props.searchParams;

  // 2. Extract the country filter
  const countryFilter = typeof resolvedParams.country === 'string'
    ? resolvedParams.country.toLowerCase()
    : null;

  // 3. Fetch data
  const allYachts = await getYachts(100); // Fetching 100 to ensure we have enough for client-side filtering demo

  // 4. Filter data
  const filteredYachts = countryFilter
    ? allYachts.filter((y) => y.country?.toLowerCase() === countryFilter)
    : allYachts;

  // Helper to get readable country name for the header
  const countryName = countryFilter
    ? ALL_COUNTRIES.find(c => c.abbr === countryFilter)?.name || countryFilter.toUpperCase()
    : "Всички дестинации";

  return (
    <main className="min-h-screen bg-slate-50/50">
      <PageSlider
        images={YACHT_HERO_IMAGES}
        title="Наемете Яхта"
        subtitle="Открийте свободата на морето с нашата селекция от премиум яхти."
        // Rendered Icon passed here
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
          {/* <span className="ml-auto text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
            {filteredYachts.length} резултата
          </span> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredYachts.map((yacht) => (
            <div key={yacht.id} className="h-full">
              <YachtCard yacht={yacht} />
            </div>
          ))}
        </div>

        {filteredYachts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Anchor className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Няма намерени яхти</h3>
            <p className="text-slate-500 mt-2">Нямаме налични лодки за тази дестинация в момента.</p>
          </div>
        )}
      </div>
    </main>
  );
}