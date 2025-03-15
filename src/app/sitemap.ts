import { MetadataRoute } from 'next';
import { locales } from '@/i18n/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre-giardinaggio.it';
  
  // Definisci le pagine del sito
  const pages = [
    '',
    '/services',
    '/gallery',
    '/testimonials',
    '/contact',
  ];
  
  // Crea un array di URL per tutte le combinazioni di pagine e lingue
  const urls = locales.flatMap(locale => 
    pages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly' as 'weekly' | 'monthly',
      priority: page === '' ? 1 : 0.8,
    }))
  );
  
  return urls;
} 