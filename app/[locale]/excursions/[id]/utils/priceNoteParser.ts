import { ParsedPriceNote, parserKeys, FlightInfoSection, FlightTable } from '../types';

/**
 * Parses the raw content of a list-based section (like "Цената включва").
 * @param contentLines The raw text lines of the section.
 * @returns An array of strings, one for each list item.
 */
function parseList(contentLines: string[]): string[] {
  return contentLines
    .map(l => l.trim().replace(/^[•\-\*]/, '').trim()) // Remove leading bullets/dashes
    .filter(s => s); // Filter out empty lines
}

/**
 * Parses the content of a single flight information section.
 * @param title The title of the section (e.g., "Информация за полетите за група...")
 * @param contentLines The raw text lines of the section.
 * @returns A FlightInfoSection object with a parsed table or fallback text.
 */
function parseFlightSection(title: string, contentLines: string[]): FlightInfoSection {
  const lines = contentLines.map(s => s.trim()).filter(s => s);
  
  // Use .includes() and .toLowerCase() for flexibility
  const headerIdx1 = lines.findIndex(l => l.toLowerCase().includes('дестинация'));
  const headerIdx2 = lines.findIndex(l => l.toLowerCase().includes('полет'));
  const headerIdx3 = lines.findIndex(l => l.toLowerCase().includes('излита'));

  // If we can't find all three headers, fall back to text
  if (headerIdx1 === -1 || headerIdx2 === -1 || headerIdx3 === -1) {
    return { title, table: null, textFallback: lines.join('\n') };
  }

  // Find the actual header text from the lines
  const headers = [lines[headerIdx1], lines[headerIdx2], lines[headerIdx3]];

  // Assume headers are sequential and data follows the last header
  const dataStartIndex = Math.max(headerIdx1, headerIdx2, headerIdx3) + 1;
  const dataLines = lines.slice(dataStartIndex).filter(s => s.trim());

  const rows: string[][] = [];
  
  // The flight data reliably comes in chunks of 3 lines
  for (let i = 0; i < dataLines.length; i += 3) {
    if (dataLines[i + 2]) { // Ensure we have a full chunk of 3
      rows.push([dataLines[i], dataLines[i + 1], dataLines[i + 2]]);
    } else if (dataLines[i]) {
      // Handle dangling lines
      rows.push([dataLines[i], dataLines[i+1] || 'N/A', 'N/A']);
    }
  }

  if (rows.length > 0) {
    const table: FlightTable = { headers, rows };
    return { title, table, textFallback: null };
  } else {
    // No rows were parsed, so just show the raw text
    return { title, table: null, textFallback: lines.join('\n') };
  }
}

/**
 * Main parser function.
 * Takes the raw priceNote2 string and returns a structured ParsedPriceNote object.
 * @param priceNote2 The raw string from the API.
 * @returns A ParsedPriceNote object.
 */
export function parsePriceNote2(priceNote2: string | null): ParsedPriceNote | null {
  if (!priceNote2) return null;

  const initialData: ParsedPriceNote = {
    includes: [],
    excludes: [], // Matches your type file
    excursions: [],
    discounts: [],
    surcharges: [],
    conditions: [],
    flightInfo: [], // This is an array
  };

  // This regex is the key. It splits the text by all known headers.
  // It finds any line that STARTS with one of our key phrases.
  // Note: 'Информация за полетите' is special, it matches anything after it on the same line.
  const allHeadersRegex =
    /^(Цената включва:|Цената не включва:|Допълнителни екскурзии:|Отстъпки:|Доплащане:|Доплащания:|Други условия по програмата:|Информация за полетите.*?$)/gim;

  // Split the text into parts, separated by our headers.
  // We filter out empty strings that result from the split.
  const parts = priceNote2.split(allHeadersRegex).filter(p => p.trim() !== '');

  // Process the parts in pairs (header, content)
  for (let i = 0; i < parts.length; i += 2) {
    const header = parts[i]?.trim();
    const content = parts[i + 1]?.trim();

    if (!header || !content) {
      continue;
    }
    
    // Split content into lines for the helper functions
    const contentLines = content.split(/[\r\n]+/).filter(Boolean);

    // Use flexible matching to find the correct section
    if (/^Информация за полетите/i.test(header)) {
      // This is the fix: We PUSH onto the array
      initialData.flightInfo.push(parseFlightSection(header, contentLines));
    }
    else if (header === parserKeys.includes) {
      initialData.includes = parseList(contentLines);
    } 
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
      initialData.conditions = parseList(contentLines);
    }
    else {
      // Handle unknown sections by adding them to conditions
      initialData.conditions.push(`**${header}**`, ...parseList(contentLines));
    }
  }

  return initialData;
}