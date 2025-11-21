export interface HolidayImage {
    id: string;
    image: string;
    position?: number | null;
}

export interface HolidayPrice {
    value: number;
    display_currency: string;
    main: {
        value: number;
        currency: string;
    };
    secondary: {
        value: number;
        currency: string;
    };
}

export interface HolidayCountry {
    id?: string; // Optional in some contexts
    country?: string; // ISO code in detail view
    name: string;
    iso_code?: string; // ISO code in list view
}

export interface HolidayCategory {
    id: string;
    name?: string;
    holidays_count?: number;
    created_at?: string;
}

export interface HolidayTrip {
    id: number;
    total_price: HolidayPrice;
    trip_id: string;
    departure_date: string;
    confirmed: boolean;
    early_bird: boolean;
    transport: string | null;
    travel_type: string | null;
    holiday: string;
}

export interface HolidayAccommodation {
    id: number;
    total_price: HolidayPrice;
    accommodation_id: string;
    accommodation_type: string;
    hotel_name: string | null;
    description: string;
    holiday: string;
}

export interface HolidayProgramDay {
    day: string;
    distance: string | null;
    description: string;
    destinations: {
        site_id: string;
        country_id: string;
        destination_id: string;
        destination_name: string;
        destination_name_str: string;
    }[];
}

export interface HolidayServiceItem {
    text: string;
    type?: string;
    country_id?: string;
    country_name?: string;
}

export interface Holiday {
    id: string;
    main_image: HolidayImage;
    images?: HolidayImage[]; // Detail view
    title: string;
    subtitle: string | null;
    categories: HolidayCategory[] | string[]; // Can be IDs in detail view
    route: string | null;
    transport: string;
    available_from: string;
    available_to: string;
    available_months: number[];
    holiday_type: string;
    min_price: HolidayPrice;
    max_price: HolidayPrice;
    country: HolidayCountry;
    status: string;
    supplier: string;
    duration: number;
    nights: number;
    last_update: string;
    created_at: string;
    recommended_order: number | null;
    promo: any | null;
    tags: any[];

    // Detail view specific fields
    trips?: HolidayTrip[];
    accommodations?: HolidayAccommodation[];
    additional_services?: any[];
    holiday_trips?: any[];
    modified_at?: string;
    currency?: string;
    duration_html?: string | null;
    transfer_included?: boolean;
    guide_included?: boolean;
    included?: { text: string }[];
    not_included?: { text: string }[];
    daily_program?: HolidayProgramDay[];
    useful_info?: HolidayServiceItem[];
    cancellation_policy?: any[];
    additional_countries?: any[];
    description?: string | null;
}

export interface HolidayApiResponse {
    holidays: Holiday[];
}
