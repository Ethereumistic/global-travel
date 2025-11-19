"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";
import { HeroSlider } from "@/components/layout/hero-slider";
import { FlightCard, type FlightOffer } from "@/components/flights/flight-card";
import type { DestinationListItem } from "@/app/api/destinations/route";

// --- MOCK DATA FOR FLIGHTS ---
const MOCK_FLIGHTS: FlightOffer[] = [
  {
    id: "f1",
    airline: "Ryanair",
    origin: "София",
    destination: "Рим",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
    departureTime: "06:40",
    arrivalTime: "07:50",
    duration: "2ч 10м",
    date: "2024-05-15",
    price: 89,
    isDirect: true,
    baggage: "Ръчен багаж (40x20x25)",
  },
  {
    id: "f2",
    airline: "Wizz Air",
    origin: "София",
    destination: "Барселона",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/spain.png",
    departureTime: "14:30",
    arrivalTime: "16:45",
    duration: "3ч 15м",
    date: "2024-06-10",
    price: 125,
    isDirect: true,
    baggage: "Ръчен багаж (40x30x20)",
  },
  {
    id: "f3",
    airline: "Turkish Airlines",
    origin: "София",
    destination: "Истанбул",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    departureTime: "09:15",
    arrivalTime: "10:30",
    duration: "1ч 15м",
    date: "2024-05-20",
    price: 240,
    isDirect: true,
    baggage: "Чекиран багаж 23кг + Ръчен",
  },
  {
    id: "f4",
    airline: "Lufthansa",
    origin: "София",
    destination: "Берлин",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/germany.png",
    departureTime: "11:00",
    arrivalTime: "12:20",
    duration: "2ч 20м",
    date: "2024-07-01",
    price: 310,
    isDirect: true,
    baggage: "Чекиран багаж 23кг",
  },
  {
    id: "f5",
    airline: "Wizz Air",
    origin: "София",
    destination: "Лондон",
    destinationImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
    departureTime: "06:00",
    arrivalTime: "07:40",
    duration: "3ч 40м",
    date: "2024-05-28",
    price: 65,
    isDirect: true,
    baggage: "Ръчен багаж (40x30x20)",
  },
  {
    id: "f6",
    airline: "Ryanair",
    origin: "Варна",
    destination: "Румъния",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/romania.png",
    departureTime: "13:15",
    arrivalTime: "14:20",
    duration: "2ч 05м",
    date: "2024-06-05",
    price: 78,
    isDirect: true,
    baggage: "Ръчен багаж (40x20x25)",
  },
  {
    id: "f7",
    airline: "Lufthansa",
    origin: "София",
    destination: "Ню Йорк",
    destinationImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop",
    departureTime: "07:00",
    arrivalTime: "16:00",
    duration: "14ч 00м",
    date: "2024-08-15",
    price: 1250,
    isDirect: false,
    baggage: "2x Чекиран багаж 23кг",
  },
  {
    id: "f8",
    airline: "Turkish Airlines",
    origin: "София",
    destination: "Токио",
    destinationImage: "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/japan.png",
    departureTime: "21:30",
    arrivalTime: "18:00 (+1)",
    duration: "16ч 30м",
    date: "2024-09-10",
    price: 1890,
    isDirect: false,
    baggage: "2x Чекиран багаж 23кг",
  },
];

export default function FlightsPage() {
  const router = useRouter();
  const [selectedDestination, setSelectedDestination] = React.useState<DestinationListItem | null>(null);
  const [filteredFlights, setFilteredFlights] = React.useState<FlightOffer[]>(MOCK_FLIGHTS);

  // Handle filtering when destination changes in HeroSlider
  React.useEffect(() => {
    if (selectedDestination) {
      const filtered = MOCK_FLIGHTS.filter(flight => 
        flight.destination.toLowerCase().includes(selectedDestination.name.toLowerCase()) ||
        flight.origin.toLowerCase().includes(selectedDestination.name.toLowerCase())
      );
      setFilteredFlights(filtered);
    } else {
      setFilteredFlights(MOCK_FLIGHTS);
    }
  }, [selectedDestination]);

  const handleDestinationSelect = (destination: DestinationListItem | null) => {
    setSelectedDestination(destination);
  };

  return (
    <div>
      <HeroSlider
        className="h-112"
        title="Самолетни Билети"
        subtitle="Най-добрите цени за полети до цял свят"
        icon={Plane}
        selectedDestination={selectedDestination}
        onDestinationSelect={handleDestinationSelect}
      />

      <div className="max-w-7xl mx-auto px-4 -mt-20 py-8 relative z-10">
        
        {/* Content Grid */}
        {filteredFlights.length === 0 ? (
          <div className="text-center py-20 bg-secondary-foreground/10 rounded-lg backdrop-blur-sm">
            <p className="text-lg text-muted-foreground">
              {selectedDestination
                ? `Няма намерени полети за ${selectedDestination.name}.`
                : "Няма налични полети в момента."}
            </p>
            <button 
              onClick={() => setSelectedDestination(null)} 
              className="mt-4 text-primary hover:underline font-medium"
            >
              Покажи всички полети
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}