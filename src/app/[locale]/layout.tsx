import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/navigation";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Funzione per generare i metadata in base alla lingua
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  
  const titles = {
    it: 'M.T.R.E. Giardinaggio - Servizi di giardinaggio professionali in Ticino, Svizzera',
    en: 'M.T.R.E. Gardening - Professional gardening services in Ticino, Switzerland',
    fr: 'M.T.R.E. Jardinage - Services de jardinage professionnels au Tessin, Suisse',
    de: 'M.T.R.E. Gartenbau - Professionelle Gartenbauleistungen im Tessin, Schweiz'
  };
  
  const descriptions = {
    it: 'Servizi di giardinaggio professionali, manutenzione del verde, progettazione giardini e spazi verdi in Ticino. Preventivi gratuiti e soluzioni personalizzate per la Svizzera italiana.',
    en: 'Professional gardening services, green maintenance, garden design and green spaces in Ticino. Free quotes and customized solutions for Italian Switzerland.',
    fr: 'Services de jardinage professionnels, entretien des espaces verts, conception de jardins au Tessin. Devis gratuits et solutions personnalisées pour la Suisse italienne.',
    de: 'Professionelle Gartenbauleistungen, Grünflächenpflege, Gartengestaltung im Tessin. Kostenlose Angebote und maßgeschneiderte Lösungen für die italienische Schweiz.'
  };
  
  const keywords = {
    it: 'giardinaggio, manutenzione verde, progettazione giardini, potatura, prato, irrigazione, Ticino, Svizzera, Biasca, Bellinzona, Lugano, Locarno',
    en: 'gardening, green maintenance, garden design, pruning, lawn, irrigation, Ticino, Switzerland, Biasca, Bellinzona, Lugano, Locarno',
    fr: 'jardinage, entretien des espaces verts, conception de jardins, taille, pelouse, irrigation, Tessin, Suisse, Biasca, Bellinzone, Lugano, Locarno',
    de: 'Gartenbau, Grünflächenpflege, Gartengestaltung, Beschneidung, Rasen, Bewässerung, Tessin, Schweiz, Biasca, Bellinzona, Lugano, Locarno'
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
      siteName: 'M.T.R.E. Giardinaggio',
      title: titles[locale as keyof typeof titles] || titles.it,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
      images: [
        {
          url: `${baseUrl}/images/hero/home-new.jpg`,
          width: 1200,
          height: 630,
          alt: 'M.T.R.E. Giardinaggio',
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
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Rome">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
