"use client";

import { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Navbar from './Navbar';
import Script from 'next/script';
import Breadcrumbs from './navigation/Breadcrumbs';

// Caricamento dinamico dei componenti non critici
const Footer = dynamic(() => import('./Footer'), {
  loading: () => <div className="h-64 bg-green-900" aria-label="Caricamento footer in corso" />,
});

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
});

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { 
  ssr: false,
});

// Componente ottimizzato con memo
const MainLayout = memo(function MainLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  
  // Dati per lo schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "M.T.R.E. Giardiniere Ticino",
    "alternateName": "M.T.R.E. Giardinaggio Professionale",
    "description": "Servizi professionali di giardinaggio in Ticino. Manutenzione, progettazione, potatura e cura del verde per privati e aziende con oltre 15 anni di esperienza.",
    "image": "https://mtre.ch/images/mtregiardinaggio.avif",
    "logo": "https://mtre.ch/images/logo.svg",
    "url": "https://mtre.ch",
    "telephone": "+41767426736",
    "email": "emanuele.novara77@gmail.com",
    "slogan": "La tua oasi verde in Ticino",
    "priceRange": "$$",
    "currenciesAccepted": "CHF",
    "paymentAccepted": "Cash, Credit Card, Invoice",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via Croce 2",
      "addressLocality": "Biasca",
      "postalCode": "6710",
      "addressRegion": "Ticino",
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.3595",
      "longitude": "8.9681"
    },
    "hasMap": "https://www.google.com/maps?cid=9802269403076516601",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "46.3331",
        "longitude": "8.8010"
      },
      "geoRadius": "50000"
    },
    "areaServed": ["Bellinzona", "Locarno", "Lugano", "Mendrisio", "Biasca", "Cantone Ticino"],
    "keywords": "giardiniere ticino, giardinaggio, manutenzione giardini, potatura alberi, progettazione giardini, cura del verde",
    "knowsLanguage": ["Italian", "English", "French", "German"],
    "awards": "Certificato giardiniere professionista con 15+ anni di esperienza",
    "foundingLocation": "Ticino, Svizzera",
    "founded": "2008",
    "founder": "Emanuele Novara",
    "sameAs": [
      "https://www.instagram.com/mtregiardiniere/",
      "https://www.facebook.com/profile.php?id=100063575210819",
      "https://wa.me/41767426736"
    ],
    "servesCuisine": 'Gardening Services'
  };

  // Monitora il montaggio solo lato client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema JSON-LD per SEO */}
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Componenti non critici caricati dinamicamente */}
      {mounted && (
        <Footer />
      )}
    </div>
  );
});

export default MainLayout; 