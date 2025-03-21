'use client';

interface Fattura {
  id: string;
  numero: string;
  data: string;
  importo_totale: number | string;
  stato: string;
  cliente?: {
    id: string;
    nome: string;
    cognome: string;
  };
}

interface RecentActivityProps {
  attivitaRecenti: Fattura[];
  locale: string;
}

export default function RecentActivity({ attivitaRecenti, locale }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Attività Recenti</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Importo
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attivitaRecenti?.length > 0 ? (
              attivitaRecenti.map((fattura) => (
                <tr
                  key={fattura.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/${locale}/admin/fatture/${fattura.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fattura.numero}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(fattura.data).toLocaleDateString('it-IT')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fattura.cliente ? `${fattura.cliente.nome} ${fattura.cliente.cognome}` : 'Cliente non specificato'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {typeof fattura.importo_totale === 'number' 
                        ? fattura.importo_totale.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'CHF'
                          })
                        : parseFloat(fattura.importo_totale.toString()).toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'CHF'
                          })
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      fattura.stato === 'pagata' 
                        ? 'bg-green-100 text-green-800' 
                        : fattura.stato === 'annullata' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fattura.stato.charAt(0).toUpperCase() + fattura.stato.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nessuna attività recente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 