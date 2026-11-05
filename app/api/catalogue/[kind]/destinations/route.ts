import { catalogueError, destinationHeaders } from '@/lib/catalogue-http';
import { holidayDestinations, hotelDestinations, yachtDestinations } from '@/lib/planet';

const readers = { holidays: holidayDestinations, hotels: hotelDestinations, yachts: yachtDestinations };

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!Object.hasOwn(readers, kind)) return catalogueError(404);
  try {
    return Response.json(await readers[kind as keyof typeof readers](), { headers: destinationHeaders });
  } catch (error) {
    console.error('Catalogue destinations unavailable', { kind, error });
    return catalogueError(503);
  }
}
