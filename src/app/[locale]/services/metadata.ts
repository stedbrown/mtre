import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Genera i metadata specifici per la pagina dei servizi
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'services' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      images: [
        {
          url: `${baseUrl}/images/hero/services-new.avif`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
} 