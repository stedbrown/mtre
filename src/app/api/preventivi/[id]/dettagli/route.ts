import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Elimina tutti i dettagli di un preventivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cookieStore = await cookies();
    const supabase = await createClient();
    
    // Controlla l'autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    // Elimina tutti i dettagli associati al preventivo
    const { error } = await supabase
      .from('dettagli_preventivo')
      .delete()
      .eq('preventivo_id', id);
      
    if (error) {
      console.error('Errore nell\'eliminazione dei dettagli del preventivo:', error);
      return NextResponse.json({ error: 'Impossibile eliminare i dettagli del preventivo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Dettagli preventivo eliminati con successo' });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// Crea nuovi dettagli per un preventivo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cookieStore = await cookies();
    const supabase = await createClient();
    
    // Controlla l'autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    const dettagli = await request.json();
    
    if (!Array.isArray(dettagli) || dettagli.length === 0) {
      return NextResponse.json({ error: 'I dettagli devono essere un array non vuoto' }, { status: 400 });
    }
    
    // Verifica che tutti gli elementi abbiano il preventivo_id corretto
    const validDettagli = dettagli.map(dettaglio => ({
      ...dettaglio,
      preventivo_id: id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Inserisci i nuovi dettagli
    const { error } = await supabase
      .from('dettagli_preventivo')
      .insert(validDettagli);
      
    if (error) {
      console.error('Errore nell\'inserimento dei dettagli del preventivo:', error);
      return NextResponse.json({ error: 'Impossibile inserire i dettagli del preventivo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Dettagli preventivo inseriti con successo' });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 