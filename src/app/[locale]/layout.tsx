import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Configurazione del font
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

// Metadata dinamiche con traduzioni
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({locale, namespace: 'metadata'});
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mtre.it'), 
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mtre.it',
      siteName: t('siteName'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('ogImageAlt'),
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  } as Metadata;
}

// Configurazione delle pagine localizzate
export function generateStaticParams() {
  return [{ locale: 'it' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={openSans.variable}>
      <head>
        {/* Precaricamento del font critico */}
        <link
          rel="preload"
          href={openSans.style.fontFamily.split(',')[0].replace(/["']/g, '')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Precaricamento immagine hero */}
        <link
          rel="preload"
          href="/images/hero.jpg"
          as="image"
          fetchPriority="high"
        />
        
        {/* Meta tag per prestazioni */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#15803d" />
        
        {/* Inserisco CSS critico inline */}
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-placeholder-loading {
            background-color: #f0f9ff;
            background-image: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 50%, #e0f2fe 100%);
            animation: placeholderShimmer 2s infinite linear;
          }
          @keyframes placeholderShimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .hero-section {
            min-height: 75vh;
            background-position: center;
            background-size: cover;
            position: relative;
          }
          .hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
          }
        `}} />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
