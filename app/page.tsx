import { getHolidayPage } from '@/app/actions/get-holidays';
import { HomeClient } from './home-client';

export default async function HomePage() {
  // Fetch initial data on the server
  // limit 8 matches the initial display count in the original file
  const { items: initialHolidays, nextOffset } = await getHolidayPage(8);

  return <HomeClient initialHolidays={initialHolidays} initialNextOffset={nextOffset} />;
}