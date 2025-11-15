import { HotelCard } from "./HotelCard";

interface HotelsTabProps {
  hotels: Array<{
    id: string;
    name: string;
    city: string;
    country: string;
    images: string[];
    board?: string;
    overview?: string;
    details?: string;
    minPriceInDouble?: number;
    currency?: string;
    website?: string;
  }>;
}

export function HotelsTab({ hotels }: HotelsTabProps) {
  return (
    <div className="space-y-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}

