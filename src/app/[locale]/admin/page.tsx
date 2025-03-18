import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/navigation';

export default function AdminPage() {
  // Reindirizza direttamente alla dashboard
  redirect(`/${defaultLocale}/admin/dashboard`);
} 