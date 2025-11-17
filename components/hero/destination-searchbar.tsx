'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useSWR from 'swr';
import type { DestinationListItem } from '@/app/api/destinations/route';

interface DestinationSearchbarProps {
  onSelect?: (destination: DestinationListItem) => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function DestinationSearchbar({ onSelect }: DestinationSearchbarProps) {
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

  // Typewriter effect for cycling through destinations
  useEffect(() => {
    if (isActive || searchValue) return;

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
  }, [displayText, isDeleting, typewriterIndex, isActive, searchValue, destinations]);

  // Filter destinations based on search value
  const filteredDestinations = searchValue
    ? destinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          dest.cities.some((city) =>
            city.toLowerCase().includes(searchValue.toLowerCase())
          )
      )
    : destinations.slice(0, 50);

  // Handle click outside
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
    <div ref={containerRef} className="relative max-w-xs mx-auto px-4 z-6000">
      {/* Search Input */}
      <div
        className={`relative bg-white/10 backdrop-blur-xs px-4 py-2 transition-colors duration-300 hover:bg-white/15 cursor-text shadow-lg ${ // <-- FIX: Changed 'transition-all' to 'transition-colors'
          isActive
            ? 'rounded-t-2xl border-x border-t border-white/20'
            : 'rounded-2xl border border-white/20'
        }`}
        onClick={() => {
          setIsActive(true);
          setSearchValue('');
          setDisplayText('');
        }}
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-white/60 flex-shrink-0" />
          
          {isActive ? (
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Търсете дестинация..."
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-lg"
            />
          ) : (
            <span className="text-white/70 text-lg font-medium">
              {displayText}
              {!displayText && !isLoading && (
                <span className="animate-pulse">|</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isActive && (
        <div className="absolute max-w-2xs min-w-2xs top-full rounded-b-2xl bg-white/10 backdrop-blur-xs border-x border-b border-white/20 shadow-2xl overflow-hidden z-9999 px-4">
          <ScrollArea className="h-28 w-full my-2">
            <div className="space-y-2 pr-4">
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
      className="w-full rounded-[6px] bg-white/8 hover:bg-white/15 transition-colors px-4 py-1 text-left group"
    >
      <div className="flex items-center gap-4">
        <img
          src={`https://flagcdn.com/${destination.abbr}.svg`}
          alt={`${destination.name} flag`}
          className="w-6 h-4 rounded-sm object-cover"
        />
        <div className="flex-1">
          <p className="text-white font-semibold group-hover:text-white/90 transition">
            {destination.name}
          </p>
          {/* <p className="text-white/50 text-sm">{destination.continent}</p> */}
        </div>
      </div>

      {/* Cities List */}
      {isExpanded && destination.cities.length > 0 && (
        <div className="ml-9 mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {(showMore
              ? destination.cities
              : destination.cities.slice(0, 3)
            ).map((city) => (
              <span
                key={city}
                className="inline-block bg-white/10 hover:bg-white/20 transition rounded-full px-3 py-1 text-xs text-white/80"
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
              className="text-xs text-white/60 hover:text-white/80 transition flex items-center gap-1"
            >
              {showMore ? 'Show less' : `+${destination.cities.length - 3} more`}
              <ChevronDown className={`w-3 h-3 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}
    </button>
  );
}