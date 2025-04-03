import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/navigation";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

// Ottimizzazione: configuriamo i font con display swap per migliorare CLS
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Funzione per generare i metadata in base alla lingua
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  
  const titles = {
    it: 'Giardiniere Ticino | M.T.R.E. Professionista Giardinaggio | Preventivo Gratuito',
    en: 'Professional Gardener in Ticino | M.T.R.E. Garden Services | Free Quote',
    fr: 'Jardinier Professionnel au Tessin | M.T.R.E. Services | Devis Gratuit',
    de: 'Professioneller Gärtner im Tessin | M.T.R.E. Gartenservice | Gratis Angebot'
  };
  
  const descriptions = {
    it: 'Giardiniere professionista in Ticino con oltre 15 anni di esperienza. Manutenzione giardini, potatura, progettazione e lavori di giardinaggio 100% garantiti. ✓ Preventivi gratuiti ✓ Interventi rapidi ✓ Materiali di qualità.',
    en: 'Professional gardener in Ticino with over 15 years of experience. Garden maintenance, pruning, design and 100% guaranteed gardening work. ✓ Free quotes ✓ Quick interventions ✓ Quality materials.',
    fr: 'Jardinier professionnel au Tessin avec plus de 15 ans d\'expérience. Entretien de jardins, taille, conception et travaux de jardinage garantis à 100%. ✓ Devis gratuits ✓ Interventions rapides ✓ Matériaux de qualité.',
    de: 'Professioneller Gärtner im Tessin mit über 15 Jahren Erfahrung. Gartenpflege, Beschneidung, Design und 100% garantierte Gartenarbeit. ✓ Kostenlose Angebote ✓ Schnelle Eingriffe ✓ Qualitätsmaterialien.'
  };
  
  const keywords = {
    it: 'giardiniere ticino, giardinaggio ticino, manutenzione giardini, potatura alberi, progettazione giardini, preventivo giardiniere, giardiniere professionista svizzera, aiuola, siepe, taglio erba, diserbo, irrigazione automatica, prezzi giardiniere, costo manutenzione giardino',
    en: 'gardener ticino, gardening ticino, garden maintenance, tree pruning, garden design, gardener quote, professional gardener switzerland, flower bed, hedge, grass cutting, weeding, automatic irrigation, gardener prices, garden maintenance cost',
    fr: 'jardinier tessin, jardinage tessin, entretien jardins, taille arbres, conception jardins, devis jardinier, jardinier professionnel suisse, parterre, haie, tonte pelouse, désherbage, irrigation automatique, prix jardinier, coût entretien jardin',
    de: 'gärtner tessin, gartenbau tessin, gartenpflege, baumbeschneidung, gartengestaltung, gärtner angebot, professioneller gärtner schweiz, blumenbeet, hecke, grasschnitt, unkrautbekämpfung, automatische bewässerung, gärtnerpreise, gartenpflegekosten'
  };
  
  return {
    title: titles[locale as keyof typeof titles] || titles.it,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
    keywords: keywords[locale as keyof typeof keywords] || keywords.it,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
      languages: {
        'it': '/it',
        'en': '/en',
        'fr': '/fr',
        'de': '/de',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: baseUrl,
      siteName: 'M.T.R.E. Giardiniere Ticino',
      title: titles[locale as keyof typeof titles] || titles.it,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
      images: [
        {
          url: `${baseUrl}/images/hero/home-new.avif`,
          width: 1200,
          height: 630,
          alt: 'M.T.R.E. Giardinaggio Ticino - Servizi professionali di giardinaggio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.it,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
      images: [`${baseUrl}/images/hero/home-new.avif`],
    },
    robots: {
      index: true,
      follow: true,
      notranslate: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        noimageindex: false
      }
    },
    other: {
      "google-site-verification": "YOUR_VERIFICATION_CODE", // Aggiungi il tuo codice di verifica Google
    }
  };
}

// Genera i parametri statici per le lingue supportate
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  // Carica i messaggi per la lingua corrente
  const messages = await getMessages({
    locale
  });

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preconnect e DNS prefetch per risorse esterne */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Meta tag per colore tema browser */}
        <meta name="theme-color" content="#166534" /> 
        
        {/* Favicon tags pointing to files in public/images/ */}
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/images/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" type="image/png" sizes="180x180" />
        <link rel="android-chrome" href="/images/android-chrome-192x192.png" sizes="192x192" />
        <link rel="android-chrome" href="/images/android-chrome-512x512.png" sizes="512x512" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Rome">
          {children}
        </NextIntlClientProvider>
        {/* Speed Insights script sarà caricato automaticamente da Vercel in produzione */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                try {
                  if (window._vercel) {
                    window._vercel.insights.load();
                  }
                } catch (err) {
                  console.error('Error loading speed insights:', err);
                }
              }, 100);
            `
          }} 
        />
      </body>
    </html>
  );
}
