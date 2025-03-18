'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ClickableCardProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function ClickableCard({ href, className = '', children }: ClickableCardProps) {
  const router = useRouter();
  
  return (
    <div 
      className={`cursor-pointer group ${className}`}
      onClick={() => {
        router.push(href);
      }}
    >
      {children}
    </div>
  );
} 