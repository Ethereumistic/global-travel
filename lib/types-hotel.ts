export interface HotelImage {
    id: string;
    image: string;
    position?: number | null;
}

export interface HotelLocation {
    id: string;
    address_1: string;
    address_2?: string;
    longitude: number;
    latitude: number;
    city: string;
    country: string;
    country_code: string;
    country_id: string;
    post_code: string;
}

export interface HotelFacility {
    name: string;
    type: string;
    value: string;
}

export interface HotelPolicy {
    min_age?: number;
    end_time?: string;
    begin_time?: string;
    instructions?: string;
    special_instructions?: string;
    time?: string;
}

export interface HotelFees {
    optional: string | null;
    mandatory: string | null;
}

export interface HotelRating {
    count: number;
    comfort: string;
    overall: string;
    service: string;
    location: string;
    amenities: string;
    condition: string;
    cleanliness: string;
    neighborhood: string;
    recommendation_percent: string;
}

export interface Hotel {
    id: string;
    hotelhero_id?: string;
    name: string;
    location: HotelLocation;
    description: string;
    description_en?: string;
    phone?: string;
    email?: string;
    url?: string;
    main_image: HotelImage;
    facilities: HotelFacility[];
    images: HotelImage[];
    rating: number;
    guest_rating?: HotelRating;
    status: string;
    checkin_policy?: HotelPolicy;
    checkin_policy_en?: HotelPolicy;
    checkout_policy?: HotelPolicy;
    checkout_policy_en?: HotelPolicy;
    fees?: HotelFees;
    fees_en?: HotelFees;

    // Fields present in list view or flat structure
    city?: string;
    country?: string;
    address?: string;
    country_code?: string;
}

export interface HotelsResponse {
    hotels: Hotel[];
    total: number;
}
