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
    
    // Ottieni tutti i clienti
    const { data, error } = await supabase
      .from('clienti')
      .select('*')
      .order('cognome', { ascending: true });
    
    if (error) {
      console.error('Errore durante il recupero dei clienti:', error);
      return NextResponse.json(
        { message: 'Errore durante il recupero dei clienti', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore durante il recupero dei clienti:', error);
    return NextResponse.json(
      { message: 'Errore durante il recupero dei clienti', error: error.message },
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
    
    // Ottieni i dati del cliente dal corpo della richiesta
    const clienteData = await request.json();
    
    // Validazione di base
    if (!clienteData.nome || !clienteData.cognome) {
      return NextResponse.json(
        { message: 'Nome e cognome sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Crea il cliente
    const { data: cliente, error } = await supabase
      .from('clienti')
      .insert([clienteData])
      .select()
      .single();
    
    if (error) {
      console.error('Errore durante la creazione del cliente:', error);
      return NextResponse.json(
        { message: 'Errore durante la creazione del cliente', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(cliente, { status: 201 });
  } catch (error: any) {
    console.error('Errore durante la creazione del cliente:', error);
    return NextResponse.json(
      { message: 'Errore durante la creazione del cliente', error: error.message },
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