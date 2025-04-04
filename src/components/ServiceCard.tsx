"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type ServiceCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  moreText: string;
  linkHref: string;
  priority?: boolean;
};

// Componente ottimizzato per immagini di dimensione adeguata e migliori performance
const ServiceCard = memo(function ServiceCard({
  title,
  description,
  imageSrc,
  moreText,
  linkHref,
  priority = false,
}: ServiceCardProps) {
  // Estrai la parte del percorso che non include l'estensione
  const basePath = imageSrc.substring(0, imageSrc.lastIndexOf('.'));
  const extension = imageSrc.substring(imageSrc.lastIndexOf('.'));
  // Costruisci il percorso per l'immagine mobile
  const mobileImageSrc = `${basePath.replace('/services/', '/services/mobile/')}${extension}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48">
        {/* Immagine mobile ottimizzata */}
        <Image
          src={mobileImageSrc}
          alt={title}
          width={320}
          height={240}
          className="object-cover group-hover:scale-105 transition-transform duration-300 md:hidden"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          quality={50}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmN2Y3Ii8+PC9zdmc+"
        />
        
        {/* Immagine desktop */}
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={300}
          className="object-cover group-hover:scale-105 transition-transform duration-300 hidden md:block"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          quality={60}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmN2Y3Ii8+PC9zdmc+"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link 
          href={linkHref} 
          className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
        >
          {moreText}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
});

export default ServiceCard; 