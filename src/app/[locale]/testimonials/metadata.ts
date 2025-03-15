import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Genera i metadata specifici per la pagina delle testimonianze
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'testimonials' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  
  return {
    title: t('title'),
    description: 'Scopri cosa dicono i nostri clienti sui servizi di giardinaggio M.T.R.E.',
    openGraph: {
      images: [
        {
          url: `${baseUrl}/images/hero/testimonials-new.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
} 