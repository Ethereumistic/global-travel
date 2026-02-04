import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlightBookingSidebar } from "@/components/flights/FlightBookingSidebar";
import { SanityFlight } from "@/components/flights/flights-browser";
import { ArrowRight, Plane, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ALL_COUNTRIES } from "@/lib/constants";

// Revalidate every hour
export const revalidate = 3600;

function getCountryFlagUrl(countryName: string | undefined) {
    if (!countryName) return null;

    const country = ALL_COUNTRIES.find(c =>
        c.name.toLowerCase() === countryName.toLowerCase() ||
        c.name_en.toLowerCase() === countryName.toLowerCase()
    );

    return country ? `https://flagcdn.com/${country.abbr}.svg` : null;
}

async function getFlight(slug: string) {
    return client.fetch<SanityFlight>(`
    *[_type == "flight" && slug.current == $slug][0] {
      _id,
      toCity,
      toCountry,
      fromCity,
      fromCountry,
      price,
      "imageUrl": thumbnail.asset->url,
      airlines[]->{
        name,
        color
      },
      slug
    }
  `, { slug });
}

export default async function FlightPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const flight = await getFlight(id);

    if (!flight) {
        notFound();
    }

    const toFlag = getCountryFlagUrl(flight.toCountry);
    const fromFlag = getCountryFlagUrl(flight.fromCountry);

    return (
        <div className="-mt-20">
            {/* Hero Header Section - Similar to HolidayHeader */}
            <div className="relative w-full h-96 overflow-hidden rounded-b-xl flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={flight.imageUrl}
                        alt={`Полет до ${flight.toCity}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content Container - Vertically Centered */}
                <div className="max-w-7xl relative z-10 mx-auto px-4 w-full">
                    <div className="flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center gap-4">

                        {/* LEFT SIDE: Flight Info */}
                        <div className="space-y-2 md:space-y-4 max-w-7xl animate-in fade-in slide-in-from-left-5 duration-700">
                            {/* Airlines Badges */}
                            <div className="flex flex-wrap gap-2">
                                {flight.airlines?.map((airline) => (
                                    <Badge
                                        key={airline.name}
                                        variant="secondary"
                                        style={{ backgroundColor: airline.color }}
                                        className="text-white border-0 px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm backdrop-blur-md"
                                    >
                                        <Plane className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                                        {airline.name}
                                    </Badge>
                                ))}
                            </div>

                            {/* Flight Route */}
                            <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <span>{flight.fromCity || ''}</span>
                                <ArrowRight className="hidden md:block text-white/50 w-8 h-8" />
                                <span className="md:hidden text-white/50 text-sm uppercase tracking-widest font-bold">до</span>
                                <span className="text-white">{flight.toCity}</span>
                            </h1>

                            {/* Country Info */}
                            <div className="flex items-center gap-4 text-sm md:text-lg text-gray-200 font-medium">
                                {flight.fromCountry && (
                                    <div className="flex items-center gap-2">
                                        {fromFlag && (
                                            <div className="relative w-6 h-4 md:w-8 md:h-6 shadow-sm rounded overflow-hidden shrink-0">
                                                <Image src={fromFlag} alt={flight.fromCountry} fill className="object-cover" />
                                            </div>
                                        )}
                                        {flight.fromCountry}
                                    </div>
                                )}
                                {flight.fromCountry && <ArrowRight className="w-4 h-4 text-gray-400" />}
                                <div className="flex items-center gap-2">
                                    {toFlag && (
                                        <div className="relative w-6 h-4 md:w-8 md:h-6 shadow-sm rounded overflow-hidden shrink-0">
                                            <Image src={toFlag} alt={flight.toCountry} fill className="object-cover" />
                                        </div>
                                    )}
                                    {flight.toCountry}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button - Absolute Positioned Top Left */}
                <div className="absolute top-24 left-2 z-20">
                    <Button
                        variant="glass"
                        size="sm"
                        asChild
                        className="backdrop-blur-md border border-white/10 shadow-lg"
                    >
                        <Link href="/flights">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Всички полети
                        </Link>
                    </Button>
                </div>

                {/* Price Box - Absolute Positioned Bottom Right (Mobile) */}
                <div className="absolute bottom-6 right-4 z-20 md:hidden">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-right shadow-lg">
                        <p className="text-[10px] font-medium text-gray-300 mb-0 uppercase tracking-wider">
                            Цена от
                        </p>
                        <div className="text-xl font-black text-white drop-shadow-md leading-tight">
                            {flight.price} €
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            на човек
                        </p>
                    </div>
                </div>
            </div>

            {/* Details Section - Below Header */}
            <div className="container mx-auto px-4 mt-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Детайли за полета</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">От</span>
                                        <div className="text-xl font-semibold text-slate-800 mt-1">{flight.fromCity || '-'}</div>
                                        <div className="text-slate-500">{flight.fromCountry}</div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">До</span>
                                        <div className="text-xl font-semibold text-slate-800 mt-1">{flight.toCity}</div>
                                        <div className="text-slate-500">{flight.toCountry}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">Авиокомпании</span>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {flight.airlines?.map(airline => (
                                                <div key={airline.name} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: airline.color }} />
                                                    <span className="font-medium text-slate-700">{airline.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">Цена от</span>
                                        <div className="text-3xl font-black text-blue-600 mt-1">{flight.price} €</div>
                                        <div className="text-xs text-slate-400">на човек</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info / Placeholder */}
                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
                            <h3 className="font-bold text-blue-900 mb-2">Важна информация</h3>
                            <p className="text-blue-800/80 text-sm leading-relaxed">
                                Цените на самолетните билети са динамични и подлежат на препотвърждение към момента на резервация.
                                Посочените цени са "от" и зависят от наличността на местата в съответната класа.
                                Моля, свържете се с нас за актуална оферта за желаните от Вас дати.
                            </p>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div id="booking-sidebar" className="lg:col-span-1">
                        <FlightBookingSidebar flight={flight} />
                    </div>
                </div>
            </div>
        </div>
    );
}
