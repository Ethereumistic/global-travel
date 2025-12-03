"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Yacht } from "@/lib/types-yacht";

// Components
import { YachtHeader } from "@/components/yacht/YachtHeader";
import { YachtGallery } from "@/components/yacht/YachtGallery";
import { YachtInventory } from "@/components/yacht/YachtInventory";
import { YachtSpecs } from "@/components/yacht/YachtSpecs";
import { SeasonalPricing } from "@/components/yacht/SeasonalPricing";
import { YachtBookingSidebar } from "@/components/yacht/YachtBookingSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Users, BedDouble, Droplets, Euro } from "lucide-react";

export default function YachtDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { id } = React.use(params);
  const query = React.use(searchParams);
  const urlCountryCode = query.c;

  const [yacht, setYacht] = React.useState<Yacht | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchYachtDetail() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/yachts/${id}`);
        if (!response.ok) throw new Error("Error");
        const data = await response.json();
        setYacht(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchYachtDetail();
  }, [id]);

  if (isLoading || !yacht) return <div className="container py-20"><Skeleton className="h-96 w-full" /></div>;

  const hasInventory = yacht.inventory && Object.keys(yacht.inventory).length > 0;
  const displayInventory = hasInventory ? yacht.inventory : (yacht.facilities || null);

  return (
    <>
      <YachtHeader yacht={yacht} />

      <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 -mt-6 relative z-20">
        <YachtGallery mainImage={yacht.main_image} images={yacht.images} title={yacht.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="font-bold text-lg text-slate-800">{yacht.guests}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium">Гости</span>
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <BedDouble className="h-6 w-6 text-primary mb-2" />
                <span className="font-bold text-lg text-slate-800">{yacht.cabins}</span>
                <span className="text-xs text-muted-foreground uppercase font-medium">Каюти</span>
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <Droplets className="h-6 w-6 text-primary mb-2" />
                <span className="font-semibold text-lg text-slate-800">WC</span>
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <Euro className="h-6 w-6 text-primary mb-2" />
                <span className="font-bold text-lg text-slate-800">{yacht.min_price.value}</span>
              </div>
            </div>

            <div className="prose max-w-none text-slate-600 leading-relaxed">
              <p>{yacht.description}</p>
            </div>

            {/* Sticky Tabs Implementation */}
            <div className="relative min-h-[500px]">
              <Tabs defaultValue="inventory" className="w-full">
                <div className="sticky top-20 z-30  backdrop-blur-sm py-2 -mx-1 px-1">
                  <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg shadow-sm overflow-x-auto h-auto flex-wrap">
                    <TabsTrigger value="inventory">Оборудване</TabsTrigger>
                    <TabsTrigger value="specs">Характеристики</TabsTrigger>
                    <TabsTrigger value="prices">Цени</TabsTrigger>
                    {yacht.layouts?.length > 0 && (
                      <TabsTrigger value="layout">Схема</TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <div className="mt-4">
                  <TabsContent value="inventory"><YachtInventory inventory={displayInventory} /></TabsContent>
                  <TabsContent value="specs"><YachtSpecs specs={yacht.specs} /></TabsContent>
                  <TabsContent value="prices"><SeasonalPricing prices={yacht.prices} /></TabsContent>
                  <TabsContent value="layout">
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                      {yacht.layouts?.map((l) => (
                        <div key={l.id} className="relative w-full h-[300px]">
                          <Image src={l.image} alt="Layout" fill className="object-contain" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div id="booking-sidebar" className="lg:col-span-1">
            <YachtBookingSidebar yacht={yacht} externalCountryCode={urlCountryCode} />
          </div>

        </div>
      </div>
    </>
  );
}