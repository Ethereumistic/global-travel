// app/[locale]/page.tsx

import { ExcursionCard } from '@/components/excursions/excursion-card';
import { getTranslations } from 'next-intl/server';
import HeroVideo from '@/components/hero/hero-video';

// 1. FIX: Import the correct type from type-adapters, not the API route
import type { UnifiedPackage } from '@/lib/type-adapters';

// 2. Helper type alias if you prefer using 'PackageListItem' in your component code
type PackageListItem = UnifiedPackage;

async function getPackages(): Promise<PackageListItem[]> {
  try {
    // Use an absolute URL for server-side fetches or a relative one if using client components (but this is a server component)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Ensure the URL matches your file structure: app/api/packages/route.ts -> /api/packages
    const response = await fetch(`${baseUrl}/api/packages`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }

    const data: PackageListItem[] = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export default async function HomePage() {
  const [packages, t] = await Promise.all([
    getPackages(),
    getTranslations('HomePage')
  ]);
  
  return (
    <div>
      <div className='-mt-20 '>
        <HeroVideo />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-4">
          {packages.map((pkg) => (
            // Ensure ExcursionCard can handle the UnifiedPackage type
            <ExcursionCard key={pkg.id} package={pkg} />
          ))}
        </div>
    </div>
  );
}