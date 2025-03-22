'use client';

import RemoveLogoButton from './RemoveLogoButton';
import { 
  FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, 
  FiFileText, FiCreditCard, FiInfo, FiImage, FiBriefcase,
  FiSave, FiCheck, FiAlertTriangle, FiX, FiSettings,
  FiGrid, FiPackage, FiDollarSign, FiShield
} from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { updateAziendaInfo, updateIbanInfo, uploadLogo } from './actions';

// Status indicator component
function StatusIndicator({ type, message }: { type: 'loading' | 'success' | 'error', message: string }) {
  const styles = {
    loading: "flex items-center space-x-2 text-indigo-600",
    success: "flex items-center space-x-2 text-green-600",
    error: "flex items-center space-x-2 text-red-600"
  };
  
  const icons = {
    loading: <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>,
    success: <FiCheck className="h-4 w-4" />,
    error: <FiAlertTriangle className="h-4 w-4" />
  };
  
  return (
    <div className={styles[type]}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

// Form dei dati bancari con gestione dello stato
function BancaDatiForm({ aziendaInfo, locale }: { aziendaInfo: any, locale: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    
    try {
      const result = await updateIbanInfo(formData);
      
      if (result.success) {
        setStatus('success');
        // Reset success state after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }
  
  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      
      <div className="relative">
        <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
          IBAN <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            id="iban"
            name="iban"
            defaultValue={aziendaInfo?.iban || ''}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md bg-white"
            placeholder="CH58 0483 5012 3456 7800 9"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiBriefcase className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500 flex items-start">
          <FiInfo className="h-4 w-4 text-indigo-500 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            Formato IBAN svizzero: CH seguito da 19 caratteri<br/>
            Esempio: CH58 0483 5012 3456 7800 9
          </span>
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full sm:w-auto flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${status === 'loading' ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Salvataggio...
            </>
          ) : (
            <>
              <FiSave className="h-5 w-5 mr-2" />
              Salva IBAN
            </>
          )}
        </button>
        
        <div className="ml-4">
          {status === 'success' && <StatusIndicator type="success" message="IBAN salvato con successo!" />}
          {status === 'error' && <StatusIndicator type="error" message="Errore durante il salvataggio" />}
        </div>
      </div>
    </form>
  );
}

type ImpostazioniClientProps = {
  locale: string;
  aziendaInfo: any;
  user: any;
};

export default function ImpostazioniClient({ locale, aziendaInfo, user }: ImpostazioniClientProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  async function handleSaveCompanyInfo(formData: FormData) {
    setSaveStatus('saving');
    try {
      // Verifica se c'è già un IBAN e assicuriamoci di mantenerlo
      const currentIban = formData.get('iban');
      if (!currentIban && aziendaInfo?.iban) {
        formData.set('iban', aziendaInfo.iban);
      }
      
      await updateAziendaInfo(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiSettings className="mr-2 text-indigo-600" /> Impostazioni
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestisci le informazioni della tua azienda che verranno visualizzate nei preventivi e nelle fatture
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            href={`/${locale}/admin/dashboard`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiGrid className="mr-2 -ml-1 h-5 w-5 text-gray-500" />
            Dashboard
          </Link>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiInfo className="mr-2 h-5 w-5" />
              Generali
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('branding')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'branding'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiImage className="mr-2 h-5 w-5" />
              Brand
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('payment')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiDollarSign className="mr-2 h-5 w-5" />
              Pagamenti
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('user')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'user'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiUser className="mr-2 h-5 w-5" />
              Utente
            </div>
          </button>
        </nav>
      </div>
      
      {/* Preview Card - Always visible at top */}
      {activeTab !== 'user' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900">Anteprima informazioni aziendali</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ecco come le tue informazioni appariranno nei documenti
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-28 h-28 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 mb-3">
                  {aziendaInfo?.logo_url ? (
                    <img 
                      src={aziendaInfo.logo_url} 
                      alt="Logo aziendale" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FiImage className="w-8 h-8 mb-1" />
                      <span className="text-xs">Nessun logo</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dettagli azienda */}
              <div className="flex-grow flex flex-col sm:flex-row gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex-1">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <FiPackage className="mr-2 text-indigo-500" /> Azienda
                  </h3>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-gray-900">{aziendaInfo?.nome_azienda || 'Nome azienda'}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiCreditCard className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.partita_iva || 'Partita IVA'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.indirizzo || 'Indirizzo completo'}, {aziendaInfo?.cap || 'CAP'} {aziendaInfo?.citta || 'Città'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex-1">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <FiPhone className="mr-2 text-indigo-500" /> Contatti
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiPhone className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.telefono || 'Telefono'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiMail className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.email || 'Email'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiGlobe className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.sito_web || 'Sito web'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiBriefcase className="mr-2 text-gray-400 flex-shrink-0" /> 
                      {aziendaInfo?.iban || 'IBAN non impostato'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex-1 flex flex-col justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Visualizza documento di esempio</p>
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
      )}
      
      {/* Generali Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiInfo className="mr-2 text-indigo-600" /> Informazioni azienda
            </h2>
            <p className="text-sm text-gray-500 mt-1">Queste informazioni verranno visualizzate nei preventivi e nelle fatture.</p>
          </div>
          <div className="p-6">
            {!aziendaInfo?.iban && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 mb-2">
                      Non hai ancora configurato un IBAN. Il QR code svizzero non sarà visibile nei tuoi documenti.
                    </p>
                    <button 
                      onClick={() => setActiveTab('payment')} 
                      className="text-xs font-medium text-yellow-700 hover:text-yellow-900 underline"
                    >
                      Vai alla configurazione IBAN →
                    </button>
                  </div>
                </div>
              </div>
            )}
            <form action={handleSaveCompanyInfo} className="space-y-6">
              <input type="hidden" name="locale" value={locale} />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2 flex items-center">
                    <FiInfo className="mr-2 text-indigo-500" /> Informazioni generali
                  </h3>
                  
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
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2 flex items-center">
                    <FiMapPin className="mr-2 text-indigo-500" /> Indirizzo
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="via" className="block text-sm font-medium text-gray-700">
                        Via <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="via"
                        name="via"
                        defaultValue={aziendaInfo?.via || ''}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Nome della via"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="numero_civico" className="block text-sm font-medium text-gray-700">
                        N° <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="numero_civico"
                        name="numero_civico"
                        defaultValue={aziendaInfo?.numero_civico || ''}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700">
                      Indirizzo completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="indirizzo"
                      name="indirizzo"
                      defaultValue={aziendaInfo?.indirizzo || ''}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Via e numero civico completi"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Questo campo sarà usato per la visualizzazione, mentre i campi Via e Numero sono necessari per il QR svizzero
                    </p>
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
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2 flex items-center">
                    <FiPhone className="mr-2 text-indigo-500" /> Contatti
                  </h3>
                  
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
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2 flex items-center">
                    <FiGlobe className="mr-2 text-indigo-500" /> Online
                  </h3>
                  
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
                      Inserisci l'URL completo con http:// o https:// (esempio: https://mtre.ch)
                    </p>
                  </div>
                  
                  <div>
                    <input type="hidden" name="cantone" defaultValue={aziendaInfo?.cantone || ''} />
                    <input type="hidden" name="paese" defaultValue={aziendaInfo?.paese || 'Svizzera'} />
                    <input type="hidden" name="iban" defaultValue={aziendaInfo?.iban || ''} />
                  </div>
                </div>
              </div>
          
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className={`flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${saveStatus === 'saving' ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-5 w-5 mr-2" />
                      Salva modifiche
                    </>
                  )}
                </button>
                
                <div>
                  {saveStatus === 'success' && <StatusIndicator type="success" message="Informazioni salvate con successo!" />}
                  {saveStatus === 'error' && <StatusIndicator type="error" message="Errore durante il salvataggio" />}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiImage className="mr-2 text-indigo-600" /> Logo aziendale
            </h2>
            <p className="text-sm text-gray-500 mt-1">Il logo verrà visualizzato nei preventivi e nelle fatture.</p>
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
                  <input type="hidden" name="locale" value={locale} />
                  
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
                      <FiImage className="mr-2 h-4 w-4" />
                      Carica logo
                    </button>
                    
                    {aziendaInfo?.logo_url && (
                      <RemoveLogoButton locale={locale} />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiDollarSign className="mr-2 text-indigo-600" /> QR Code Svizzero
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Inserisci il tuo IBAN per generare automaticamente il QR code svizzero nei tuoi documenti.
            </p>
          </div>
          <div className="p-6">
            {!aziendaInfo?.iban && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Non hai ancora configurato un IBAN. Inserisci un IBAN valido per visualizzare il QR code svizzero nei tuoi PDF.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <BancaDatiForm aziendaInfo={aziendaInfo} locale={locale} />
            
            {aziendaInfo?.iban && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 mb-2">
                      IBAN configurato. Il QR code svizzero sarà visibile nei PDF generati.
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`/api/fatture/esempio/pdf`}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <FiFileText className="mr-1" /> Visualizza fattura con QR
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* User Tab */}
      {activeTab === 'user' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiUser className="mr-2 text-indigo-600" /> Impostazioni utente
            </h2>
            <p className="text-sm text-gray-500 mt-1">Gestisci le tue informazioni personali e le preferenze.</p>
          </div>
          <div className="p-6">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{user?.email}</p>
                  <p className="text-sm text-gray-500">Amministratore</p>
                  
                  <div className="mt-4">
                    <Link 
                      href={`/${locale}/admin/impostazioni/utenti`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiShield className="mr-2 -ml-1 h-4 w-4" />
                      Gestisci utenti
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 