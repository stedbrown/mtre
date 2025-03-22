import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import ImpostazioniClient from './ImpostazioniClient';

export default async function ImpostazioniPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { locale } = await params;
  
  // Verifica l'autenticazione
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Accesso negato</h1>
        <p className="text-gray-600">Devi effettuare l'accesso per visualizzare questa pagina.</p>
        <a href={`/${locale}/admin/login`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Vai alla pagina di login
        </a>
      </div>
    );
  }
  
  // Recupera le informazioni dell'azienda
  const { data: aziendaInfo } = await supabase
    .from('azienda_info')
    .select('*')
    .limit(1)
    .single();
  
  return <ImpostazioniClient locale={locale} aziendaInfo={aziendaInfo} user={user} />;
} 