import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import './globals.css';
import  NavBar  from '@/components/layout/nav-bar';
import { ThemeProvider } from "next-themes";
import { Balsamiq_Sans, Geologica } from 'next/font/google'


const balsamiq = Balsamiq_Sans({
  variable: "--font-balsamiq",
  subsets: ["cyrillic"],
  weight: "400"
});

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${balsamiq.variable} ${geologica.variable} antialiased font-balsamiq`} >
        <NextIntlClientProvider messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <NavBar />
          {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}