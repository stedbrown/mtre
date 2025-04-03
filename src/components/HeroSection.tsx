"use client";

import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';

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
    <div className={`relative ${height} min-h-[400px] flex items-center overflow-hidden bg-gray-900`}>
      {/* Immagine di sfondo */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background Image"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={90}
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/hfwAJtAPJY1BhTQAAAABJRU5ErkJggg=="
        />
        {/* Overlay con tinta scura per migliorare la leggibilità */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Contenuto */}
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