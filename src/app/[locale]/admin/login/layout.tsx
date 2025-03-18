// Marchiamo questo componente come dinamico per evitare conflitti con route.ts
export const dynamic = 'force-dynamic';

export default async function LoginLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  // Layout semplificato che permette al route handler di funzionare correttamente
  return <>{children}</>;
} 