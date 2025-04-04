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
        {/* Preload dell'immagine principale con priorità alta */}
        <link 
          rel="preload" 
          as="image" 
          href="/images/hero/home-new.avif" 
          fetchPriority="high" 
        />
        
        {/* Inserimento inline dell'immagine hero come base64 per instant display */}
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-placeholder {
            background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAXACQDAREAAhEBAxEB/8QAGwAAAgEFAAAAAAAAAAAAAAAAAAYHCAkCAwX/xAAxEAABAwMDAgUBBwUAAAAAAAABAgMEBQYRACExBxIIE0FRYRQiI0JxgZGhFSQyY+H/xAAXAQEBAQEAAAAAAAAAAAAAAAAACwAK/8QAKBEAAQIEAwcFAAAAAAAAAAAAAQACAwQFESEUFTEGEjJBUWGBkaHR8f/aAAwDAQACEQMRAD8AoEpWCa08k2PBIWHoTu2yAv6Vx1jEYlxEqUgdnYSSclPoE5J5xiP3NnA0H+5w6UeFcnvR3KmLqahoWxR3q1XFUOiwVuxqvFRGkTYsVKiAYiZLyEuSUggg9qADgkLAONL1LarZ2oLW7VcAKWlvGRWNnDR2d4XTH2PqwJQSU7XhA4YG+iQTyoiLqXEpSUhLbi0nBIPJOw39NR4Tw4WPytljXNJa7DxZEPSanNSpmmKJJiVOjzFkqMeZGffioWR3HsQsJQrIOdxuPUYjYMRsJ4ewG6cdCpurMkpzZ+YksAHEuAbcWxAv5V9ot21QF1Rl1OFZdCDgVAjLa6S8g/iGSnACgfxoB2B5IxsR0b8y5pwnrPTHb2M37q+qLbVOdoLKaXIuKOW+lTjzyUw0rVnzUo7VKAQCvB25BOMah5naMmkJDLbPTGj4cXfp3r9KxejbIS85PQ9rYMJksZeNEJAs0fEX8NW8NP3qgqtyJMnuolqU+p+K2UJLCnFKJIBJJIIUR94Z3IPxpE1c+dqHCTzOm65d75kNTHssnT+wbQwzDMXG+OKy+i5FaeSUJU4AEqIUhIJI7gnlPcOR7nBzq+XmGTDBEbct7/a5oYWuF0zqXYt+NE7IXVsVGQ2JKWKeh0LlAOokvnuAZXlPmJQsFQBACSFDtOYGbq+Xgw3PLc1TRuN0GlrqrTbMSVajgzbS86KyRumcYAafnmpzCQpLwkknKQgLPbntAA+5x6aar1d1ImjLZYnvotYtw3MwZQg1RKNk5JUXXW9uw4O6ARnff07tdmrSrNnR7+qlGQXmZFPoLAcU6Q13SqwErbKAckKQkLKuMErJwBpc1U2e5uWt6WRmSXmQw8Lr6IpCVpV9S2AlwpUk532yMjGcHG58a61SZ0yB0Gt14p1kU4kX3CuCqFDaQtPnD6RJQkpHcMnBxnYjPrjURHqcaJ+oW6arTVAp4FpZvnH4/i//9k=');
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}} />
        
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