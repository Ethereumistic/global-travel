// lib/types-yachts.ts

export interface YachtImage {
    id: string;
    image: string;
    position?: number | null;
  }
  
  export interface SeasonalPrice {
    from_date: string;
    to_date: string;
    price: number;
    currency: string;
  }
  
  export interface Yacht {
    id?: string; // API response didn't have root ID in the example, but assuming it exists from list view
    name: string;
    model: string;
    short_description: string;
    description: string;
    available_as: string;
    home_port: string;
    country?: string; // Derived or added if API provides it (defaulting to "GR" based on logic)
    
    guests: string;
    cabins: string;
    wc: string | null; // JSON uses "1" string
    
    main_image: {
      id: string;
      image: string;
    };
    
    images: YachtImage[];
    layouts: YachtImage[];
    
    // Inventory is a dictionary: "For your comfort": ["Item 1", "Item 2"]
    inventory: Record<string, string[]> | null; 
    
    // Specs is an array containing one object with localized keys
    specs: Record<string, string>[]; 
  
    min_price: {
      value: number;
      display_currency: string;
    };
    
    prices: SeasonalPrice[];
  }