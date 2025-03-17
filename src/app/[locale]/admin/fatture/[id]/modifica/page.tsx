import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ModificaFatturaForm from '@/components/ModificaFatturaForm';

export default async function ModificaFatturaPage({
  params
}: {
  params: Promise<{ id: string, locale: string }>
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { id, locale } = await params;
  
  // Verifica l'autenticazione tramite cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('sb-pehacdouexhebskdbpxp-auth-token');
  const isAuthenticated = !!authCookie?.value;
  
  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login`);
  }
  
  const supabase = await createClient();
  
  // Recupera la fattura con i dettagli del cliente
  const { data: fattura, error } = await supabase
    .from('fatture')
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
    console.error('Errore nel recupero della fattura:', error);
    redirect(`/${locale}/admin/fatture`);
  }
  
  // Recupera i dettagli della fattura
  const { data: dettagli, error: dettagliError } = await supabase
    .from('dettagli_fattura')
    .select('*')
    .eq('fattura_id', id)
    .order('id');
    
  if (dettagliError) {
    console.error('Errore nel recupero dei dettagli della fattura:', dettagliError);
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
        <h1 className="text-2xl font-bold text-gray-900">Modifica Fattura #{fattura.numero}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aggiorna i dettagli della fattura
        </p>
      </div>
      
      <ModificaFatturaForm 
        fattura={fattura} 
        dettagli={dettagli || []} 
        clienti={clienti || []} 
        servizi={servizi || []} 
        locale={locale}
      />
    </div>
  );
} 