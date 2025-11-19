"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin, Users, BedDouble, Droplets, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import type { Yacht } from "@/lib/types-yacht";

// Import our new sub-components
import { YachtGallery } from "@/components/yacht/YachtGallery";
import { YachtInventory } from "@/components/yacht/YachtInventory";
import { YachtSpecs } from "@/components/yacht/YachtSpecs";
import { SeasonalPricing } from "@/components/yacht/SeasonalPricing";

export default function YachtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [yacht, setYacht] = React.useState<Yacht | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch Logic
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

  // Pricing formatting
  const currentPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: yacht.min_price.display_currency,
    maximumFractionDigits: 0,
  }).format(yacht.min_price.value);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
      
      {/* 1. Breadcrumb / Back */}
      <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
        <Link href="/yachts">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Всички яхти
        </Link>
      </Button>

      {/* 2. Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {yacht.model}
                </Badge>
                {yacht.available_as && (
                    <Badge variant="secondary">{yacht.available_as}</Badge>
                )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{yacht.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 text-third" />
                {yacht.home_port}
            </div>
        </div>
        
        <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground">Цена от</p>
            <p className="text-3xl font-black text-primary">{currentPrice}</p>
        </div>
      </div>

      {/* 3. Gallery */}
      <YachtGallery images={yacht.images} title={yacht.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <Users className="h-6 w-6 text-third mb-2" />
                    <span className="font-bold text-lg">{yacht.guests}</span>
                    <span className="text-xs text-muted-foreground uppercase">Гости</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <BedDouble className="h-6 w-6 text-third mb-2" />
                    <span className="font-bold text-lg">{yacht.cabins}</span>
                    <span className="text-xs text-muted-foreground uppercase">Каюти</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <Droplets className="h-6 w-6 text-third mb-2" />
                    <span className="font-bold text-lg">{yacht.wc}</span>
                    <span className="text-xs text-muted-foreground uppercase">WC</span>
                </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none text-slate-600 leading-relaxed">
                <p>{yacht.description}</p>
            </div>

            {/* Tabs System */}
            <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="w-full justify-start bg-slate-100 p-1">
                    <TabsTrigger value="inventory" className="flex-1 md:flex-none">Оборудване</TabsTrigger>
                    <TabsTrigger value="specs" className="flex-1 md:flex-none">Характеристики</TabsTrigger>
                    <TabsTrigger value="prices" className="flex-1 md:flex-none">Сезонни Цени</TabsTrigger>
                    {yacht.layouts?.length > 0 && (
                        <TabsTrigger value="layout" className="flex-1 md:flex-none">Схема</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="inventory" className="mt-6 animate-in fade-in-50">
                    <YachtInventory inventory={yacht.inventory} />
                </TabsContent>

                <TabsContent value="specs" className="mt-6 animate-in fade-in-50">
                    <YachtSpecs specs={yacht.specs} />
                </TabsContent>
                
                <TabsContent value="prices" className="mt-6 animate-in fade-in-50">
                    <SeasonalPricing prices={yacht.prices} />
                </TabsContent>

                <TabsContent value="layout" className="mt-6 animate-in fade-in-50">
                    <div className="bg-white p-4 border rounded-xl">
                         {yacht.layouts?.map((l) => (
                             <div key={l.id} className="relative w-full h-[300px] mb-4">
                                 <Image src={l.image} alt="Layout" fill className="object-contain" />
                             </div>
                         ))}
                    </div>
                </TabsContent>
            </Tabs>

        </div>

        {/* RIGHT COLUMN (Sticky Sidebar) */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <Card className="border-2 border-primary/5 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-third to-primary" />
                    <CardHeader>
                        <CardTitle className="text-xl">Резервирай тази яхта</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm border-b pb-3">
                            <span className="text-muted-foreground">Модел:</span>
                            <span className="font-medium">{yacht.model}</span>
                        </div>
                        <div className="flex justify-between text-sm border-b pb-3">
                            <span className="text-muted-foreground">Тип наем:</span>
                            <span className="font-medium">{yacht.available_as}</span>
                        </div>

                        <Button className="w-full h-12 text-lg font-bold shadow-md hover:shadow-xl transition-all">
                            Изпрати запитване
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Няма скрити такси. Плащането се извършва след потвърждение.
                        </p>
                    </CardContent>
                </Card>

                {/* Help Box */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 text-center">
                    <Ship className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900">Нуждаете се от помощ?</h3>
                    <p className="text-sm text-blue-700/80 mb-4 mt-2">
                        Нашите експерти могат да ви помогнат да изберете правилната яхта за вашия маршрут.
                    </p>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                        Свържете се с нас
                    </Button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}