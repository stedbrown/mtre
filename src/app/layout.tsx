import './globals.css';
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
        {/* Precarica l'immagine hero */}
        <link rel="preload" as="image" href="/images/hero/home-new.avif" />
        <link rel="preload" as="image" href="/images/hero/services-new.avif" />
        <link rel="preload" as="image" href="/images/hero/gallery-new.avif" />
        <link rel="preload" as="image" href="/images/hero/contact-new.avif" />
        
        {/* Precarica i font principali */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Meta tag per viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
} 