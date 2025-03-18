'use client';

import { ReactNode } from 'react';

interface ClientActionCellProps {
  className?: string;
  children: ReactNode;
}

export default function ClientActionCell({ className = '', children }: ClientActionCellProps) {
  return (
    <td 
      className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </td>
  );
} 