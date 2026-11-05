type Kind = 'hotels' | 'holidays' | 'yachts';
type Fetcher = (input: string, init: RequestInit & { next?: { revalidate: number } }) => Promise<Response>;

export async function readPlanetDetail<T>(kind: Kind, id: string, fetcher: Fetcher = fetch): Promise<T | null> {
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id)) return null;
  const response = await fetcher(`https://live.planet.bg/api/v1/${kind}/${id}/`, {
    next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  // An upstream denial/outage is not a missing offer. Throwing preserves a
  // previously generated ISR page instead of replacing it with a cached 404.
  if (!response.ok) throw new Error(`Planet ${kind} detail returned HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
