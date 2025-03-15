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
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre-giardinaggio.it'}/images/hero/home-new.jpg`,
    '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre-giardinaggio.it'}/#LocalBusiness`,
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre-giardinaggio.it',
    telephone: '+39 123 456 7890',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Roma 123',
      addressLocality: 'Milano',
      postalCode: '20100',
      addressRegion: 'MI',
      addressCountry: 'IT'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.4642,
      longitude: 9.1900
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