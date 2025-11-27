"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_COUNTRIES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

interface PageSliderProps {
  images: string[];
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  className?: string;
  searchType: "yachts" | "excursions" | "holidays" | "none";
}

interface CountryOption {
  value: string;
  label: string;
}

export function PageSlider({
  images,
  title,
  subtitle,
  icon,
  className,
  searchType,
}: PageSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<CountryOption[]>([]);

  // --- Background Image Rotation ---
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // --- Sync URL Param ---
  React.useEffect(() => {
    const countryParam = searchParams.get("country");
    if (countryParam) {
      setValue(countryParam.toLowerCase());
    } else {
      setValue("");
    }
  }, [searchParams]);

  // --- Fetch Data ---
  React.useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        if (searchType === "yachts") {
          // Using relative path for safety, ensures it hits the Next.js API route
          const res = await fetch("/api/yachts?limit=100");
          const data = await res.json();

          if (data.yachts) {
            const uniqueCountries = new Map<string, CountryOption>();
            data.yachts.forEach((yacht: any) => {
              if (yacht.country) {
                const countryCodeLower = yacht.country.toLowerCase();
                const countryData = ALL_COUNTRIES.find(
                  (c) => c.abbr === countryCodeLower
                );
                if (countryData && !uniqueCountries.has(countryCodeLower)) {
                  uniqueCountries.set(countryCodeLower, {
                    value: countryCodeLower,
                    label: countryData.name,
                  });
                }
              }
            });
            setOptions(Array.from(uniqueCountries.values()));
          }
        } else if (searchType === "holidays") {
          const res = await fetch("/api/holidays?limit=100");
          const data = await res.json();

          if (data.holidays) {
            const uniqueCountries = new Map<string, CountryOption>();
            data.holidays.forEach((holiday: any) => {
              if (holiday.country && holiday.country.iso_code) {
                const countryCodeLower = holiday.country.iso_code.toLowerCase();
                const countryData = ALL_COUNTRIES.find(
                  (c) => c.abbr === countryCodeLower
                );

                if (!uniqueCountries.has(countryCodeLower)) {
                  uniqueCountries.set(countryCodeLower, {
                    value: countryCodeLower,
                    label: countryData ? countryData.name : holiday.country.name,
                  });
                }
              }
            });
            setOptions(Array.from(uniqueCountries.values()));
          }
        }
      } catch (error) {
        console.error("Failed to fetch destinations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [searchType]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("country", value);
    } else {
      params.delete("country");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      className={cn(
        // Use min-h to allow growth on mobile, but fix height on desktop if needed.
        // Added 'relative' to container.
        "relative w-full overflow-hidden flex items-center -mt-20",
        className || "min-h-[600px]"
      )}
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={img}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Grid 
         ADDED: 'pt-28' (padding-top: 7rem). 
         This pushes the content down so it isn't hidden behind the Navbar 
         if you use -mt-20 or a fixed header.
      */}
      <div className="container relative z-10 mx-auto px-4 pt-20 ">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-center">

          {/* LEFT COLUMN: Title */}
          <div className="flex flex-col justify-center text-white animate-in fade-in slide-in-from-left-5 duration-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shrink-0">
                {icon}
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl drop-shadow-md">
                {title}
              </h2>
            </div>
            <p className="hidden md:flex text-lg text-gray-100 md:text-xl max-w-lg drop-shadow-sm leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* RIGHT COLUMN: Search Box */}
          {searchType !== "none" && (
            <div className="flex items-center justify-center lg:justify-end w-full">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-2xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Изберете дестинация
                </h3>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-white/90 text-black hover:bg-white h-12 group"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Зареждане...
                        </div>
                      ) : selectedOption ? (
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                          <img
                            src={`https://flagcdn.com/${selectedOption.value}.svg`}
                            alt="flag"
                            className="w-6 h-auto object-cover border border-gray-200 shrink-0"
                          />
                          <span className="truncate font-medium">{selectedOption.label}</span>
                        </div>
                      ) : (
                        "Всички дестинации..."
                      )}
                      <div className="flex items-center ml-2 shrink-0">
                        {value && !loading && (
                          <div
                            role="button"
                            onClick={clearSelection}
                            className="mr-2 p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </div>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-var(--radix-popover-trigger-width) p-0">
                    <Command>
                      <CommandInput placeholder="Търси държава..." />
                      <CommandList>
                        <CommandEmpty>Няма намерени резултати.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={(currentLabel) => {
                                const found = options.find(o => o.label.toLowerCase() === currentLabel.toLowerCase());
                                if (found) {
                                  setValue(found.value);
                                  setOpen(false);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === option.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <img
                                src={`https://flagcdn.com/${option.value}.svg`}
                                alt={option.label}
                                className="mr-2 w-6 h-auto object-cover  border border-gray-100"
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium transition-all active:scale-95 shadow-lg"
                  onClick={handleSearch}
                >
                  Търси
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}