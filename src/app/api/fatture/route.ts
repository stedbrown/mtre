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
    
    // Ottieni tutte le fatture
    const { data, error } = await supabase
      .from('fatture')
      .select(`
        *,
        cliente:clienti(id, nome, cognome)
      `)
      .order('data', { ascending: false });
    
    if (error) {
      console.error('Errore durante il recupero delle fatture:', error);
      return NextResponse.json(
        { message: 'Errore durante il recupero delle fatture', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore durante il recupero delle fatture:', error);
    return NextResponse.json(
      { message: 'Errore durante il recupero delle fatture', error: error.message },
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
    
    // Ottieni i dati della fattura dal corpo della richiesta
    const { dettagli, ...fatturaData } = await request.json();
    
    // Validazione di base
    if (!fatturaData.cliente_id || !fatturaData.data || !fatturaData.numero) {
      return NextResponse.json(
        { message: 'Cliente, data e numero sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Aggiustiamo i campi per adattarli alla struttura del database
    const fatturaDaInserire = {
      ...fatturaData,
      data_emissione: fatturaData.data, // Mappiamo il campo 'data' a 'data_emissione'
      data_scadenza: fatturaData.scadenza, // Mappiamo il campo 'scadenza' a 'data_scadenza'
      stato: fatturaData.stato
    };
    
    // Rimuoviamo i campi che abbiamo già mappato
    delete fatturaDaInserire.data;
    delete fatturaDaInserire.scadenza;
    
    console.log('Dati fattura da inserire:', fatturaDaInserire);
    
    // Inizia una transazione
    const { data: fattura, error: fatturaError } = await supabase
      .from('fatture')
      .insert([fatturaDaInserire])
      .select()
      .single();
    
    if (fatturaError) {
      console.error('Errore durante la creazione della fattura:', fatturaError);
      return NextResponse.json(
        { message: 'Errore durante la creazione della fattura', error: fatturaError.message },
        { status: 500 }
      );
    }
    
    // Aggiungi i dettagli della fattura
    if (dettagli && dettagli.length > 0) {
      const dettagliConFattura = dettagli.map((dettaglio: any) => {
        // Gestione servizio personalizzato
        if (dettaglio.servizio_id === 'custom') {
          return {
            fattura_id: fattura.id,
            servizio_id: null, // Nessun servizio collegato, è personalizzato
            descrizione: dettaglio.descrizione,
            quantita: dettaglio.quantita,
            prezzo_unitario: dettaglio.prezzo_unitario,
            importo: dettaglio.importo
          };
        } else {
          return {
            fattura_id: fattura.id,
            servizio_id: dettaglio.servizio_id,
            descrizione: dettaglio.descrizione,
            quantita: dettaglio.quantita,
            prezzo_unitario: dettaglio.prezzo_unitario,
            importo: dettaglio.importo
          };
        }
      });
      
      console.log('Dettagli fattura da inserire:', dettagliConFattura);
      
      const { error: dettagliError } = await supabase
        .from('dettagli_fattura')
        .insert(dettagliConFattura);
      
      if (dettagliError) {
        console.error('Errore durante l\'aggiunta dei dettagli della fattura:', dettagliError);
        // Rollback manuale (elimina la fattura)
        await supabase.from('fatture').delete().eq('id', fattura.id);
        
        return NextResponse.json(
          { message: 'Errore durante l\'aggiunta dei dettagli della fattura', error: dettagliError.message },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(fattura, { status: 201 });
  } catch (error: any) {
    console.error('Errore durante la creazione della fattura:', error);
    return NextResponse.json(
      { message: 'Errore durante la creazione della fattura', error: error.message },
      { status: 500 }
    );
  }
} 