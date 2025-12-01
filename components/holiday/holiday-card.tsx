"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Plane, Bus, Euro, Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Holiday } from "@/lib/types-holiday";

interface HolidayCardProps {
    holiday: Holiday;
}

// Helper functions
function TransportIcon({ transportName }: { transportName: string }) {
    const iconClasses = "size-4 mr-1.5";
    if (transportName === "Самолет" || transportName === "Директен полет" || transportName === "Airplane") {
        return <Plane className={iconClasses} />;
    }
    if (transportName === "Автобус" || transportName === "Bus") {
        return <Bus className={iconClasses} />;
    }
    return null;
}

function getTransportNameBg(transportName: string) {
    if (transportName === "Airplane") return "Самолет";
    if (transportName === "Bus") return "Автобус";
    return transportName;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("bg-BG");
}

export function HolidayCard({ holiday }: HolidayCardProps) {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const [isTruncated, setIsTruncated] = React.useState(false);
    const titleRef = React.useRef<HTMLHeadingElement>(null);

    React.useEffect(() => {
        const checkTruncation = () => {
            if (titleRef.current) {
                // Check if the content is truncated by comparing scroll height to client height
                setIsTruncated(titleRef.current.scrollHeight > titleRef.current.clientHeight);
            }
        };

        checkTruncation();
        // Recheck on window resize
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [holiday.title]);

    return (
        <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30 relative">
            {/* Main Link Overlay - Handles clicks on empty spaces and images */}
            <Link href={`/holidays/${holiday.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${holiday.title}`} />

            <div className="relative h-56 w-full bg-gray-200 z-10 pointer-events-none">
                {!isImageLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    </div>
                )}
                {holiday.main_image?.image ? (
                    <Image
                        src={holiday.main_image.image}
                        alt={holiday.title}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onLoad={() => setIsImageLoaded(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
                        <MapPin className="h-16 w-16 text-gray-500" />
                    </div>
                )}

                {holiday.country && (
                    <div className="absolute bottom-2 left-2 border border-border/10">
                        <div className="relative w-8 h-6 flex-shrink-0" title={holiday.country.name}>
                            <Image
                                src={`https://flagcdn.com/${holiday.country.iso_code?.toLowerCase()}.svg`}
                                alt={`${holiday.country.name} flag`}
                                fill
                                className="object-contain rounded-xs"
                                sizes="28px"
                            />
                        </div>
                    </div>
                )}

                {holiday.transport && holiday.transport !== "None" && (
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-black/15 px-4 py-1 text-primary-foreground text-sm backdrop-blur-2xl border-border/30 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                            <TransportIcon transportName={holiday.transport} />
                            {getTransportNameBg(holiday.transport)}
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="space-y-2 z-10 pointer-events-none">
                {isTruncated ? (
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                {/* 1. We wrap in a Link because pointer-events-auto blocks the card background link.
                                    2. z-20 puts it physically above the card background link.
                                    3. pointer-events-auto allows the tooltip to detect hover.
                                */}
                                <Link href={`/holidays/${holiday.id}`} className="block relative z-20 pointer-events-auto w-fit">
                                    <h3 ref={titleRef} className="font-semibold text-third text-xl line-clamp-2 transition-colors duration-300 group-hover:text-primary text-left">
                                        {holiday.title}
                                    </h3>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start" className="max-w-[300px]">
                                <p>{holiday.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Link href={`/holidays/${holiday.id}`} className="block relative z-20 pointer-events-auto w-fit">
                        <h3 ref={titleRef} className="font-semibold text-third text-xl line-clamp-2 transition-colors duration-300 group-hover:text-primary text-left">
                            {holiday.title}
                        </h3>
                    </Link>
                )}

                {holiday.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {holiday.subtitle}
                    </p>
                )}
            </CardHeader>

            <CardContent className="space-y-2 grow z-10 pointer-events-none">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-5 text-third shrink-0" />
                    <span className="line-clamp-1">
                        {holiday.route}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-5 text-third shrink-0" />
                    <span>
                        {holiday.duration} дни / {holiday.duration - 1} нощувки
                    </span>
                </div>

                {holiday.available_from && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-5 text-third shrink-0" />
                        <span>
                            {formatDate(holiday.available_from)} - {formatDate(holiday.available_to)}
                        </span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="justify-between pt-2 z-10 pointer-events-none">
                <div>
                    <p className="text-xs text-muted-foreground">Цена от</p>
                    <p className="text-3xl font-black text-primary flex items-center gap-1">
                        <Euro className="h-6 w-6" />
                        {holiday.min_price.main?.value || holiday.min_price.value}
                    </p>
                </div>
                <div className={buttonVariants({ variant: "default" })}>
                    Виж повече
                </div>
            </CardFooter>
        </Card>
    );
}