"use client";

import {
    Check,
    Wifi,
    Car,
    Coffee,
    Utensils,
    Wine,
    Briefcase,
    Dumbbell,
    Waves,
    Wind,
    Tv,
    Phone,
    Bath,
    BedDouble,
    Fan,
    Snowflake,
    Dog,
    Baby,
    CreditCard,
    Accessibility,
    ShieldCheck,
    Shirt,
    Sparkles,
    Flame,
    Bike,
    Store
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { HotelFacility } from "@/lib/types-hotel";

interface HotelFacilitiesProps {
    facilities: HotelFacility[];
}

// Define a type for the facility config
interface FacilityConfig {
    label: string;
    icon: React.ElementType;
}

// Comprehensive mapping of facility keys to Bulgarian labels and Lucide icons
const FACILITY_MAP: Record<string, FacilityConfig> = {
    // General
    "facility_internet": { label: "Интернет", icon: Wifi },
    "facility_wlan": { label: "Wi-Fi", icon: Wifi },
    "facility_carpark": { label: "Паркинг", icon: Car },
    "facility_garage": { label: "Гараж", icon: Car },
    "facility_pets": { label: "Домашни любимци", icon: Dog },
    "facility_accessible": { label: "Достъп за инвалиди", icon: Accessibility },
    "facility_lift": { label: "Асансьор", icon: Accessibility },
    "facility_safe": { label: "Сейф", icon: ShieldCheck },
    "facility_laundry": { label: "Пералня", icon: Shirt },
    "facility_roomservice": { label: "Рум сървис", icon: Utensils },
    "facility_bicyclehire": { label: "Велосипеди", icon: Bike },
    "facility_washing": { label: "Пералня", icon: Shirt },
    "facility_lifts": { label: "Асансьор", icon: Fan },
    "facility_shops": { label: "Магазини", icon: Store },
    // Dining
    "facility_restaurants": { label: "Ресторант", icon: Utensils },
    "facility_bars": { label: "Бар", icon: Wine },
    "facility_cafe": { label: "Кафене", icon: Coffee },
    "facility_poolbar": { label: "Бар басейн", icon: Wine },
    "facility_conferenceroom": { label: "Конферентна зала", icon: Briefcase },
    // Business
    "facility_conference": { label: "Конферентна зала", icon: Briefcase },
    "facility_business_center": { label: "Бизнес център", icon: Briefcase },

    // Wellness & Sport
    "facility_pool": { label: "Басейн", icon: Waves },
    "facility_indoor_pool": { label: "Вътрешен басейн", icon: Waves },
    "facility_outdoor_pool": { label: "Външен басейн", icon: Waves },
    "facility_gym": { label: "Фитнес", icon: Dumbbell },
    "facility_spa": { label: "СПА център", icon: Sparkles },
    "facility_sauna": { label: "Сауна", icon: Wind },
    "facility_massage": { label: "Масаж", icon: Sparkles },

    // Room Amenities
    "room_bath": { label: "Баня", icon: Bath },
    "room_shower": { label: "Душ", icon: Bath },
    "room_hairdryer": { label: "Сешоар", icon: Wind },
    "room_internet": { label: "Wi-Fi в стаята", icon: Wifi },
    "room_tv": { label: "Телевизор", icon: Tv },
    "room_satellite_tv": { label: "Сателитна телевизия", icon: Tv },
    "room_phone": { label: "Телефон", icon: Phone },
    "room_ac": { label: "Климатик", icon: Snowflake },
    "room_heating": { label: "Отопление", icon: Snowflake },
    "room_minibar": { label: "Минибар", icon: Wine },
    "room_fridge": { label: "Хладилник", icon: Snowflake },
    "room_safe": { label: "Сейф в стаята", icon: ShieldCheck },
    "room_balcony": { label: "Балкон", icon: Wind },
    "room_terrace": { label: "Тераса", icon: Wind },
    "room_doublebed": { label: "Двойно легло", icon: BedDouble },
    "room_tea_coffee": { label: "Кафе/Чай", icon: Coffee },
    "room_aircon": { label: "Климатик", icon: Snowflake },
    "room_centralheating": { label: "Отопление", icon: Flame },
    "room_wheelchair": { label: "Инвалидна количка", icon: Accessibility },
};

export function HotelFacilities({ facilities }: HotelFacilitiesProps) {
    if (!facilities || facilities.length === 0) return null;

    return (
        <Card>
            <CardHeader className="">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Удобства
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilities.map((facility, idx) => {
                        const config = FACILITY_MAP[facility.name] || {
                            label: formatFallbackName(facility.name),
                            icon: Check
                        };
                        const Icon = config.icon;

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-white border flex items-center justify-center shrink-0 text-primary">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 leading-tight">
                                    {config.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function formatFallbackName(name: string): string {
    return name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
