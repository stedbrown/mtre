import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './navigation';

export default getRequestConfig(async ({ locale }) => {
  // Usa la locale predefinita se quella corrente è undefined
  const safeLocale = locale || defaultLocale;
  
  // Carica i messaggi in modo più robusto
  let messages;
  try {
    // Utilizziamo dynamic import per caricare i messaggi
    messages = (await import(`../messages/${safeLocale}/index`)).default;
  } catch {
    // Fallback ai messaggi in italiano se non è possibile caricare i messaggi per la locale corrente
    messages = (await import('../messages/it/index')).default;
  }
  
  return {
    locale: safeLocale,
    messages,
    timeZone: 'Europe/Rome',
    // Aggiungiamo la configurazione per i formati di data e numeri
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'EUR'
        }
      }
    }
  };
});

export async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}`)).default;
  } catch {
    return (await import(`@/messages/it`)).default;
  }
} 