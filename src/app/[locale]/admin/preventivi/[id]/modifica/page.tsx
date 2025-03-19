import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ModificaPreventivoForm from '@/components/ModificaPreventivoForm';

export default async function ModificaPreventivoPage({
  params
}: {
  params: Promise<{ id: string, locale: string }>
}) {
  // In Next.js 15 dobbiamo awaittare params anche se non è una Promise
  const { id, locale } = await params;
  
  // Verifica l'autenticazione tramite cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }
  
  const supabase = await createClient();
  
  // Recupera il preventivo con i dettagli del cliente
  const { data: preventivo, error } = await supabase
    .from('preventivi')
    .select(`
      *,
      cliente:cliente_id (
        id,
        nome,
        cognome,
        email,
        telefono,
        indirizzo
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Errore nel recupero del preventivo:', error);
    redirect(`/${locale}/admin/preventivi`);
  }
  
  // Recupera i dettagli del preventivo
  const { data: dettagli, error: dettagliError } = await supabase
    .from('dettagli_preventivo')
    .select('*')
    .eq('preventivo_id', id)
    .order('id');
    
  if (dettagliError) {
    console.error('Errore nel recupero dei dettagli del preventivo:', dettagliError);
  }
  
  // Recupera tutti i clienti per il dropdown
  const { data: clienti, error: clientiError } = await supabase
    .from('clienti')
    .select('id, nome, cognome')
    .order('nome');
    
  if (clientiError) {
    console.error('Errore nel recupero dei clienti:', clientiError);
  }
  
  // Recupera tutti i servizi per il dropdown nei dettagli
  const { data: servizi, error: serviziError } = await supabase
    .from('servizi')
    .select('id, nome, descrizione, prezzo')
    .order('nome');
    
  if (serviziError) {
    console.error('Errore nel recupero dei servizi:', serviziError);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifica Preventivo #{preventivo.numero}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aggiorna i dettagli del preventivo
        </p>
      </div>
      
      <ModificaPreventivoForm 
        preventivo={preventivo} 
        dettagli={dettagli || []} 
        clienti={clienti || []} 
        servizi={servizi || []} 
        locale={locale}
      />
    </div>
  );
} 