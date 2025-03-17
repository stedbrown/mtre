import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Non possiamo impostare cookie qui
          },
          remove(name: string, options: any) {
            // Non possiamo rimuovere cookie qui
          },
        },
      }
    );
    
    // Verifica l'autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    // Ottieni tutti i preventivi
    const { data, error } = await supabase
      .from('preventivi')
      .select(`
        *,
        cliente:clienti(id, nome, cognome)
      `)
      .order('data_emissione', { ascending: false });
    
    if (error) {
      console.error('Errore durante il recupero dei preventivi:', error);
      return NextResponse.json(
        { message: 'Errore durante il recupero dei preventivi', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore durante il recupero dei preventivi:', error);
    return NextResponse.json(
      { message: 'Errore durante il recupero dei preventivi', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Non possiamo impostare cookie qui
          },
          remove(name: string, options: any) {
            // Non possiamo rimuovere cookie qui
          },
        },
      }
    );
    
    // Verifica l'autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    // Ottieni i dati del preventivo dal corpo della richiesta
    const { dettagli, ...preventivoData } = await request.json();
    
    // Validazione di base
    if (!preventivoData.cliente_id || !preventivoData.data_emissione || !preventivoData.numero) {
      return NextResponse.json(
        { message: 'Cliente, data e numero sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Prepara i dati per l'inserimento nel database
    const dataToInsert = {
      cliente_id: preventivoData.cliente_id,
      numero: preventivoData.numero,
      data_emissione: preventivoData.data_emissione,
      data_scadenza: preventivoData.data_scadenza,
      importo_totale: preventivoData.importo_totale,
      stato: preventivoData.stato,
      note: preventivoData.note,
      valuta: preventivoData.valuta
    };
    
    // Crea il preventivo
    const { data: preventivo, error: preventivoError } = await supabase
      .from('preventivi')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (preventivoError) {
      console.error('Errore durante la creazione del preventivo:', preventivoError);
      return NextResponse.json(
        { message: 'Errore durante la creazione del preventivo', error: preventivoError.message },
        { status: 500 }
      );
    }
    
    // Aggiungi i dettagli del preventivo
    if (dettagli && dettagli.length > 0) {
      // Prepara i dettagli per l'inserimento nel database
      const dettagliConPreventivo = dettagli.map((dettaglio: any) => {
        // Assicurati che servizio_id sia null per i servizi personalizzati
        return {
          preventivo_id: preventivo.id,
          servizio_id: dettaglio.servizio_id === 'custom' ? null : dettaglio.servizio_id,
          descrizione: dettaglio.descrizione,
          quantita: dettaglio.quantita,
          prezzo_unitario: dettaglio.prezzo_unitario,
          importo: dettaglio.totale
        };
      });
      
      const { error: dettagliError } = await supabase
        .from('dettagli_preventivo')
        .insert(dettagliConPreventivo);
      
      if (dettagliError) {
        console.error('Errore durante l\'aggiunta dei dettagli del preventivo:', dettagliError);
        // Rollback manuale (elimina il preventivo)
        await supabase.from('preventivi').delete().eq('id', preventivo.id);
        
        return NextResponse.json(
          { message: 'Errore durante l\'aggiunta dei dettagli del preventivo', error: dettagliError.message },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(preventivo, { status: 201 });
  } catch (error: any) {
    console.error('Errore durante la creazione del preventivo:', error);
    return NextResponse.json(
      { message: 'Errore durante la creazione del preventivo', error: error.message },
      { status: 500 }
    );
  }
} 