import { Montserrat } from 'next/font/google';
import AdminLayoutClient from '@/components/AdminLayoutClient';

const montserrat = Montserrat({ subsets: ['latin'] });

// In Next.js 15, params è una Promise che deve essere awaited
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      <AdminLayoutClient locale={locale}>{children}</AdminLayoutClient>
    </div>
  );
} 