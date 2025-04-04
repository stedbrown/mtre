"use client";

import { memo } from "react";
import Image from "next/image";

type HeroSectionProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  height?: string;
  imageSrc?: string;
  overlay?: boolean;
};

// Ottimizzato per ridurre LCP da 11 secondi
const HeroSection = memo(function HeroSection({
  title,
  description,
  children,
  height = "h-[60vh]",
  imageSrc = "/images/hero/home-new.avif",
  overlay = true,
}: HeroSectionProps) {
  return (
    <section 
      className={`relative ${height} min-h-[400px] flex items-center overflow-hidden bg-green-800`}
      aria-labelledby="hero-heading"
    >
      {/* Contenuto hero posizionato sopra per renderizzare subito il testo */}
      <div className="container mx-auto px-4 relative z-20">
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

      {/* Background placeholder per LCP immediato */}
      <div 
        className="absolute inset-0 bg-green-800 z-0" 
        aria-hidden="true"
      />

      {/* Immagine hero con attributi ottimizzati per LCP */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={true}
        quality={55}
        sizes="100vw"
        className="object-cover"
        style={{position: 'absolute'}}
        fetchPriority="high"
        aria-hidden="true"
        loading="eager"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxNjY1MzQiLz48L3N2Zz4="
        width={1920}
        height={1080}
      />

      {/* Overlay scuro per aumentare il contrasto del testo */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/40 z-10"
          aria-hidden="true"
        />
      )}
    </section>
  );
});

export default HeroSection; 