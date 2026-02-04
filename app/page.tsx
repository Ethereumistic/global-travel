import { getHolidays } from '@/app/actions/get-holidays';
import { HomeClient } from './home-client';

export default async function HomePage() {
  // Fetch initial data on the server
  // limit 8 matches the initial display count in the original file
  const initialHolidays = await getHolidays(8);

  return <HomeClient initialHolidays={initialHolidays} />;
}