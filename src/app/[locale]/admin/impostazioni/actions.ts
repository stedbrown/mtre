'use server';

import { createClient } from '@/lib/supabase/server-client';
import { revalidatePath } from 'next/cache';

// Azione server per aggiornare le informazioni aziendali
export async function updateAziendaInfo(formData: FormData) {
  const supabase = await createClient();
  
  // Estrai i dati dal form
  const nome_azienda = formData.get('nome_azienda') as string;
  const partita_iva = formData.get('partita_iva') as string;
  const indirizzo = formData.get('indirizzo') as string;
  const via = formData.get('via') as string;
  const numero_civico = formData.get('numero_civico') as string;
  const cap = formData.get('cap') as string;
  const citta = formData.get('citta') as string;
  const cantone = formData.get('cantone') as string;
  const paese = formData.get('paese') as string;
  const telefono = formData.get('telefono') as string;
  const email = formData.get('email') as string;
  let sito_web = formData.get('sito_web') as string | null;
  
  // Dati bancari
  const iban = formData.get('iban') as string;
  
  // Ottieni la locale dal form o usa il valore predefinito
  const locale = formData.get('locale') as string || 'it';
  
  // Formatta correttamente il sito web o imposta a null se vuoto
  if (sito_web) {
    // Rimuovi spazi vuoti
    sito_web = sito_web.trim();
    
    // Se dopo il trim è vuoto, imposta a null
    if (sito_web === '') {
      sito_web = null;
    } else {
      // Assicurati che inizi con http:// o https://
      if (!sito_web.startsWith('http://') && !sito_web.startsWith('https://')) {
        sito_web = 'https://' + sito_web;
      }
      
      // Rimuovi lo slash finale se presente
      if (sito_web.endsWith('/')) {
        sito_web = sito_web.slice(0, -1);
      }
    }
  } else {
    sito_web = null; // Imposta a null se vuoto
  }
  
  // Aggiorna le informazioni dell'azienda
  const { error } = await supabase
    .from('azienda_info')
    .update({
      nome_azienda,
      partita_iva,
      indirizzo,
      via,
      numero_civico,
      cap,
      citta,
      cantone,
      paese,
      telefono,
      email,
      sito_web,
      iban,
    })
    .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
  
  if (error) {
    console.error('Errore durante l\'aggiornamento delle informazioni aziendali:', error);
  }
  
  // Simulazione di un ritardo per mostrare lo stato di caricamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Rivalidare il percorso per aggiornare i dati, includendo il locale
  revalidatePath(`/${locale}/admin/impostazioni`);
}

// Azione server per il form IBAN con ritorno dello stato
export async function updateIbanInfo(formData: FormData) {
  const supabase = await createClient();
  
  // Estrai l'IBAN dal form
  const iban = formData.get('iban') as string;
  
  // Ottieni la locale dal form o usa il valore predefinito
  const locale = formData.get('locale') as string || 'it';
  
  // Aggiorna solo l'IBAN
  const { error } = await supabase
    .from('azienda_info')
    .update({ iban })
    .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
  
  if (error) {
    console.error('Errore durante l\'aggiornamento dell\'IBAN:', error);
  }
  
  // Simulazione di un ritardo per mostrare lo stato di caricamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Rivalidare il percorso per aggiornare i dati, includendo il locale
  revalidatePath(`/${locale}/admin/impostazioni`);
  
  return { success: !error, error };
}

// Azione server per caricare il logo
export async function uploadLogo(formData: FormData) {
  const supabase = await createClient();
  const logoFile = formData.get('logo') as File;
  
  // Ottieni la locale dal form o usa il valore predefinito
  const locale = formData.get('locale') as string || 'it';
  
  if (!logoFile || logoFile.size === 0) {
    return;
  }
  
  // Verifica che sia un'immagine
  if (!logoFile.type.startsWith('image/')) {
    return;
  }
  
  // Limita la dimensione a 2MB
  if (logoFile.size > 2 * 1024 * 1024) {
    return;
  }
  
  try {
    // Converti il file in un array di byte
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Carica il file nel bucket 'logos'
    const fileName = `logo_${Date.now()}.${logoFile.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: logoFile.type,
        upsert: true
      });
    
    if (uploadError) {
      console.error('Errore durante il caricamento del logo:', uploadError);
      return;
    }
    
    // Ottieni l'URL pubblico del logo
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);
    
    // Aggiorna il campo logo_url nella tabella azienda_info
    const { error: updateError } = await supabase
      .from('azienda_info')
      .update({ logo_url: publicUrl })
      .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
    
    if (updateError) {
      console.error('Errore durante l\'aggiornamento del logo_url:', updateError);
      return;
    }
    
    // Rivalidare il percorso per aggiornare i dati, includendo il locale
    revalidatePath(`/${locale}/admin/impostazioni`);
    
  } catch (error) {
    console.error('Errore durante il caricamento del logo:', error);
  }
}

// Azione server per rimuovere il logo
export async function removeLogo(locale: string = 'it') {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('azienda_info')
    .update({ logo_url: null })
    .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
  
  if (error) {
    console.error('Errore durante la rimozione del logo:', error);
  }
  
  revalidatePath(`/${locale}/admin/impostazioni`);
} 