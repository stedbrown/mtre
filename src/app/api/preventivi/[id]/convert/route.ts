import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // 1. Ottieni i dati del preventivo
    const { data: preventivo, error: preventivoError } = await supabase
      .from('preventivi')
      .select(`
        *,
        dettagli:dettagli_preventivo(
          id,
          servizio_id,
          descrizione,
          quantita,
          prezzo_unitario,
          importo
        )
      `)
      .eq('id', id)
      .single();
    
    if (preventivoError || !preventivo) {
      console.error('Errore nel recupero del preventivo:', preventivoError);
      return NextResponse.json(
        { error: 'Preventivo non trovato' },
        { status: 404 }
      );
    }
    
    // 2. Crea una nuova fattura basata sul preventivo
    const { data: fattura, error: fatturaError } = await supabase
      .from('fatture')
      .insert({
        cliente_id: preventivo.cliente_id,
        data_emissione: new Date().toISOString().split('T')[0],
        data_scadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stato: 'non_pagata',
        importo_totale: preventivo.importo_totale,
        note: preventivo.note,
        valuta: preventivo.valuta,
        preventivo_id: id
      })
      .select()
      .single();
    
    if (fatturaError || !fattura) {
      console.error('Errore nella creazione della fattura:', fatturaError);
      return NextResponse.json(
        { error: 'Impossibile creare la fattura' },
        { status: 500 }
      );
    }
    
    // 3. Crea i dettagli della fattura basati sui dettagli del preventivo
    const dettagliFattura = preventivo.dettagli.map((dettaglio: any) => ({
      fattura_id: fattura.id,
      servizio_id: dettaglio.servizio_id === 'custom' ? null : dettaglio.servizio_id,
      descrizione: dettaglio.descrizione,
      quantita: dettaglio.quantita,
      prezzo_unitario: dettaglio.prezzo_unitario,
      importo: dettaglio.importo
    }));
    
    const { error: dettagliError } = await supabase
      .from('dettagli_fattura')
      .insert(dettagliFattura);
    
    if (dettagliError) {
      console.error('Errore nella creazione dei dettagli della fattura:', dettagliError);
      
      // Rollback: elimina la fattura creata
      await supabase.from('fatture').delete().eq('id', fattura.id);
      
      return NextResponse.json(
        { error: 'Impossibile creare i dettagli della fattura' },
        { status: 500 }
      );
    }
    
    // 4. Aggiorna lo stato del preventivo a "convertito" o "approvato"
    const { error: updateError } = await supabase
      .from('preventivi')
      .update({ stato: 'approvato' })
      .eq('id', id);
    
    if (updateError) {
      console.error('Errore nell\'aggiornamento dello stato del preventivo:', updateError);
      // Non facciamo rollback qui perché la fattura è stata creata con successo
    }
    
    // 5. Restituisci la fattura creata
    return NextResponse.json({
      success: true,
      message: 'Preventivo convertito in fattura con successo',
      fattura: {
        id: fattura.id,
        numero: fattura.numero
      }
    });
    
  } catch (error) {
    console.error('Errore durante la conversione del preventivo in fattura:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la conversione' },
      { status: 500 }
    );
  }
} 