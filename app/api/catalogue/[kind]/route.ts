import { pageRequest } from '@/lib/catalogue';
import { catalogueError, catalogueHeaders } from '@/lib/catalogue-http';
import { holidayPage, hotelPage, yachtPage } from '@/lib/planet';

const readers = { holidays: holidayPage, hotels: hotelPage, yachts: yachtPage };

export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!Object.hasOwn(readers, kind)) return catalogueError(404);
  const query = new URL(request.url).searchParams;
  let input;
  try {
    input = pageRequest(Number(query.get('limit') ?? 12), Number(query.get('offset') ?? 0), query.get('country'));
  } catch {
    return catalogueError(400);
  }
  try {
    return Response.json(await readers[kind as keyof typeof readers](input.limit, input.offset, input.country), { headers: catalogueHeaders });
  } catch (error) {
    console.error('Catalogue page unavailable', { kind, error });
    return catalogueError(503);
  }
}
