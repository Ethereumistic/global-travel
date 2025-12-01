import { client } from "@/lib/sanity"; // Ensure this path matches where you made client
import FlightsBrowser, { SanityFlight } from "@/components/flights/flights-browser";

// Don't cache data forever (update every hour) or use 'no-store' for instant updates
export const revalidate = 3600;

async function getFlights() {
  return client.fetch<SanityFlight[]>(`
    *[_type == "flight"] {
      _id,
      toCity,
      toCountry,
      fromCity,
      fromCountry,
      price,
      "imageUrl": thumbnail.asset->url,
      airlines[]->{
        name,
        color
      },
      slug
    }
  `);
}

export default async function FlightsPage() {
  const flights = await getFlights();
  return <FlightsBrowser flights={flights} />;
}