import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Genera i metadata specifici per la home page
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  
  return {
    title: `${t('hero.title')} - ${t('hero.subtitle')}`,
    description: t('about.description'),
    openGraph: {
      images: [
        {
          url: `${baseUrl}/images/hero/home-new.avif`,
          width: 1200,
          height: 630,
          alt: t('hero.title'),
        },
      ],
    },
  };
} 