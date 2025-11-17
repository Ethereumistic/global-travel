// /app/[locale]/excursions/[id]/utils/priceNoteParser.ts (UPDATED)

import { ParsedPriceNote, parserKeys, FlightInfoSection, FlightTable } from '../types';

function parseList(contentLines: string[]): string[] {
  // (No changes to this function)
  return contentLines
    .map(l => l.trim().replace(/^[•\-\*]/, '').trim())
    .filter(s => s);
}

/**
 * Parses the content of a single flight information section.
 * --- REFACTORED to find MULTIPLE tables ---
 * @param title The title of the section (e.g., "Информация за полетите за група...")
 * @param contentLines The raw text lines of the section.
 * @returns A FlightInfoSection object with an array of parsed tables or fallback text.
 */
function parseFlightSection(title: string, contentLines: string[]): FlightInfoSection {
  const tables: FlightTable[] = [];
  const lines = contentLines.map(s => s.trim()).filter(s => s);

  // 1. Find the starting index of *each* table (marked by "Дестинация")
  const tableStartIndices = lines
    .map((line, index) => (line.toLowerCase().includes('дестинация') ? index : -1))
    .filter(index => index !== -1);

  // 2. If no "Дестинация" lines are found, fall back to text
  if (tableStartIndices.length === 0) {
    return { title, tables: [], textFallback: lines.join('\n') };
  }

  // 3. Loop over each found table start and parse it
  for (let i = 0; i < tableStartIndices.length; i++) {
    const startIndex = tableStartIndices[i];
    // The end index is the start of the *next* table, or the end of the lines
    const endIndex = (i + 1 < tableStartIndices.length) ? tableStartIndices[i + 1] : lines.length;
    const tableLines = lines.slice(startIndex, endIndex);

    // 4. Use the *original* parsing logic on this *subset* of lines
    const headerIdx1 = 0; // We know this is 0 because we started at "дестинация"
    const headerIdx2 = tableLines.findIndex(l => l.toLowerCase().includes('полет'));
    const headerIdx3 = tableLines.findIndex(l => l.toLowerCase().includes('излита'));

    // --- THIS IS THE FIX ---
    // Removed the (headerIdx1 === -1) check, as it caused the build error.
    if (headerIdx2 === -1 || headerIdx3 === -1) {
      continue;
    }
    // --- END OF FIX ---

    const headers = [tableLines[headerIdx1], tableLines[headerIdx2], tableLines[headerIdx3]];

    const dataStartIndex = Math.max(headerIdx1, headerIdx2, headerIdx3) + 1;
    const dataLines = tableLines.slice(dataStartIndex).filter(s => s.trim());

    const rows: string[][] = [];
    
    for (let j = 0; j < dataLines.length; j += 3) {
      if (dataLines[j + 2]) {
        rows.push([dataLines[j], dataLines[j + 1], dataLines[j + 2]]);
      } else if (dataLines[j]) {
        rows.push([dataLines[j], dataLines[j+1] || 'N/A', 'N/A']);
      }
    }

    if (rows.length > 0) {
      tables.push({ headers, rows });
    }
  }

  // 5. Return the final result
  if (tables.length > 0) {
    return { title, tables, textFallback: null };
  } else {
    // We found headers but no rows? Fallback.
    return { title, tables: [], textFallback: lines.join('\n') };
  }
}

/**
 * Main parser function.
 * (No changes needed in this function, but included for context)
 */
export function parsePriceNote2(priceNote2: string | null): ParsedPriceNote | null {
  if (!priceNote2) return null;

  const initialData: ParsedPriceNote = {
    includes: [],
    excludes: [],
    excursions: [],
    discounts: [],
    surcharges: [],
    conditions: [],
    flightInfo: [], // This is an array
  };

  const allHeadersRegex =
    /^(Цената включва:|Цената не включва:|Допълнителни екскурзии:|Отстъпки:|Доплащане:|Доплащания:|Други условия по програмата:|Информация за полетите.*?$)/gim;

  const isHeaderRegex =
    /^(Цената включва:|Цената не включва:|Допълнителни екскурзии:|Отстъпки:|Доплащане:|Доплащания:|Други условия по програмата:|Информация за полетите.*?)$/i;
    
  const parts = priceNote2.split(allHeadersRegex).filter(p => p.trim() !== '');

  let i = 0; 
  if (parts.length > 0 && !isHeaderRegex.test(parts[0].trim())) {
    const contentLines = parts[0].trim().split(/[\r\n]+/).filter(Boolean);
    initialData.conditions.push(...parseList(contentLines));
    i = 1; 
  }

  for (; i < parts.length; i += 2) {
    const header = parts[i]?.trim();
    const content = parts[i + 1]?.trim();

    if (!header || !content) {
      continue;
    }
    
    const contentLines = content.split(/[\r\n]+/).filter(Boolean);

    if (/^Информация за полетите/i.test(header)) {
      // This correctly calls our *new* parseFlightSection
      initialData.flightInfo.push(parseFlightSection(header, contentLines));
    }
    else if (header === parserKeys.includes) {
      initialData.includes = parseList(contentLines);
    } 
    // ... (rest of the else/if blocks are unchanged) ...
    else if (header === parserKeys.excludes) {
      initialData.excludes = parseList(contentLines);
    }
    else if (header === parserKeys.excursions) {
      initialData.excursions = parseList(contentLines);
    }
    else if (header === parserKeys.discounts) {
      initialData.discounts = parseList(contentLines);
    }
    else if (header === parserKeys.surcharges || header === parserKeys.surchargesPlural) {
      initialData.surcharges = parseList(contentLines);
    }
    else if (header === parserKeys.conditions) {
      initialData.conditions.push(...parseList(contentLines));
    }
    else {
      initialData.conditions.push(`**${header}**`, ...parseList(contentLines));
    }
  }

  return initialData;
}