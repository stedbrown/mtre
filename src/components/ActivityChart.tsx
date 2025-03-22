'use client';

import React from 'react';
import { FiBarChart2, FiDollarSign } from 'react-icons/fi';

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

interface ActivityChartProps {
  datiMensili: DatiMensili[];
  datiStati: DatiStato[];
  topClienti: Cliente[];
  COLORS: string[];
}

export default function ActivityChart({ datiMensili, datiStati, topClienti, COLORS }: ActivityChartProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <FiBarChart2 className="mr-2" /> Andamento Finanziario
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafico Fatturato Mensile */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Fatturato mensile</h3>
          <div className="h-80 flex items-center justify-center">
            <ChartLoader type="bar" data={datiMensili} />
          </div>
        </div>
        
        {/* Grafico a Torta Stato Fatture */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Stato fatture</h3>
          <div className="h-80 flex items-center justify-center">
            <ChartLoader type="pie" data={datiStati} colors={COLORS} />
          </div>
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
              {topClienti.map((cliente: Cliente, idx: number) => (
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
              ))}
              {!topClienti.length && (
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

// ChartLoader utilizza client-side rendering per caricare i grafici
function ChartLoader({ type, data, colors }: { 
  type: 'bar' | 'pie'; 
  data: any[];
  colors?: string[];
}) {
  const [chartComponent, setChartComponent] = React.useState<React.ReactNode>(
    <div className="animate-pulse flex space-x-4 items-center">
      <div className="rounded-full bg-slate-200 h-10 w-10"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  React.useEffect(() => {
    let isMounted = true;

    const loadChart = async () => {
      if (type === 'bar') {
        // Carica i componenti per il grafico a barre
        const {
          ResponsiveContainer,
          BarChart,
          Bar,
          XAxis,
          YAxis,
          CartesianGrid,
          Tooltip,
          Legend,
        } = await import('recharts');

        if (!isMounted) return;

        setChartComponent(
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
              <Bar dataKey="fatturato" fill="#4F46E5" name="Fatturato (€)" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (type === 'pie') {
        // Carica i componenti per il grafico a torta
        const {
          ResponsiveContainer,
          PieChart,
          Pie,
          Cell,
          Tooltip,
          Legend,
        } = await import('recharts');

        if (!isMounted) return;

        setChartComponent(
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
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
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors?.[index % (colors?.length || 1)] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Numero fatture']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      }
    };

    loadChart();

    return () => {
      isMounted = false;
    };
  }, [type, data, colors]);

  return chartComponent;
} 