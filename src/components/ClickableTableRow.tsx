'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ClickableTableRowProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function ClickableTableRow({ href, className = '', children }: ClickableTableRowProps) {
  const router = useRouter();
  
  return (
    <tr 
      className={`hover:bg-gray-50 transition-colors cursor-pointer group ${className}`}
      onClick={() => {
        router.push(href);
      }}
    >
      {children}
    </tr>
  );
} 