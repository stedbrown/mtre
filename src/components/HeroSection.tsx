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
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Precarica l'immagine
    const img = new window.Image();
    img.src = backgroundImage;
    img.onload = () => setImageLoaded(true);
  }, [backgroundImage]);

  return (
    <div className={`relative ${height} min-h-[400px] flex items-center overflow-hidden`}>
      {/* Overlay con tinta scura */}
      <div
        className={`absolute inset-0 bg-gray-900 transition-opacity duration-700 ${
          imageLoaded ? 'opacity-70' : 'opacity-100'
        }`}
      />
      
      {/* Immagine di sfondo */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={backgroundImage}
          alt="Background Image"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={90}
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
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