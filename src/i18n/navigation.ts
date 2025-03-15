import { createNavigation } from 'next-intl/navigation';

// Definizione delle lingue supportate
export const locales = ['it', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

// Lingua predefinita
export const defaultLocale: Locale = 'it';

// Creazione delle funzioni di navigazione
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale
}); 