import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/navigation';

export default function AdminFallbackPage() {
  // Questo reindirizza automaticamente alla dashboard con il locale di default
  redirect(`/${defaultLocale}/admin/dashboard`);
} 