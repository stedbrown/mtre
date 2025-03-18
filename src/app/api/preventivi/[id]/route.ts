import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
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
    
    const body = await request.json();
    
    // Aggiorna il preventivo
    const { error } = await supabase
      .from('preventivi')
      .update({
        numero: body.numero,
        data: body.data,
        data_scadenza: body.data_scadenza,
        cliente_id: body.cliente_id,
        importo_totale: body.importo_totale,
        stato: body.stato,
        note: body.note,
        valuta: body.valuta,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error('Errore nell\'aggiornamento del preventivo:', error);
      return NextResponse.json({ error: 'Impossibile aggiornare il preventivo' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Preventivo aggiornato con successo' });
  } catch (error) {
    console.error('Errore nella gestione della richiesta:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 