import Image from "next/image";
// Import ALL_COUNTRIES to perform the necessary name/ISO lookup
import { ALL_COUNTRIES } from "@/lib/constants"; 

// Match the shape from UnifiedPackageDetail['countries']
interface CountryInfo {
  name: string;
  iso?: string;
  flagUrl?: string | null;
  id?: string;
}

interface ExcursionHeaderProps {
  title: string;
  // Updated to accept the full country data structure
  countries: CountryInfo[];
}

// Helper to resolve Bulgarian Name and Flag URL, similar to TravelInfoGrid
const getCountryDisplayData = (country: CountryInfo) => {
    let displayName = country.name;
    let isoCode = country.iso ? country.iso.toLowerCase() : null;

    // 1. Find match in ALL_COUNTRIES
    //    PRIORITY: Match by ISO code (for New API translation)
    //    FALLBACK: Match by Name (for XML API name lookup)
    let match = null;
    
    if (isoCode) {
      match = ALL_COUNTRIES.find((c) => c.abbr.toLowerCase() === isoCode);
    } else {
      match = ALL_COUNTRIES.find((c) => c.name.toLowerCase() === country.name.toLowerCase());
    }

    // 2. If a match is found, use the Bulgarian name and resolved ISO code
    if (match) {
      displayName = match.name;
      isoCode = match.abbr;
    }

    // 3. Construct FlagCDN URL (Using SVG for better scaling in the header)
    const finalFlagUrl = isoCode
      ? `https://flagcdn.com/${isoCode}.svg`
      : null;

    return { name: displayName, flagUrl: finalFlagUrl };
};


export function ExcursionHeader({ title, countries }: ExcursionHeaderProps) {
  return (
    <div className="flex justify-start items-center text-center mb-4">
      {countries.length > 0 && (
        <div className="flex items-center flex-shrink-0 mr-4">
          {countries.map((country, idx) => {
            // Use the helper to resolve the display data
            const { name, flagUrl } = getCountryDisplayData(country);

            if (!flagUrl) return null; // Skip if no flag URL could be generated

            return (
              // Use a combination of ID and index for a unique key
              <div key={country.id || name || idx} className="relative w-12 h-8 mr-1">
                <Image
                  src={flagUrl}
                  alt={`${name} flag`}
                  width={48}
                  height={32}
                  className="border border-gray-300 rounded-[4px] object-cover"
                  title={name}
                />
              </div>
            );
          })}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-secondary">
        {title}
      </h1>
    </div>
  );
}