"use client";

import { memo, useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  
  // Assicurarsi che il componente sia montato lato client prima di mostrare contenuti
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determina l'immagine mobile estraendo il nome del file
  const baseName = imageSrc.substring(0, imageSrc.lastIndexOf('.'));
  const extension = imageSrc.substring(imageSrc.lastIndexOf('.'));
  const mobileImageSrc = `${baseName}-mobile${extension}`;

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
            {mounted ? title : <div className="h-12 bg-white/20 rounded animate-pulse mx-auto max-w-md"></div>}
          </h1>
          
          {description && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              {mounted ? description : <div className="h-6 bg-white/20 rounded animate-pulse mx-auto max-w-lg mt-4"></div>}
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

      {/* Immagine mobile per dispositivi mobili */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={true}
        quality={45}
        sizes="(max-width: 768px) 100vw, 100vw"
        className="object-cover md:hidden"
        style={{position: 'absolute'}}
        fetchPriority="high"
        aria-hidden="true"
        loading="eager"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NDAiIGhlaWdodD0iOTYwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTY2NTM0Ii8+PC9zdmc+"
        width={640}
        height={960}
      />
      
      {/* Immagine desktop per dispositivi più grandi */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={true}
        quality={50}
        sizes="100vw"
        className="object-cover hidden md:block"
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