"use client";

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Navbar from './Navbar';
import Footer from './Footer';
import Script from 'next/script';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  
  // Dati per lo schema JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'M.T.R.E. Giardinaggio',
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch'}/images/hero/home-new.jpg`,
    '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch'}/#LocalBusiness`,
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch',
    telephone: '+41 76 742 67 36',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Croce 2',
      addressLocality: 'Biasca',
      postalCode: '6710',
      addressRegion: 'Ticino',
      addressCountry: 'CH'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.3602,
      longitude: 8.9706
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00'
      }
    ],
    sameAs: [
      'https://www.facebook.com/mtregiardinaggio',
      'https://www.instagram.com/mtregiardinaggio',
      'https://www.linkedin.com/company/mtregiardinaggio'
    ],
    priceRange: '$$',
    servesCuisine: 'Gardening Services'
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 