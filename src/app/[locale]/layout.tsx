import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/navigation";
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
    it: 'Servizi di giardinaggio professionali in Ticino. Manutenzione, progettazione, potatura alberi e cura del verde per privati e aziende. Preventivi gratuiti!',
    en: 'Professional gardening services in Ticino. Maintenance, design, tree pruning and green care for private clients and businesses. Free quotes!',
    fr: 'Services professionnels de jardinage au Tessin. Entretien, conception, élagage d\'arbres et soins des espaces verts pour particuliers et entreprises. Devis gratuits!',
    de: 'Professionelle Gartenservice im Tessin. Pflege, Gestaltung, Baumpflege und Grünpflege für Privat- und Geschäftskunden. Kostenlose Angebote!'
  };
  
  const keywords = {
    it: 'giardiniere, giardinaggio, Ticino, cura del verde, potatura, manutenzione giardini, progettazione giardini, preventivo gratuito',
    en: 'gardener, gardening, Ticino, green care, pruning, garden maintenance, garden design, free quote',
    fr: 'jardinier, jardinage, Tessin, entretien des espaces verts, élagage, entretien de jardins, conception de jardins, devis gratuit',
    de: 'Gärtner, Gartenarbeit, Tessin, Grünpflege, Beschneidung, Gartenpflege, Gartengestaltung, kostenloses Angebot'
  };
  
  return {
    metadataBase: new URL(baseUrl),
    title: titles[locale as keyof typeof titles] || titles.it,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
    keywords: keywords[locale as keyof typeof keywords] || keywords.it,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.it,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
      url: baseUrl,
      siteName: 'M.T.R.E. Giardinaggio',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `/images/og-image-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: 'M.T.R.E. Giardinaggio'
        }
      ]
    },
    alternates: {
      canonical: `${baseUrl}/${locale === 'it' ? '' : locale}`,
      languages: {
        'it': `${baseUrl}/`,
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`
      }
    },
    robots: {
      index: true,
      follow: true
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
  params: { locale: string };
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const locale = params.locale;
  
  // Recupera i messaggi per l'internazionalizzazione
  const messages = await getMessages();
  
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main>
            {children}
          </main>
          
          {/* Google Analytics verrà caricato come script globale */}
          <script 
            async 
            src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-YOUR-ID');
              `,
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
