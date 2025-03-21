'use client';

import { FiBarChart2, FiDollarSign } from 'react-icons/fi';
import { useEffect, useState } from 'react';

// Non importiamo i componenti dinamicamente per evitare errori di tipo
// Li renderizzeremo solo lato client con useEffect

interface DatiMensili {
  mese: string;
  fatturato: number;
  anno: string;
}

interface DatiStato {
  stato: string;
  valore: number;
}

interface Cliente {
  cliente_id: string;
  nome_cliente: string;
  numero_fatture: number;
  totale_fatturato: string;
}

interface DashboardChartsProps {
  datiMensili: DatiMensili[];
  datiStati: DatiStato[];
  topClienti: Cliente[];
  COLORS: string[];
}

export default function DashboardCharts({ datiMensili, datiStati, topClienti, COLORS }: DashboardChartsProps) {
  // Verifica se i dati sono disponibili
  const hasDatiMensili = datiMensili && datiMensili.length > 0;
  const hasDatiStati = datiStati && datiStati.length > 0;
  const hasTopClienti = topClienti && topClienti.length > 0;

  // Stato per controllare se siamo lato client 
  const [isClient, setIsClient] = useState(false);

  // Renderizziamo i grafici solo lato client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <FiBarChart2 className="mr-2" /> Andamento Finanziario
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafico Fatturato Mensile */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Fatturato mensile</h3>
          {hasDatiMensili ? (
            <div className="h-80">
              {isClient ? (
                // Lato client, importiamo e rendiamo i grafici
                <ChartFatturato datiMensili={datiMensili} />
              ) : (
                // Caricamento placeholder
                <div className="flex items-center justify-center h-full text-gray-400">
                  Caricamento grafico...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400">
              Nessun dato disponibile
            </div>
          )}
        </div>
        
        {/* Grafico a Torta Stato Fatture */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Stato fatture</h3>
          {hasDatiStati ? (
            <div className="h-80">
              {isClient ? (
                // Lato client, importiamo e rendiamo i grafici
                <ChartStato datiStati={datiStati} COLORS={COLORS} />
              ) : (
                // Caricamento placeholder
                <div className="flex items-center justify-center h-full text-gray-400">
                  Caricamento grafico...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400">
              Nessun dato disponibile
            </div>
          )}
        </div>
      </div>
      
      {/* Top Clienti */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> Top Clienti per Fatturato
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numero Fatture
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Totale Fatturato
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hasTopClienti ? (
                topClienti.map((cliente: Cliente, idx: number) => (
                  <tr key={cliente.cliente_id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.nome_cliente || 'Cliente non specificato'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {cliente.numero_fatture}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {parseFloat(cliente.totale_fatturato).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'CHF'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nessun dato disponibile
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componenti separati per i grafici, renderizzati solo lato client
function ChartFatturato({ datiMensili }: { datiMensili: DatiMensili[] }) {
  // Usiamo un import dinamico per renderizzare i grafici solo lato client
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    // Importiamo i componenti solo lato client
    import('recharts').then((Recharts) => {
      setChart({
        ResponsiveContainer: Recharts.ResponsiveContainer,
        BarChart: Recharts.BarChart,
        Bar: Recharts.Bar,
        XAxis: Recharts.XAxis,
        YAxis: Recharts.YAxis,
        CartesianGrid: Recharts.CartesianGrid,
        Tooltip: Recharts.Tooltip,
        Legend: Recharts.Legend
      });
    });
  }, []);

  if (!Chart) {
    return <div className="flex items-center justify-center h-full text-gray-400">Caricamento grafico...</div>;
  }

  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Chart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={datiMensili}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="mese" 
          angle={-45} 
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value: any) => [`${value} CHF`, 'Fatturato']}
          labelFormatter={(label: any, payload: any) => {
            if (payload && payload.length > 0) {
              return `${label} ${payload[0].payload.anno}`;
            }
            return label;
          }}
        />
        <Legend />
        <Bar dataKey="fatturato" fill="#4F46E5" name="Fatturato (CHF)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartStato({ datiStati, COLORS }: { datiStati: DatiStato[], COLORS: string[] }) {
  // Usiamo un import dinamico per renderizzare i grafici solo lato client
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    // Importiamo i componenti solo lato client
    import('recharts').then((Recharts) => {
      setChart({
        ResponsiveContainer: Recharts.ResponsiveContainer,
        PieChart: Recharts.PieChart,
        Pie: Recharts.Pie,
        Cell: Recharts.Cell,
        Tooltip: Recharts.Tooltip,
        Legend: Recharts.Legend
      });
    });
  }, []);

  if (!Chart) {
    return <div className="flex items-center justify-center h-full text-gray-400">Caricamento grafico...</div>;
  }

  const { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } = Chart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={datiStati}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="valore"
          nameKey="stato"
          label={({ stato, valore, percent }: any) => 
            `${stato}: ${valore} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {datiStati.map((entry: DatiStato, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [value, 'Numero fatture']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 