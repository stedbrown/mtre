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
        {/* Precarica solo l'immagine hero principale con alta priorità */}
        <link rel="preload" as="image" href="/images/hero/home-new.avif" fetchPriority="high" />
        
        {/* Precarica i font critici */}
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
        
        {/* Critical CSS inline - solo gli stili assolutamente necessari */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--foreground:#171717;--background:#fff;}
          body{margin:0;font-family:Arial,sans-serif;background:var(--background);color:var(--foreground);opacity:1}
          .hero-section{position:relative;color:#fff;background-color:#166534;height:60vh;min-height:400px;overflow:hidden}
          .container{width:100%;max-width:1280px;margin:0 auto;padding:0 1rem}
          .hero-content{position:relative;z-index:10;padding-top:5rem}
          .flex{display:flex}.items-center{align-items:center}
          .text-white{color:#fff}.text-green-800{color:#166534}
          .bg-green-700{background-color:#15803d}.bg-green-600{background-color:#16a34a}
          a{text-decoration:none;color:inherit}
          @media (prefers-color-scheme:dark){:root{--foreground:#ededed;--background:#0a0a0a}}
        `}} />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
} 