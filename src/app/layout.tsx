import './[locale]/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  metadataBase: new URL('https://mtre.ch'),
  title: {
    default: 'M.T.R.E. | Giardiniere Professionista in Ticino',
    template: '%s | M.T.R.E. Giardiniere'
  },
  description: 'Servizi professionali di giardinaggio in Ticino. Manutenzione, progettazione, potatura e cura del verde per privati e aziende.',
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon-16x16.png',
    apple: '/images/apple-touch-icon.png',
  },
  themeColor: '#166534',
  openGraph: {
    title: 'M.T.R.E. | Giardinaggio Professionale in Ticino',
    description: 'Servizi di giardinaggio professionale, manutenzione e progettazione giardini in tutto il Ticino.',
    url: 'https://mtre.ch',
    siteName: 'M.T.R.E. Giardinaggio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'M.T.R.E. Giardinaggio Professionale',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* Precarica l'immagine hero - con attributi ottimizzati */}
        <link rel="preload" as="image" href="/images/hero/home-new.avif" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/hero/services-new.avif" fetchPriority="low" />
        <link rel="preload" as="image" href="/images/hero/gallery-new.avif" fetchPriority="low" />
        <link rel="preload" as="image" href="/images/hero/contact-new.avif" fetchPriority="low" />
        
        {/* Precarica i font principali */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Meta tag per viewport e performance */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://mtre.ch" />
        <link rel="preconnect" href="https://mtre.ch" />
        <link rel="preconnect" href="https://vercel.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {opacity: 1; transition: opacity 0.5s ease-in-out;}
          .hero-placeholder {background-color: #166534; height: 60vh; min-height: 400px;}
          
          /* Stili critici per il rendering iniziale */
          .container {width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem;}
          @media (min-width: 640px) {.container {max-width: 640px;}}
          @media (min-width: 768px) {.container {max-width: 768px;}}
          @media (min-width: 1024px) {.container {max-width: 1024px;}}
          @media (min-width: 1280px) {.container {max-width: 1280px;}}
          h1, h2, h3 {margin: 0; font-weight: bold;}
          .relative {position: relative;}
          .text-white {color: white;}
          .text-green-800 {color: #166534;}
          .bg-green-700 {background-color: #15803d;}
          .bg-green-600 {background-color: #16a34a;}
        `}} />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
} 