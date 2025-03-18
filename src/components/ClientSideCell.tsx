'use client';

import { ReactNode } from 'react';

interface ClientSideCellProps {
  children: ReactNode;
  className?: string;
}

export default function ClientSideCell({ children, className = '' }: ClientSideCellProps) {
  return (
    <td 
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </td>
  );
} 