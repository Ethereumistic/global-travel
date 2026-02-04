import React from 'react';
import './globals.css';
import NavBarWithPathCheck from '@/components/layout/nav-bar-wrapper';
import { Balsamiq_Sans, Geologica } from 'next/font/google'
import FooterWithPathCheck from '@/components/layout/footer-wrapper';

// export const runtime = 'edge';

const balsamiq = Balsamiq_Sans({
  variable: "--font-balsamiq",
  subsets: ["cyrillic"],
  weight: "400"
});

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
});

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Global Travel',
    default: 'Global Travel - Туристическа Агенция',
  },
  description: 'Вашият надежден партньор за почивки, екскурзии, хотели и яхти. Открийте света с Global Travel.',
  keywords: ['почивки', 'екскурзии', 'хотели', 'яхти', 'туристическа агенция', 'travel agency bulgaria', 'почивка в турция', 'почивка в гърция', 'почивки в европа'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    siteName: 'Global Travel',
    title: 'Global Travel - Туристическа Агенция',
    description: 'Вашият надежден партньор за почивки, екскурзии, хотели и яхти.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Global Travel',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className={`${balsamiq.variable} ${geologica.variable} antialiased font-geologica`} >
        <React.Suspense fallback={null}>
          <NavBarWithPathCheck />
        </React.Suspense>
        {children}
        <FooterWithPathCheck />
      </body>
    </html>
  );
}