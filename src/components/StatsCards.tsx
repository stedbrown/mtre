'use client';

import { FiUsers, FiFileText, FiCheckSquare, FiDollarSign } from 'react-icons/fi';

interface StatsCardsProps {
  clientiCount: number;
  preventiviCount: number;
  fattureCount: number;
  fatturato_totale: number;
}

export default function StatsCards({ clientiCount, preventiviCount, fattureCount, fatturato_totale }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Clienti</p>
            <p className="text-2xl font-bold text-gray-900">{clientiCount || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <FiCheckSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Preventivi</p>
            <p className="text-2xl font-bold text-gray-900">{preventiviCount || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <FiFileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Fatture</p>
            <p className="text-2xl font-bold text-gray-900">{fattureCount || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <FiDollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Fatturato Totale</p>
            <p className="text-2xl font-bold text-gray-900">
              {fatturato_totale.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'CHF'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 