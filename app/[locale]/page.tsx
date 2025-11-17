// page.tsx

import { ExcursionCard } from '@/components/excursions/excursion-card';
import { DestinationSearch } from '@/components/layout/destination-search';
import { LanguageSelector } from '@/components/ui/language-switcher';
import { getTranslations } from 'next-intl/server';

// 1. IMPORT the correct, shared type from your API route
import type { PackageListItem } from '@/app/api/packages/route';
import HeroVideo from '@/components/hero/hero-video';

// 2. REMOVE the local, incomplete 'Package' type definition.
//    We will use 'PackageListItem' instead.

// --- Your data-fetching function (now using the correct type) ---
async function getPackages(): Promise<PackageListItem[]> { // 3. Use PackageListItem[]
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/packages`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
    // 4. Ensure the JSON response is cast to the correct type
    const data: PackageListItem[] = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export default async function HomePage() {
  const [packages, t] = await Promise.all([
    getPackages(), // This now returns the FULL package data
    getTranslations('HomePage')
  ]);
  

  return (
    <div>
      <div className='-mt-20'>
        <HeroVideo />
        <h2 className='text-4xl text-center  py-8 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]'>Hello</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-5">
          {/* This now works, because 'pkg' is the full 'PackageListItem' 
            and has all the data 'ExcursionCard' expects.
          */}
          {packages.map((pkg) => (
            <ExcursionCard key={pkg.id} package={pkg} />
          ))}
        </div>

      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      
      <LanguageSelector />

      <h2>Hello</h2>
      {/* ...rest of your page content... */}
    </div>
  );
}