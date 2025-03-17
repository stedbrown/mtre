import { createClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import RemoveLogoButton from './RemoveLogoButton';
import { 
  FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, 
  FiFileText, FiCreditCard, FiInfo, FiImage
} from 'react-icons/fi';
import Link from 'next/link';

// Azione server per aggiornare le informazioni aziendali
async function updateAziendaInfo(formData: FormData) {
  'use server';
  
  const supabase = await createClient();
  
  // Estrai i dati dal form
  const nome_azienda = formData.get('nome_azienda') as string;
  const partita_iva = formData.get('partita_iva') as string;
  const indirizzo = formData.get('indirizzo') as string;
  const cap = formData.get('cap') as string;
  const citta = formData.get('citta') as string;
  const cantone = formData.get('cantone') as string;
  const paese = formData.get('paese') as string;
  const telefono = formData.get('telefono') as string;
  const email = formData.get('email') as string;
  let sito_web = formData.get('sito_web') as string | null;
  
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
      cap,
      citta,
      cantone,
      paese,
      telefono,
      email,
      sito_web
    })
    .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
  
  if (error) {
    console.error('Errore durante l\'aggiornamento delle informazioni aziendali:', error);
  }
  
  // Rivalidare il percorso per aggiornare i dati
  revalidatePath('/admin/impostazioni');
}

// Azione server per caricare il logo
async function uploadLogo(formData: FormData) {
  'use server';
  
  const supabase = await createClient();
  const logoFile = formData.get('logo') as File;
  
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
    
    // Rivalidare il percorso per aggiornare i dati
    revalidatePath('/admin/impostazioni');
    
  } catch (error) {
    console.error('Errore durante il caricamento del logo:', error);
  }
}

// Azione server per rimuovere il logo
async function removeLogo() {
  'use server';
  
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('azienda_info')
    .update({ logo_url: null })
    .eq('id', '2a7ff5d6-8cb4-4596-8f71-d53f2ee1e37d');
  
  if (error) {
    console.error('Errore durante la rimozione del logo:', error);
  }
  
  revalidatePath('/admin/impostazioni');
}

export default async function ImpostazioniPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // In Next.js 15, params è una Promise che deve essere attesa
  const { locale } = await params;
  
  // Verifica l'autenticazione
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Accesso negato</h1>
        <p className="text-gray-600">Devi effettuare l'accesso per visualizzare questa pagina.</p>
        <a href={`/${locale}/admin/login`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Vai alla pagina di login
        </a>
      </div>
    );
  }
  
  // Recupera le informazioni dell'azienda
  const { data: aziendaInfo } = await supabase
    .from('azienda_info')
    .select('*')
    .limit(1)
    .single();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci le informazioni della tua azienda che verranno visualizzate nei preventivi e nelle fatture
          </p>
        </div>
      </div>
      
      {/* Riepilogo informazioni aziendali */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-indigo-50">
          <h2 className="text-lg font-semibold text-indigo-900">Riepilogo informazioni aziendali</h2>
          <p className="text-sm text-indigo-700 mt-1">
            Ecco come le tue informazioni appariranno nei documenti
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo e informazioni principali */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-40 h-40 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                {aziendaInfo?.logo_url ? (
                  <img 
                    src={aziendaInfo.logo_url} 
                    alt="Logo aziendale" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FiImage className="w-10 h-10 mb-2" />
                    <span className="text-sm">Nessun logo</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">Logo aziendale</span>
            </div>
            
            {/* Dettagli azienda */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <FiInfo className="mr-2" /> Informazioni generali
                </h3>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-900">{aziendaInfo?.nome_azienda || 'Nome azienda non impostato'}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiCreditCard className="mr-2 text-gray-400" /> 
                    {aziendaInfo?.partita_iva || 'Partita IVA non impostata'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <FiMapPin className="mr-2" /> Indirizzo
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{aziendaInfo?.indirizzo || 'Indirizzo non impostato'}</p>
                  <p className="text-sm text-gray-600">
                    {[
                      aziendaInfo?.cap, 
                      aziendaInfo?.citta, 
                      aziendaInfo?.cantone
                    ].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">{aziendaInfo?.paese || ''}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <FiPhone className="mr-2" /> Contatti
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiPhone className="mr-2 text-gray-400" /> 
                    {aziendaInfo?.telefono || 'Telefono non impostato'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiMail className="mr-2 text-gray-400" /> 
                    {aziendaInfo?.email || 'Email non impostata'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiGlobe className="mr-2 text-gray-400" /> 
                    {aziendaInfo?.sito_web || 'Sito web non impostato'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Visualizza un esempio di documento</p>
                  <div className="flex space-x-2 justify-center">
                    <Link
                      href={`/api/preventivi/esempio/pdf`}
                      target="_blank"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <FiFileText className="mr-1" /> Preventivo
                    </Link>
                    <Link
                      href={`/api/fatture/esempio/pdf`}
                      target="_blank"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                    >
                      <FiFileText className="mr-1" /> Fattura
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo aziendale */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiImage className="mr-2 text-indigo-600" /> Logo aziendale
          </h2>
          <p className="text-sm text-gray-500 mt-1">Questo logo verrà visualizzato nei preventivi e nelle fatture.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-40 h-40 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {aziendaInfo?.logo_url ? (
                <img 
                  src={aziendaInfo.logo_url} 
                  alt="Logo aziendale" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FiImage className="w-10 h-10 mb-2" />
                  <span className="text-sm">Nessun logo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <form action={uploadLogo} className="space-y-4">
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Carica un nuovo logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-600
                      hover:file:bg-indigo-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Formati supportati: JPG, PNG, SVG. Dimensione massima: 2MB.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Carica logo
                  </button>
                  
                  {aziendaInfo?.logo_url && (
                    <RemoveLogoButton removeLogo={removeLogo} />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informazioni azienda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiInfo className="mr-2 text-indigo-600" /> Informazioni azienda
          </h2>
          <p className="text-sm text-gray-500 mt-1">Queste informazioni verranno visualizzate nei preventivi e nelle fatture.</p>
        </div>
        <div className="p-6">
          <form action={updateAziendaInfo} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Informazioni generali</h3>
                
                <div>
                  <label htmlFor="nome_azienda" className="block text-sm font-medium text-gray-700">
                    Nome azienda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome_azienda"
                    name="nome_azienda"
                    defaultValue={aziendaInfo?.nome_azienda || ''}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="partita_iva" className="block text-sm font-medium text-gray-700">
                    Partita IVA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="partita_iva"
                    name="partita_iva"
                    defaultValue={aziendaInfo?.partita_iva || ''}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Indirizzo</h3>
                
                <div>
                  <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700">
                    Indirizzo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="indirizzo"
                    name="indirizzo"
                    defaultValue={aziendaInfo?.indirizzo || ''}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cap" className="block text-sm font-medium text-gray-700">
                      CAP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cap"
                      name="cap"
                      defaultValue={aziendaInfo?.cap || ''}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="citta" className="block text-sm font-medium text-gray-700">
                      Città <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="citta"
                      name="citta"
                      defaultValue={aziendaInfo?.citta || ''}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cantone" className="block text-sm font-medium text-gray-700">
                      Cantone
                    </label>
                    <input
                      type="text"
                      id="cantone"
                      name="cantone"
                      defaultValue={aziendaInfo?.cantone || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paese" className="block text-sm font-medium text-gray-700">
                      Paese <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="paese"
                      name="paese"
                      defaultValue={aziendaInfo?.paese || ''}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Contatti</h3>
                
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Telefono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    defaultValue={aziendaInfo?.telefono || ''}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={aziendaInfo?.email || ''}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="sito_web" className="block text-sm font-medium text-gray-700">
                    Sito web
                  </label>
                  <input
                    type="text"
                    id="sito_web"
                    name="sito_web"
                    defaultValue={aziendaInfo?.sito_web || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="https://esempio.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Inserisci l'URL completo con http:// o https:// (esempio: https://mtre.ch). Non includere lo slash finale.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Salva modifiche
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Impostazioni utente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="mr-2 text-indigo-600" /> Impostazioni utente
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gestisci le tue informazioni personali e le preferenze.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">Amministratore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 