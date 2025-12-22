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
import { getHolidays, getHolidayDestinations } from "@/app/actions/get-holidays";

interface CountryOption {
    value: string;
    label: string;
}

interface HolidaySearchProps {
    variant?: "hero" | "page";
    className?: string;
    onSearch?: (countryCode: string) => void;
}

export function HolidaySearch({ variant = "hero", className, onSearch }: HolidaySearchProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<CountryOption[]>([]);

    // --- Fetch Data ---
    React.useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true);
            try {
                // Use optimized server action to get all available countries
                const countries = await getHolidayDestinations();
                setOptions(countries);
            } catch (error) {
                console.error("Failed to fetch destinations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const handleSearch = () => {
        if (onSearch) {
            // If onSearch callback is provided, use it (for root page filtering)
            onSearch(value);

            // Scroll to holidays section
            const holidaysSection = document.getElementById('holidays-section');
            if (holidaysSection) {
                holidaysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setValue("");
        // Automatically trigger search to clear the filter without scrolling
        if (onSearch) {
            onSearch("");
        }
    };

    const selectedOption = options.find((option) => option.value === value);

    // Hero variant (for home page)
    if (variant === "hero") {
        return (
            <div className={cn("relative max-w-xs mx-auto z-40", className)}>
                <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-2xl">
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
                                                    className="mr-2 w-6 h-auto object-cover border border-gray-100"
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
        );
    }

    // Page variant (for holidays page - inline with page-slider)
    return null;
}
