'use client';

import { ReactNode } from 'react';

interface ClientCardActionsProps {
  className?: string;
  children: ReactNode;
}

export default function ClientCardActions({ className = '', children }: ClientCardActionsProps) {
  return (
    <div 
      className={`flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
} 