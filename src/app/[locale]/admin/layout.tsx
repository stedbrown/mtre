import { Montserrat } from 'next/font/google';
import AdminLayoutClient from '@/components/AdminLayoutClient';

const montserrat = Montserrat({ subsets: ['latin'] });

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Next.js 15 richiede che params sia await anche se non è una Promise
  const { locale } = await params;
  
  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      <AdminLayoutClient locale={locale}>{children}</AdminLayoutClient>
    </div>
  );
}