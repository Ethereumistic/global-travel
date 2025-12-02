import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/lib/types-hotel";
import { ALL_COUNTRIES } from "@/lib/constants";
import Link from "next/link";
import { Button } from "../ui/button";

interface HotelCardProps {
    hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
    // Resolve full country name from constants if possible
    const countryObj = ALL_COUNTRIES.find(
        (c) => c.abbr === (hotel.location?.country_code || hotel.country_code)?.toLowerCase()
    );
    const countryName = countryObj ? countryObj.name : (hotel.location?.country || hotel.country);

    // Get lowercase code for flagcdn
    const countryCode = (hotel.location?.country_code || hotel.country_code)?.toLowerCase();

    return (
        <Link href={`/hotels/${hotel.id}`} className="block h-full group focus:outline-none">
            <Card className="group overflow-hidden border-none shadow-lg transition-all hover:shadow-xl flex flex-col h-full p-0">
                {/* Image Section */}
                <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                        src={hotel.main_image?.image || "/placeholder.svg"}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3">
                        <Badge variant="glass" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {Math.round(hotel.rating || 0)}
                        </Badge>
                    </div>

                    {/* Flag Overlay */}
                    {countryCode && (
                        <div className="absolute bottom-3 left-3">
                            <div className="relative w-8 h-6 rounded shadow-sm overflow-hidden border border-white/20">
                                <img
                                    src={`https://flagcdn.com/${countryCode}.svg`}
                                    alt={countryName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <CardContent className="p-4 pt-4 flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-bold text-lg line-clamp-1 text-foreground group-hover:text-blue-600 transition-colors">
                                {hotel.name}
                            </h3>
                            {/* Location */}
                            <div className="flex items-center text-muted-foreground mb-3">
                                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                <span className="text-sm line-clamp-1">
                                    {hotel.location?.city || hotel.city}, {countryName}
                                </span>
                            </div>

                            {/* Address */}
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
                                {hotel.location?.address_1 || hotel.address}
                            </p>
                        </div>
                        <Button className="cursor-pointer">Виж Повече</Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
