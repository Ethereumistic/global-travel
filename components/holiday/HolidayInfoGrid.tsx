"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Plane, Euro, MapPin, Bus, Calendar } from "lucide-react";
import { ALL_COUNTRIES } from "@/lib/constants";
import type { Holiday } from "@/lib/types-holiday";

interface HolidayInfoGridProps {
    holiday: Holiday;
    showDateCard?: boolean;
}

export function HolidayInfoGrid({ holiday, showDateCard = false }: HolidayInfoGridProps) {

    // Helper to resolve Bulgarian Name and Flag URL
    const getCountryDisplayData = (countryName: string, isoCode?: string) => {
        let displayName = countryName;
        let code = isoCode ? isoCode.toLowerCase() : null;

        let match = null;
        if (code) {
            match = ALL_COUNTRIES.find((c) => c.abbr.toLowerCase() === code);
        } else {
            match = ALL_COUNTRIES.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
        }

        if (match) {
            displayName = match.name;
            code = match.abbr;
        }

        const finalFlagUrl = code ? `https://flagcdn.com/${code}.svg` : null;
        return { name: displayName, flagUrl: finalFlagUrl };
    };

    const mainCountry = holiday.country ? getCountryDisplayData(holiday.country.name, holiday.country.iso_code || holiday.country.country) : null;

    const transportIcon = holiday.transport === "Airplane" || holiday.transport === "Самолет" ? <Plane className="size-8 mx-auto mb-2 text-primary" /> : <Bus className="size-8 mx-auto mb-2 text-primary" />;
    const transportName = holiday.transport === "Airplane" ? "Самолет" : holiday.transport === "Bus" ? "Автобус" : holiday.transport === "None" ? "Неуточнен" : holiday.transport;

    // Date Calculation
    const startDateStr = holiday.trips?.[0]?.departure_date || holiday.available_from;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = startDate ? new Date(startDate.getTime() + (holiday.duration * 24 * 60 * 60 * 1000)) : null;

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' });
    };

    return (
        <div className={`grid gap-2 mb-6 ${showDateCard ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4"}`}>

            {/* Date Card (Conditional) */}
            {showDateCard && (
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                        <Calendar className="size-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Дати</p>
                        <p className="text-sm font-bold leading-tight">
                            {formatDate(startDate)} - {formatDate(endDate)}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Duration Card */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <Clock className="size-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">{holiday.duration - 1} нощувки</p>
                    <p className="text-lg font-bold leading-tight">{holiday.duration} дни</p>
                </CardContent>
            </Card>

            {/* Destinations Card */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    {mainCountry && mainCountry.flagUrl && (
                        <div className="relative w-10 h-7 mb-2 shadow-sm rounded overflow-hidden">
                            <Image src={mainCountry.flagUrl} alt={mainCountry.name} fill className="object-cover" />
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Дестинация</p>
                    <p className="text-lg font-bold leading-tight line-clamp-2">
                        {mainCountry ? mainCountry.name : holiday.country?.name}
                    </p>
                </CardContent>
            </Card>

            {/* Transport Card */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    {transportIcon}
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Транспорт</p>
                    <p className="text-lg font-bold leading-tight">{transportName}</p>
                </CardContent>
            </Card>

            {/* Price Card */}
            <Card className={`border-0 shadow-sm col-span-2 ${!showDateCard ? 'col-span-1' : 'col-span-2 md:col-span-1'} hover:shadow-md transition-shadow `}>
                <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <Euro className="size-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Цена от</p>
                    <p className="text-2xl font-black text-primary leading-tight">
                        {holiday.min_price.main?.value || holiday.min_price.value}
                        <span className="text-sm font-bold ml-1">{holiday.min_price.main?.currency || holiday.min_price.display_currency}</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
