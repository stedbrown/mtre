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
    it: 'M.T.R.E. Giardinaggio - Giardiniere professionista in Ticino, Svizzera | Servizi di giardinaggio',
    en: 'M.T.R.E. Gardening - Professional gardener in Ticino, Switzerland | Gardening services',
    fr: 'M.T.R.E. Jardinage - Jardinier professionnel au Tessin, Suisse | Services de jardinage',
    de: 'M.T.R.E. Gartenbau - Professioneller Gärtner im Tessin, Schweiz | Gartenbauleistungen'
  };
  
  const descriptions = {
    it: 'Giardiniere professionista in Ticino. Servizi di giardinaggio, manutenzione del verde, progettazione giardini e spazi verdi in tutta la Svizzera italiana. Preventivi gratuiti e soluzioni personalizzate.',
    en: 'Professional gardener in Ticino. Gardening services, green maintenance, garden design and green spaces throughout Italian Switzerland. Free quotes and customized solutions.',
    fr: 'Jardinier professionnel au Tessin. Services de jardinage, entretien des espaces verts, conception de jardins dans toute la Suisse italienne. Devis gratuits et solutions personnalisées.',
    de: 'Professioneller Gärtner im Tessin. Gartenbauleistungen, Grünflächenpflege, Gartengestaltung in der gesamten italienischen Schweiz. Kostenlose Angebote und maßgeschneiderte Lösungen.'
  };
  
  const keywords = {
    it: 'giardiniere, giardiniere ticino, giardiniere svizzera, giardinaggio, servizi giardinaggio, manutenzione verde, progettazione giardini, potatura, prato, irrigazione, Ticino, Svizzera, Biasca, Bellinzona, Lugano, Locarno',
    en: 'gardener, gardener ticino, gardener switzerland, gardening, gardening services, green maintenance, garden design, pruning, lawn, irrigation, Ticino, Switzerland, Biasca, Bellinzona, Lugano, Locarno',
    fr: 'jardinier, jardinier tessin, jardinier suisse, jardinage, services jardinage, entretien des espaces verts, conception de jardins, taille, pelouse, irrigation, Tessin, Suisse, Biasca, Bellinzone, Lugano, Locarno',
    de: 'gärtner, gärtner tessin, gärtner schweiz, gartenbau, gartenbauservice, grünflächenpflege, gartengestaltung, beschneidung, rasen, bewässerung, Tessin, Schweiz, Biasca, Bellinzona, Lugano, Locarno'
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
          url: `${baseUrl}/images/hero/home-new.jpg`,
          width: 1200,
          height: 630,
          alt: 'M.T.R.E. Giardiniere Ticino - Servizi di giardinaggio professionali',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.it,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
      images: [`${baseUrl}/images/hero/home-new.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
