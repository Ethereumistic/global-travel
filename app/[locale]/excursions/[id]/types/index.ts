export type FlightTable = {
    headers: string[];
    rows: string[][];
  };

  export interface FlightInfoSection {
    title: string;
    tables: FlightTable[];
    textFallback: string | null;
  }  

  export interface HotelDetailSection {
    title: string;
    content: string;
    // These are the names of the Lucide icons
    icon: "MapPin" | "BedDouble" | "ConciergeBell" | "Utensils" | "Info";
  }
  
  export type ParsedPriceNote = {
    includes: string[];
    excludes: string[];
    excursions: string[];
    discounts: string[];
    surcharges: string[];
    conditions: string[];
    flightInfo: FlightInfoSection[]; // <-- This is the key change
    
  };

  
  
  export const parserKeys = {
    includes: "Цената включва:",
    excludes: "Цената не включва:",
    excursions: "Допълнителни екскурзии:",
    discounts: "Отстъпки:",
    surcharges: "Доплащане:",
    surchargesPlural: "Доплащания:",
    conditions: "Други условия по програмата:",
    flightInfo: "Информация за полетите",
  };
  
// lib/types-yachts.ts

export interface YachtSpecs {
  [key: string]: string;
}

export interface Yacht {
  id: string;
  name: string;
  model: string;
  home_port: string;
  country: string;
  description: string;
  
  // Capacity
  guests: string;
  cabins: string;
  wc: string;
  
  // Images
  main_image: {
    image: string;
  } | null;
  // Assuming the API might provide a gallery in the future, 
  // otherwise we stick to main_image for now
  images?: { image: string }[]; 

  // Pricing
  min_price: {
    value: number;
    display_currency: string;
  };

  // Details
  specs: YachtSpecs[]; // Array of objects like [{ "Draft": "1.5m", "Beam": "3m" }]
  inventory: Record<string, string[]> | null; // { "Kitchen": ["Sink", "Fridge"], ... }
}
  
  export interface YachtApiResponse {
    yachts: Yacht[];
    total_count: number;
  }