"use client";

import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/HeroSection';
import Script from 'next/script';

export default function Home() {
  const t = useTranslations();
  
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "name": "M.T.R.E. Giardiniere Ticino",
    "alternateName": "M.T.R.E. Giardinaggio Professionale",
    "image": "https://mtre.ch/images/hero/home-new.avif",
    "logo": "https://mtre.ch/images/android-chrome-192x192.png",
    "url": "https://mtre.ch",
    "telephone": "+41767426736",
    "email": "info@mtre.ch",
    "description": "Giardiniere professionista in Ticino con oltre 15 anni di esperienza. Servizi di giardinaggio, manutenzione del verde, progettazione giardini e spazi verdi in tutta la Svizzera italiana. Preventivi gratuiti e soluzioni personalizzate.",
    "slogan": "La tua scelta per un giardino perfetto in ogni stagione",
    "priceRange": "CHF",
    "currenciesAccepted": "CHF",
    "paymentAccepted": "Contanti, Bonifico Bancario, Fattura",
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
      "latitude": 46.3588,
      "longitude": 8.9687
    },
    "hasMap": "https://www.google.com/maps?q=46.3588,8.9687",
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
        "closes": "13:00"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 46.3,
        "longitude": 8.9
      },
      "geoRadius": "80000"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Biasca"
      },
      {
        "@type": "City",
        "name": "Bellinzona"
      },
      {
        "@type": "City",
        "name": "Lugano"
      },
      {
        "@type": "City",
        "name": "Locarno"
      },
      {
        "@type": "City",
        "name": "Mendrisio"
      },
      {
        "@type": "City",
        "name": "Chiasso"
      },
      {
        "@type": "State",
        "name": "Canton Ticino"
      }
    ],
    "keywords": "giardiniere ticino, giardinaggio professionale, manutenzione giardini, potatura alberi, progettazione giardini, preventivo giardiniere, irrigazione automatica, cura del verde, taglio erba, siepi, aiuole",
    "knowsLanguage": ["it-CH", "fr-CH", "de-CH"],
    "awards": "Servizio di giardinaggio certificato con esperienza dal 2009",
    "founded": "2009",
    "foundingLocation": "Biasca, Ticino, Svizzera",
    "founder": {
      "@type": "Person",
      "name": "M.T.R.E. Team"
    },
    "sameAs": [
      "https://www.instagram.com/mtre.ch/",
      "https://www.facebook.com/mtre.ch"
    ]
  };
  
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Servizi di Giardinaggio",
    "provider": {
      "@type": "LandscapingBusiness",
      "name": "M.T.R.E. Giardiniere Ticino",
      "url": "https://mtre.ch"
    },
    "areaServed": {
      "@type": "State",
      "name": "Ticino, Svizzera"
    },
    "description": "Servizi professionali di giardinaggio, progettazione e manutenzione di giardini in Ticino",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "CHF"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servizi di Giardinaggio",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Progettazione Giardini",
            "url": "https://mtre.ch/services/garden-design"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Manutenzione Giardini",
            "url": "https://mtre.ch/services/garden-maintenance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Potatura",
            "url": "https://mtre.ch/services/pruning"
          }
        }
      ]
    }
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quali zone del Ticino coprite con i vostri servizi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Operiamo in tutto il Canton Ticino, con particolare attenzione alle aree di Biasca, Bellinzona, Lugano, Locarno, Mendrisio e tutte le località circostanti. Grazie alla nostra flotta di mezzi moderni, possiamo raggiungere qualsiasi luogo in Ticino per offrire i nostri servizi di giardinaggio di qualità."
        }
      },
      {
        "@type": "Question",
        "name": "Offrite preventivi gratuiti per i lavori di giardinaggio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sì, offriamo sopralluoghi e preventivi completamente gratuiti e senza impegno per tutti i nostri servizi. Il nostro team di esperti effettuerà un'analisi dettagliata delle vostre esigenze e vi fornirà un preventivo chiaro e trasparente, calibrato sulle specifiche necessità del vostro spazio verde."
        }
      },
      {
        "@type": "Question",
        "name": "Che tipo di servizi di giardinaggio offrite a Ticino?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Offriamo una gamma completa di servizi professionali che include: progettazione di giardini, manutenzione ordinaria e straordinaria, potatura di alberi e siepi, impianti di irrigazione, realizzazione di aree verdi e illuminazione per giardini. Tutti i nostri servizi sono realizzati con materiali di alta qualità e tecniche professionali per garantire risultati duraturi."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto costa un servizio di giardinaggio a Ticino?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I costi variano in base al tipo di servizio, alle dimensioni dell'area e alla complessità del lavoro. Offriamo tariffe competitive e trasparenti, con possibilità di abbonamenti per manutenzione periodica che garantiscono un risparmio significativo. Contattateci per un preventivo personalizzato gratuito che si adatti perfettamente alle vostre esigenze e al vostro budget."
        }
      }
    ]
  };
  
  return (
    <MainLayout>
      {/* Schema.org markup */}
      <Script id="schema-local-business" type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="schema-service" type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>
      <Script id="schema-faq" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      
      {/* Hero Section */}
      <HeroSection
        title={t('home.hero.title')}
        description={t('home.hero.subtitle')}
        height="h-[85vh]"
        backgroundImage="/images/hero/home-new.avif"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <Link 
            href="/contact" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 text-center border border-transparent hover:shadow-lg flex items-center justify-center group"
          >
            {t('home.hero.cta')}
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
          <Link 
            href="/services" 
            className="bg-transparent hover:bg-white/10 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 text-center border border-white hover:border-green-400"
          >
            {t('navigation.services')}
          </Link>
        </div>
      </HeroSection>

      {/* About Section con immagine */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-green-800 mb-6">
                <span className="text-green-700">{t('home.about.title')}</span> - {t('home.about.subtitle')}
              </h1>
              <p className="text-lg text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: t('home.about.mainDescription') }} />
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-2">{t('home.about.benefitsTitle')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.about.benefits.experience') }} />
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.about.benefits.quality') }} />
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.about.benefits.pricing') }} />
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.about.benefits.equipment') }} />
                  </li>
                </ul>
              </div>
              <div className="mb-6">
                <p className="text-green-800 font-semibold">Operiamo in tutte le zone del Ticino: Bellinzona, Lugano, Locarno, Mendrisio, Biasca e dintorni.</p>
              </div>
              <div className="mt-8">
                <Link 
                  href="/services" 
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md transition-all duration-300 inline-flex items-center"
                >
                  Scopri tutti i nostri servizi di giardinaggio
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/mtregiardinaggio.avif"
                alt="M.T.R.E. Giardiniere Ticino - Professionisti del giardinaggio al lavoro"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                fetchPriority="high"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Servizi Preview con immagini */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            {t('services.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Servizio 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="/images/services/garden-design.avif"
                  alt={t('home.services.design.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  priority
                  fetchPriority="high"
                  quality={85}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.design.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.design.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Servizio 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="/images/services/maintenance.avif"
                  alt={t('home.services.maintenance.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.maintenance.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.maintenance.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Servizio 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="/images/services/irrigation.avif"
                  alt={t('home.services.irrigation.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.irrigation.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.irrigation.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block"
            >
              {t('home.services.all')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {t('home.cta.contact')}
            </Link>
            <Link 
              href="/gallery" 
              className="bg-transparent hover:bg-green-700 border-2 border-white text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {t('home.cta.gallery')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Ottimizzata per SEO e rich snippets */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            {t('home.faq.title')}
          </h2>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            {t('home.faq.description')}
          </p>
          
          <div className="max-w-4xl mx-auto divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* FAQ Item 1 */}
            <details className="group p-6" open>
              <summary className="flex cursor-pointer items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.faq.questions.q1.question')}
                </h3>
                <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-100 group-open:opacity-0 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-0 group-open:opacity-100 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.faq.questions.q1.answer') }} />
            </details>

            {/* FAQ Item 2 */}
            <details className="group p-6">
              <summary className="flex cursor-pointer items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.faq.questions.q2.question')}
                </h3>
                <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-100 group-open:opacity-0 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-0 group-open:opacity-100 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.faq.questions.q2.answer') }} />
            </details>

            {/* FAQ Item 3 */}
            <details className="group p-6">
              <summary className="flex cursor-pointer items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.faq.questions.q3.question')}
                </h3>
                <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-100 group-open:opacity-0 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-0 group-open:opacity-100 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.faq.questions.q3.answer') }} />
            </details>

            {/* FAQ Item 4 */}
            <details className="group p-6">
              <summary className="flex cursor-pointer items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('home.faq.questions.q4.question')}
                </h3>
                <span className="relative ml-1.5 h-5 w-5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-100 group-open:opacity-0 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-0 group-open:opacity-100 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: t('home.faq.questions.q4.answer') }} />
            </details>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/contact" 
              className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold"
            >
              {t('home.faq.contact')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-6">{t('home.seo.title')}</h2>
            <div className="prose prose-lg text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: t('home.seo.content') }} />
              <div className="text-center mt-8">
                <Link 
                  href="/contact" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition duration-300"
                >
                  {t('home.seo.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonianze Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            {t('testimonials.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonianza 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-800">Giusy Novara</h3>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client1.text')}&quot;</p>
            </div>
            
            {/* Testimonianza 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-800">Stefano Vananti</h3>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client2.text')}&quot;</p>
            </div>
            
            {/* Testimonianza 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-800">Roberto Raso</h3>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client3.text')}&quot;</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/testimonials" 
              className="text-green-600 hover:text-green-800 font-semibold flex items-center justify-center transition-colors"
            >
              {t('testimonials.clients.readMore')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
