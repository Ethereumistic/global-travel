"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Plane, Luggage, ArrowRight, PlaneTakeoff, PlaneLanding } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Interface for our Mock Data
export interface FlightOffer {
  id: string;
  airline: "Ryanair" | "Wizz Air" | "Turkish Airlines" | "Lufthansa";
  origin: string;
  destination: string;
  destinationImage: string; // URL for the card image
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  price: number;
  isDirect: boolean;
  baggage: string;
}

interface FlightCardProps {
  flight: FlightOffer;
}

export function FlightCard({ flight }: FlightCardProps) {
  // Helper to determine Airline Badge Color (optional visual flair)
  const getAirlineColor = (airline: string) => {
    switch (airline) {
      case "Wizz Air": return "bg-purple-600 hover:bg-purple-700";
      case "Ryanair": return "bg-blue-700 hover:bg-blue-800";
      case "Turkish Airlines": return "bg-red-600 hover:bg-red-700";
      case "Lufthansa": return "bg-yellow-600 hover:bg-yellow-700";
      default: return "bg-black/15";
    }
  };

  return (
    <Link href={`/flights/${flight.id}`}>
      <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 bg-secondary-foreground/30">
        
        {/* --- IMAGE SECTION --- */}
        <div className="relative h-56 w-full bg-gray-200">
          <Image
            src={flight.destinationImage}
            alt={`Flight to ${flight.destination}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Airline Badge (Top Right) */}
          <div className="absolute top-2 right-2">
            <Badge className={`${getAirlineColor(flight.airline)} px-4 py-1 text-white text-sm backdrop-blur-md border-border/30 drop-shadow-md`}>
              <Plane className="size-4 mr-1.5" />
              {flight.airline}
            </Badge>
          </div>

          {/* Direct/Stops Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-2">
             <Badge variant="secondary" className="backdrop-blur-xl bg-white/80 text-black">
                {flight.isDirect ? "Директен полет" : "с прекачване"}
             </Badge>
          </div>
        </div>

        {/* --- HEADER --- */}
        <CardHeader className="space-y-2">
          <h3 className="font-semibold text-third text-xl line-clamp-2 transition-all duration-300 group-hover:scale-105 group-hover:text-primary flex items-center gap-2">
            {flight.origin} 
            <ArrowRight className="size-5 text-muted-foreground" /> 
            {flight.destination}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
             Полет с {flight.airline}
          </p>
        </CardHeader>

        {/* --- CONTENT --- */}
        <CardContent className="space-y-3 flex-grow">
          
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-5 text-third shrink-0" />
            <span>{new Date(flight.date).toLocaleDateString("bg-BG", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Times & Duration */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/10 pt-2">
             <div className="flex items-center gap-1">
                <PlaneTakeoff className="size-4 text-third" />
                <span>{flight.departureTime}</span>
             </div>
             <div className="flex items-center gap-1 px-2 border-b border-dotted border-gray-400">
                <Clock className="size-3 mr-1" />
                <span className="text-xs">{flight.duration}</span>
             </div>
             <div className="flex items-center gap-1">
                <PlaneLanding className="size-4 text-third" />
                <span>{flight.arrivalTime}</span>
             </div>
          </div>

          {/* Baggage Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Luggage className="size-5 text-third shrink-0" />
            <span>{flight.baggage}</span>
          </div>

        </CardContent>

        {/* --- FOOTER --- */}
        <CardFooter className="justify-between pt-2 border-t border-border/5">
          <div>
            <p className="text-xs text-muted-foreground">Цена от</p>
            <p className="text-3xl font-black text-primary">{flight.price} лв.</p>
          </div>
          <Button asChild>
            <Link href={`/flights/${flight.id}`}>Купи билет</Link>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}