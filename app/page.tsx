import { getHolidayPage } from '@/app/actions/get-holidays';
import { HomeClient } from './home-client';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

export default async function HomePage() {
  // Fetch initial data on the server
  // limit 8 matches the initial display count in the original file
  let page;
  try {
    page = await getHolidayPage(8);
  } catch (error) {
    // A fresh deploy must not depend on the supplier being online. Only a build
    // may generate this explicit unavailable state; runtime ISR must throw so
    // an outage cannot replace an already successful homepage with empty data.
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    console.error('Homepage catalogue unavailable during build', error);
    return <HomeClient initialHolidays={[]} initialNextOffset={0} initialLoadFailed />;
  }

  return <HomeClient initialHolidays={page.items} initialNextOffset={page.nextOffset} />;
}
