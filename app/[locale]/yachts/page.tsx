import * as React from "react";
import { YachtList } from "@/components/yacht/yacht-list";
import { Ship } from "lucide-react";

// Metadata for SEO
export const metadata = {
  title: "Яхти под наем | Planet Travel",
  description: "Разгледайте нашата селекция от ветроходни яхти и катамарани за незабравими морски приключения.",
};

async function getInitialYachts() {
  // We fetch the first 9 items on the server
  const apiUrl = "https://live.planet.bg/api/v1/yachts/?limit=9&offset=0";
  
  try {
    const res = await fetch(apiUrl, {
      // Revalidate every hour (3600 seconds)
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch yachts: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return { yachts: [], total_count: 0 };
  }
}

export default async function YachtsPage() {
  const data = await getInitialYachts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero / Header Section */}
      <div className="relative bg-slate-900 text-white py-16 mb-8">
        <div className="absolute inset-0 overflow-hidden">
          {/* Abstract Background or Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90" />
          {/* Optional: Add a real background image here via next/image with fill & object-cover */}
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm mb-2">
               <Ship className="h-8 w-8 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Яхти под наем
            </h1>
            <p className="max-w-2xl text-lg text-blue-100">
              Открийте свободата на морето с нашата премиум селекция от яхти. 
              Перфектният избор за вашата почивка в Гърция и Средиземноморието.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-third">
                Налични предложения
            </h2>
            <span className="text-sm text-muted-foreground">
                Общо {data.total_count} резултата
            </span>
        </div>

        {/* The Client Component handles the grid and pagination */}
        <YachtList 
          initialYachts={data.yachts || []} 
          initialTotal={data.total_count || 0} 
        />
      </div>
    </div>
  );
}