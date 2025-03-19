import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/navigation';

// Questa pagina serve per reindirizzare automaticamente alla lingua predefinita
// quando un utente visita la radice del sito
export default function RootPage() {
  // Reindirizzamento lato server alla versione con locale predefinita
  redirect(`/${defaultLocale}`);
} 