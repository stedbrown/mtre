import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Elimina tutti i dettagli di una fattura
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient();
    
    // Controlla l'autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    // Elimina tutti i dettagli associati alla fattura
    const { error } = await supabase
      .from('dettagli_fattura')
      .delete()
      .eq('fattura_id', id);
      
    if (error) {
      console.error('Errore nell\'eliminazione dei dettagli della fattura:', error);
      return NextResponse.json({ error: 'Impossibile eliminare i dettagli della fattura' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Dettagli fattura eliminati con successo' });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// Crea nuovi dettagli per una fattura
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    // Verifica che tutti gli elementi abbiano il fattura_id corretto
    const validDettagli = dettagli.map(dettaglio => ({
      ...dettaglio,
      fattura_id: id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Inserisci i nuovi dettagli
    const { error } = await supabase
      .from('dettagli_fattura')
      .insert(validDettagli);
      
    if (error) {
      console.error('Errore nell\'inserimento dei dettagli della fattura:', error);
      return NextResponse.json({ error: 'Impossibile inserire i dettagli della fattura' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Dettagli fattura inseriti con successo' });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 