"use client";

import { ReactNode } from 'react';

interface HeroSectionProps {
  title: string;
  description: string;
  height?: string;
  children?: ReactNode;
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  description,
  height = "h-[50vh]",
  children,
  backgroundImage = "/images/hero/home-new.avif"
}: HeroSectionProps) {
  return (
    <div 
      className={`relative ${height} min-h-[400px] flex items-center overflow-hidden`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#166534', // Fallback color while image loads
      }}
    >
      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <div className="w-20 h-1 bg-green-500 mb-6"></div>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
            {description}
          </p>
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
} 