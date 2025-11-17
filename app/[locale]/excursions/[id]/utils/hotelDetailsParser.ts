// app/lib/hotelDetailsParser.ts (OR: app/[locale]/excursions/[id]/utils/hotelDetailsParser.ts)
// PASTE THIS ENTIRE FILE CONTENT

import { HotelDetailSection } from "../types"; // Adjust path if needed

// Define the headers we're looking for and their matching icons
const headerKeys = {
  location: "Местоположение",
  rooms: "Описание на стаите",
  services: "Услуги",
  food: "Изхранване",
  skip: "Описание на хотела", // We will skip this section
};

const iconMap: Record<string, HotelDetailSection["icon"]> = {
  [headerKeys.location]: "MapPin",
  [headerKeys.rooms]: "BedDouble",
  [headerKeys.services]: "ConciergeBell",
  [headerKeys.food]: "Utensils",
};

// This regex finds all our target headers, which split the content
const allHeadersRegex =
  /^(Местоположение|Описание на стаите|Услуги|Изхранване|Описание на хотела):?\s*$/gim;

/**
 * Parses the raw 'details' string from the hotel API into a structured array
 * for the accordion component.
 * @param detailsString The raw HTML/text string from hotel.Details
 * @returns An array of HotelDetailSection objects
 */
export function parseHotelDetails(
  detailsString: string | null
): HotelDetailSection[] {
  if (!detailsString) return [];

  const sections: HotelDetailSection[] = [];

  // Split the text by our headers and filter out empty parts
  const parts = detailsString.split(allHeadersRegex).filter((p) => p.trim() !== "");

  // --- NEW FALLBACK LOGIC ---
  // If parts.length is 1, it means split() found no headers.
  // We will treat the entire text as one single "Info" section.
  if (parts.length === 1) {
    sections.push({
      title: "Описание", // Default title
      content: parts[0].trim(),
      icon: "Info",
    });
    return sections;
  }
  // --- END OF NEW LOGIC ---

  // Process the parts in pairs (header, content)
  for (let i = 0; i < parts.length; i += 2) {
    // Clean the header (remove trailing colon)
    const header = parts[i]?.trim().replace(/:$/, "");
    const content = parts[i + 1]?.trim();

    if (!header || !content) {
      continue;
    }

    // Skip the "Описание на хотела" section as requested
    if (header.toLowerCase() === headerKeys.skip.toLowerCase()) {
      continue;
    }

    // Find the matching icon, or use "Info" as a fallback
    const icon = iconMap[header] || "Info";

    sections.push({
      title: header,
      content: content.trim(), // Assign the cleaned content
      icon: icon,
    });
  }

  return sections;
}