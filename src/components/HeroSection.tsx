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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Precarica l'immagine
    const img = new window.Image();
    img.src = backgroundImage;
    img.onload = () => setLoaded(true);
    
    // Fallback se l'immagine è già nella cache
    const timer = setTimeout(() => {
      if (!loaded) setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [backgroundImage, loaded]);
  
  return (
    <div 
      className={`relative ${height} min-h-[400px] flex items-center overflow-hidden bg-green-900`}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
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
          className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAbEAADAAMBAQAAAAAAAAAAAAAAAQIDBAURIf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Ar6pXUACAf//Z"
          onLoadingComplete={() => setLoaded(true)}
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