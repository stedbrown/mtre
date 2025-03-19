import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

// Marchiamo questo componente come dinamico per evitare conflitti con route.ts
export const dynamic = 'force-dynamic';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      {children}
    </div>
  );
} 