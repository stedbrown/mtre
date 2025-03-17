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
    
    // Ottieni tutti i servizi
    const { data, error } = await supabase
      .from('servizi')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('Errore durante il recupero dei servizi:', error);
      return NextResponse.json(
        { message: 'Errore durante il recupero dei servizi', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Errore durante il recupero dei servizi:', error);
    return NextResponse.json(
      { message: 'Errore durante il recupero dei servizi', error: error.message },
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
    
    // Ottieni i dati del servizio dal corpo della richiesta
    const servizioData = await request.json();
    
    // Validazione di base
    if (!servizioData.nome || !servizioData.prezzo) {
      return NextResponse.json(
        { message: 'Nome e prezzo sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Crea il servizio
    const { data: servizio, error } = await supabase
      .from('servizi')
      .insert([servizioData])
      .select()
      .single();
    
    if (error) {
      console.error('Errore durante la creazione del servizio:', error);
      return NextResponse.json(
        { message: 'Errore durante la creazione del servizio', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(servizio, { status: 201 });
  } catch (error: any) {
    console.error('Errore durante la creazione del servizio:', error);
    return NextResponse.json(
      { message: 'Errore durante la creazione del servizio', error: error.message },
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
    
    // Ottieni l'ID del servizio dalla URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID del servizio non fornito' },
        { status: 400 }
      );
    }
    
    // Elimina il servizio
    const { error } = await supabase
      .from('servizi')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Errore durante l\'eliminazione del servizio:', error);
      return NextResponse.json(
        { message: 'Errore durante l\'eliminazione del servizio', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Servizio eliminato con successo' });
  } catch (error: any) {
    console.error('Errore durante l\'eliminazione del servizio:', error);
    return NextResponse.json(
      { message: 'Errore durante l\'eliminazione del servizio', error: error.message },
      { status: 500 }
    );
  }
} 