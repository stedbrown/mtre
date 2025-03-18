import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/navigation';

export default function LoginFallbackPage() {
  // Questo reindirizza automaticamente alla pagina di login con il locale di default
  redirect(`/${defaultLocale}/admin/login`);
} 