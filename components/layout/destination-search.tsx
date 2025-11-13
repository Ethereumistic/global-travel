// components/destination-search.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
// Вече не ни трябва 'fast-xml-parser' тук, защото парсването става на сървъра
// import { XMLParser } from "fast-xml-parser";

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
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Type Definitions ---
// Тези типове трябва да съвпадат с това, което връща API-то
// (вече ги дефинирахме и в app/api/destinations/route.ts)
type Destination = {
  id: string;
  name: string;
  type: "Country" | "City";
  countryName: string;
};

// --- API Fetching Logic (ОБНОВЕНА) ---

/**
 * Извлича дестинациите от нашия собствен API Route (proxy)
 */
async function getDestinations(): Promise<Destination[]> {
    try {
      // *** CHANGE: We are now calling the new /api/packages endpoint ***
      const response = await fetch("/api/packages");
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Вече получаваме директно JSON, а не XML
      const data: Destination[] = await response.json();
      return data;
    } catch (error) {
      // Updated error message
      console.error("Failed to fetch destinations from API packages route:", error);
      return []; // Връщаме празен масив при грешка
    }
  }

// --- The Component (без промени надолу) ---

export function DestinationSearch() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    getDestinations().then((data) => {
      setDestinations(data);
      setIsLoading(false);
    });
  }, []);

  const countries = destinations.filter((d) => d.type === "Country");
  const cities = destinations.filter((d) => d.type === "City");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[300px] justify-between font-normal",
            "bg-white/20 backdrop-blur-md border-white/30 text-white",
            "hover:bg-white/30 hover:text-white"
          )}
        >
          {displayName || "Търсене на дестинация..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[300px] p-0",
          "bg-white/20 backdrop-blur-md border-white/30 text-white"
        )}
      >
        <Command
          filter={(value, search) => {
            const item = destinations.find((d) => d.id === value);
            const searchValue =
              `${item?.name} ${item?.countryName}`.toLowerCase();
            return searchValue.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput
            placeholder="Търси държава или град..."
            className="text-white placeholder:text-white/60 focus:ring-white/50"
          />
          <CommandList>
            <ScrollArea className="h-[300px]">
              {isLoading && (
                <div className="p-4 text-center text-sm">Зареждане...</div>
              )}
              <CommandEmpty className="py-6 text-center text-sm">
                Няма намерени резултати.
              </CommandEmpty>

              <CommandGroup heading="Държави">
                {countries.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.id}
                    onSelect={(currentValue) => {
                      const selected = destinations.find(
                        (d) => d.id === currentValue
                      );
                      setValue(currentValue);
                      setDisplayName(selected?.name || "");
                      setOpen(false);
                    }}
                    className="text-white aria-selected:bg-white/30"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup heading="Градове">
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.id}
                    onSelect={(currentValue) => {
                      const selected = destinations.find(
                        (d) => d.id === currentValue
                      );
                      const display = `${selected?.name} (${selected?.countryName})`;
                      setValue(currentValue);
                      setDisplayName(display);
                      setOpen(false);
                    }}
                    className="text-white aria-selected:bg-white/30"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex w-full justify-between">
                      <span>{city.name}</span>
                      <span className="text-xs opacity-70">
                        {city.countryName}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}