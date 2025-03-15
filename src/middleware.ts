import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/navigation';

// Crea il middleware per la gestione delle lingue
export default createMiddleware({
  // Una lista di tutte le lingue supportate
  locales,
  
  // Se la lingua richiesta non è supportata, viene utilizzata quella predefinita
  defaultLocale,
  
  // Se la lingua predefinita non è presente nell'URL, viene reindirizzato
  localePrefix: 'as-needed',
  
  // Assicura che il locale venga passato correttamente a tutti i componenti
  localeDetection: true
});

// Configura quali percorsi devono essere gestiti dal middleware
export const config = {
  // Intercetta tutte le richieste che iniziano con /, eccetto quelle che iniziano con
  // /api, /_next, /_vercel, /favicon.ico, /robots.txt, ecc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 