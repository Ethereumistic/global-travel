import { Hero } from '@/components/hero/hero';
import { DestinationSearch } from '@/components/layout/destination-search';
import { LanguageSelector } from '@/components/ui/language-switcher';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div>
      <div className='-mt-22'>
      <Hero />
      </div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <LanguageSelector />

      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
      <h2>Hello</h2>
    </div>
  );
}