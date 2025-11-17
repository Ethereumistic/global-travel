'use client';

import { useState, useEffect, useRef } from 'react';
// --- MODIFICATION: Import X icon ---
import { Search, ChevronDown, X } from 'lucide-react';
// --- END MODIFICATION ---
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useSWR from 'swr';
import type { DestinationListItem } from '@/app/api/destinations/route';

// --- MODIFICATION: Update props interface ---
interface DestinationSearchbarProps {
  onSelect?: (destination: DestinationListItem) => void;
  selectedDestination: DestinationListItem | null;
  onClear: () => void;
}
// --- END MODIFICATION ---

const fetcher = (url: string) => fetch(url).then(res => res.json());

// --- MODIFICATION: Update function signature ---
export function DestinationSearchbar({
  onSelect,
  selectedDestination,
  onClear,
}: DestinationSearchbarProps) {
// --- END MODIFICATION ---

  const { data: destinations = [], isLoading } = useSWR<DestinationListItem[]>(
    '/api/destinations',
    fetcher
  );

  const [isActive, setIsActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    // --- MODIFICATION: Stop typewriter if a destination is selected ---
    if (isActive || searchValue || selectedDestination) {
      // Clear display text if we just selected something
      if (selectedDestination && displayText) {
        setDisplayText('');
      }
      return;
    }
    // --- END MODIFICATION ---

    if (!destinations.length) return;

    const currentDestination = destinations[typewriterIndex % destinations.length];
    const targetText = currentDestination.name;

    const typeSpeed = isDeleting ? 30 : 100;
    const deleteDelay = 1500;

    typewriterRef.current = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < targetText.length) {
          setDisplayText(targetText.slice(0, displayText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTypewriterIndex((prev) => prev + 1);
        }
      }
    }, !isDeleting && displayText.length === targetText.length ? deleteDelay : typeSpeed);

    return () => clearTimeout(typewriterRef.current as NodeJS.Timeout);
  // --- MODIFICATION: Add selectedDestination to dependency array ---
  }, [
    displayText,
    isDeleting,
    typewriterIndex,
    isActive,
    searchValue,
    destinations,
    selectedDestination,
  ]);
  // --- END MODIFICATION ---

  // ... filteredDestinations logic remains the same ...
  const filteredDestinations = searchValue
    ? destinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          dest.cities.some((city) =>
            city.toLowerCase().includes(searchValue.toLowerCase())
          )
      )
    : destinations.slice(0, 50);

  // ... handleClickOutside logic remains the same ...
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="relative max-w-xs mx-auto z-50"> {/* Removed px-4, z-6000 */}
      {/* Search Input */}
      <div
        // --- MODIFICATION: Update onClick ---
        className={`relative bg-white/10 backdrop-blur-xs px-4 py-2 transition-colors duration-300 hover:bg-white/15 cursor-text shadow-lg ${
          isActive
            ? 'rounded-t-2xl border-x border-t border-white/20'
            : 'rounded-2xl border border-white/20'
        }`}
        onClick={() => {
          if (!isActive) {
            setIsActive(true);
            setSearchValue('');
          }
        }}
        // --- END MODIFICATION ---
      >
        {/* --- MODIFICATION: Main display logic change --- */}
        <div className="flex items-center gap-3">
          {/* Show Flag if selected and inactive, otherwise show Search icon */}
          {!isActive && selectedDestination ? (
            <img
              src={`https://flagcdn.com/${selectedDestination.abbr}.svg`}
              alt={`${selectedDestination.name} flag`}
              className="w-6 h-4 rounded-sm object-cover flex-shrink-0"
            />
          ) : (
            <Search className="w-5 h-5 text-white/60 flex-shrink-0" />
          )}

          {/* Show input if active */}
          {isActive ? (
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Търсете дестинация..."
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-lg"
            />
          // Show selected name if inactive and selected
          ) : selectedDestination ? (
            <span className="text-white text-lg font-medium flex-1 truncate">
              {selectedDestination.name}
            </span>
          // Show typewriter if inactive and nothing selected
          ) : (
            <span className="text-white/70 text-lg font-medium">
              {displayText}
              {!displayText && !isLoading && (
                <span className="animate-pulse">|</span>
              )}
            </span>
          )}

{/* Show Clear Button (X) */}
{(isActive && searchValue) || (!isActive && selectedDestination) ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop click from bubbling to the div
                if (isActive) {
                  setSearchValue(''); // Clear search input
                } else {
                  // --- FIX: Add this line ---
                  setDisplayText(''); // Instantly clear typewriter text
                  // --- END FIX ---
                  onClear(); // Clear selected destination
                }
              }}
              title={isActive ? "Изчисти търсENEто" : "Изчисти филтъра"}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </div>
        {/* --- END MODIFICATION --- */}
      </div>

      {/* Dropdown Menu */}
      {isActive && (
        <div className="absolute w-full top-full rounded-b-2xl bg-white/10 backdrop-blur-xs border-x border-b border-white/20 shadow-2xl overflow-hidden z-40"> {/* Removed min/max-w, px-4, z-9999 */}
          <ScrollArea className="h-32 w-full my-2"> {/* Increased height */}
            <div className="space-y-1 pr-2 pl-2"> {/* Adjusted padding */}
              {isLoading ? (
                <div className="text-center py-8 text-white/60">Зареждане на дестинации...</div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-8 text-white/60">Няма намерена дестинация</div>
              ) : (
                filteredDestinations.map((destination) => (
                  <DestinationItem
                    key={destination.id}
                    destination={destination}
                    isExpanded={searchValue.length > 0}
                    onClick={() => {
                      onSelect?.(destination);
                      setIsActive(false);
                      setSearchValue('');
                      // We no longer clear displayText here
                    }}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// --- MODIFICATION: DestinationItem styling ---
function DestinationItem({
  destination,
  isExpanded,
  onClick,
}: {
  destination: DestinationListItem;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg bg-white/5 hover:bg-white/15 transition-colors px-3 py-2 text-left group" // Adjusted padding/radius
    >
      <div className="flex items-center gap-3"> {/* Adjusted gap */}
        <img
          src={`https://flagcdn.com/${destination.abbr}.svg`}
          alt={`${destination.name} flag`}
          className="w-6 h-4 rounded-sm object-cover"
        />
        <div className="flex-1">
          <p className="text-white font-medium group-hover:text-white transition"> {/* Adjusted font/color */}
            {destination.name}
          </p>
        </div>
      </div>

      {/* Cities List */}
      {isExpanded && destination.cities.length > 0 && (
        <div className="ml-9 mt-2 space-y-2"> {/* Adjusted margin */}
          <div className="flex flex-wrap gap-1.5"> {/* Adjusted gap */}
            {(showMore
              ? destination.cities
              : destination.cities.slice(0, 3)
            ).map((city) => (
              <span
                key={city}
                className="inline-block bg-white/10 hover:bg-white/20 transition rounded-full px-2.5 py-0.5 text-xs text-white/80" // Adjusted padding
              >
                {city}
              </span>
            ))}
          </div>
          {destination.cities.length > 3 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
              className="text-xs text-white/60 hover:text-white/80 transition flex items-center gap-1 mt-1.5" // Adjusted margin
            >
              {showMore ? 'По-малко' : `+${destination.cities.length - 3} още`}
              <ChevronDown className={`w-3 h-3 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}
    </button>
  );
}