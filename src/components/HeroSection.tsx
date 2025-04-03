"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";

type HeroSectionProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  height?: string;
  imageSrc?: string;
  overlay?: boolean;
};

// Componente ottimizzato con memo per prevenire re-render inutili
const HeroSection = memo(function HeroSection({
  title,
  description,
  children,
  height = "h-[60vh]",
  imageSrc = "/images/hero/home-new.avif",
  overlay = true,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Ottimizza la visualizzazione dell'immagine hero
  useEffect(() => {
    // Segna l'immagine come caricata dopo che è stata renderizzata
    setIsLoaded(true);
  }, []);

  return (
    <section 
      className={`relative ${height} min-h-[400px] flex items-center overflow-hidden hero-section`}
      aria-labelledby="hero-heading"
    >
      {/* Placeholder di background per migliorare LCP */}
      <div 
        className="absolute inset-0 bg-green-800 z-0" 
        aria-hidden="true"
      />

      {/* Immagine hero con priorità alta e dimensioni esplicite */}
      <Image
        src={imageSrc}
        alt=""
        fill
        className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={true}
        quality={75}
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Overlay scuro per aumentare il contrasto del testo */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/40 z-10"
          aria-hidden="true"
        />
      )}

      {/* Contenuto hero con heading principale */}
      <div className="container mx-auto px-4 relative z-20 hero-content">
        <div className="max-w-3xl">
          <h1 
            id="hero-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {title}
          </h1>
          
          {description && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </section>
  );
});

export default HeroSection; 