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
  

  