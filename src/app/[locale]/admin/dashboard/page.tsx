import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import Link from 'next/link';
import { 
  FiUsers, FiFileText, FiCheckSquare, FiPlus, 
  FiPhone, FiMail, FiMapPin, FiCalendar 
} from 'react-icons/fi';

// In Next.js 15, params è una Promise che deve essere awaited
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Verifica l'autenticazione
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
  
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Accesso richiesto</h1>
          <p className="text-gray-600 mb-6 text-center">
            Devi effettuare l'accesso per visualizzare questa pagina.
          </p>
          <div className="flex justify-center">
            <Link
              href={`/${locale}/admin/login`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Vai al login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Ottieni i conteggi
  const [
    { count: clientiCount }, 
    { count: preventiviCount }, 
    { count: fattureCount },
    { data: aziendaInfo },
    { data: attivitaRecenti }
  ] = await Promise.all([
    supabase.from('clienti').select('*', { count: 'exact', head: true }),
    supabase.from('preventivi').select('*', { count: 'exact', head: true }),
    supabase.from('fatture').select('*', { count: 'exact', head: true }),
    supabase.from('azienda_info').select('*').single(),
    supabase.from('fatture')
      .select(`
        id, 
        numero, 
        data, 
        importo_totale, 
        stato,
        cliente:clienti(id, nome, cognome)
      `)
      .order('data', { ascending: false })
      .limit(5)
  ]);
  
  // Formatta la data corrente
  const oggi = new Date();
  const opzioni: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dataFormattata = oggi.toLocaleDateString('it-IT', opzioni);
  const dataFormattataCapitalized = dataFormattata.charAt(0).toUpperCase() + dataFormattata.slice(1);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Benvenuto, {user.email}
          </p>
          <p className="text-sm text-gray-500">{dataFormattataCapitalized}</p>
        </div>
      </div>
      
      {/* Informazioni azienda */}
      {aziendaInfo && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FiMapPin className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-900">{aziendaInfo.nome}</h2>
              <p className="text-gray-600">{aziendaInfo.indirizzo}</p>
              <div className="mt-2 flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex items-center mt-2 sm:mt-0">
                  <FiPhone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{aziendaInfo.telefono}</span>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <FiMail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{aziendaInfo.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clienti</p>
              <p className="text-2xl font-bold text-gray-900">{clientiCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href={`/${locale}/admin/clienti`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Gestisci clienti →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FiCheckSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Preventivi</p>
              <p className="text-2xl font-bold text-gray-900">{preventiviCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href={`/${locale}/admin/preventivi`}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Gestisci preventivi →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FiFileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Fatture</p>
              <p className="text-2xl font-bold text-gray-900">{fattureCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href={`/${locale}/admin/fatture`}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Gestisci fatture →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Azioni rapide */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Azioni rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/admin/clienti/nuovo`}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="p-3 rounded-full bg-blue-100 mb-3">
              <FiUsers className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Nuovo cliente</span>
          </Link>
          
          <Link
            href={`/${locale}/admin/preventivi/nuovo`}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="p-3 rounded-full bg-purple-100 mb-3">
              <FiCheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Nuovo preventivo</span>
          </Link>
          
          <Link
            href={`/${locale}/admin/fatture/nuovo`}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="p-3 rounded-full bg-green-100 mb-3">
              <FiFileText className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Nuova fattura</span>
          </Link>
          
          <Link
            href={`/${locale}/admin/servizi/nuovo`}
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="p-3 rounded-full bg-yellow-100 mb-3">
              <FiPlus className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">Nuovo servizio</span>
          </Link>
        </div>
      </div>
      
      {/* Attività recenti */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Attività recenti</h2>
          <Link 
            href={`/${locale}/admin/fatture`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Vedi tutte
          </Link>
        </div>
        
        {attivitaRecenti && attivitaRecenti.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attivitaRecenti.map((fattura: any) => (
                  <tr key={fattura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                        {new Date(fattura.data).toLocaleDateString('it-IT')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fattura.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fattura.cliente ? `${fattura.cliente.nome} ${fattura.cliente.cognome}` : 'Cliente rimosso'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(fattura.importo_totale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${fattura.stato === 'pagata' ? 'bg-green-100 text-green-800' : 
                          fattura.stato === 'emessa' ? 'bg-blue-100 text-blue-800' : 
                          fattura.stato === 'scaduta' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {fattura.stato.charAt(0).toUpperCase() + fattura.stato.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nessuna attività recente</p>
          </div>
        )}
      </div>
    </div>
  );
} 