import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().then(cookieStore => cookieStore.get(name)?.value);
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
    
    // Verifica autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    // Ottieni i clienti
    const { data, error } = await supabase
      .from('clienti')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Errore nel recupero dei clienti:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ clienti: data });
  } catch (error: any) {
    console.error('Errore nell\'API clienti:', error);
    return NextResponse.json(
      { error: error.message || 'Si è verificato un errore' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().then(cookieStore => cookieStore.get(name)?.value);
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
    
    // Verifica autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Inserisci il nuovo cliente
    const { data: nuovoCliente, error } = await supabase
      .from('clienti')
      .insert([
        {
          nome: data.nome,
          cognome: data.cognome,
          email: data.email,
          telefono: data.telefono,
          indirizzo: data.indirizzo,
          citta: data.citta,
          cap: data.cap,
          provincia: data.provincia,
          paese: data.paese,
          partita_iva: data.partita_iva,
          codice_fiscale: data.codice_fiscale,
          note: data.note
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('Errore nella creazione del cliente:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      cliente: nuovoCliente
    });
    
  } catch (error: any) {
    console.error('Errore nell\'API clienti (POST):', error);
    return NextResponse.json(
      { error: error.message || 'Si è verificato un errore' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().then(cookieStore => cookieStore.get(name)?.value);
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
    
    // Verifica autenticazione
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const clienteId = data.id;
    
    if (!clienteId) {
      return NextResponse.json(
        { error: 'ID cliente mancante' },
        { status: 400 }
      );
    }
    
    // Aggiorna il cliente
    const { data: clienteAggiornato, error } = await supabase
      .from('clienti')
      .update({
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
        telefono: data.telefono,
        indirizzo: data.indirizzo,
        citta: data.citta,
        cap: data.cap,
        provincia: data.provincia,
        paese: data.paese,
        partita_iva: data.partita_iva,
        codice_fiscale: data.codice_fiscale,
        note: data.note
      })
      .eq('id', clienteId)
      .select()
      .single();
      
    if (error) {
      console.error('Errore nell\'aggiornamento del cliente:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      cliente: clienteAggiornato
    });
    
  } catch (error: any) {
    console.error('Errore nell\'API clienti (PUT):', error);
    return NextResponse.json(
      { error: error.message || 'Si è verificato un errore' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    
    // Ottieni l'ID del cliente dalla URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID del cliente non fornito' },
        { status: 400 }
      );
    }
    
    // Verifica se il cliente ha fatture o preventivi associati
    const { data: fatture } = await supabase
      .from('fatture')
      .select('id')
      .eq('cliente_id', id)
      .limit(1);
      
    if (fatture && fatture.length > 0) {
      return NextResponse.json(
        { message: 'Impossibile eliminare il cliente: ci sono fatture associate' },
        { status: 400 }
      );
    }
    
    const { data: preventivi } = await supabase
      .from('preventivi')
      .select('id')
      .eq('cliente_id', id)
      .limit(1);
      
    if (preventivi && preventivi.length > 0) {
      return NextResponse.json(
        { message: 'Impossibile eliminare il cliente: ci sono preventivi associati' },
        { status: 400 }
      );
    }
    
    // Elimina il cliente
    const { error } = await supabase
      .from('clienti')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Errore durante l\'eliminazione del cliente:', error);
      return NextResponse.json(
        { message: 'Errore durante l\'eliminazione del cliente', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Cliente eliminato con successo' });
  } catch (error: any) {
    console.error('Errore durante l\'eliminazione del cliente:', error);
    return NextResponse.json(
      { message: 'Errore durante l\'eliminazione del cliente', error: error.message },
      { status: 500 }
    );
  }
} 