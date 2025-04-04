"use client";

import { useState, memo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

type ServiceCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  contactLabel: string;
  showMoreLabel: string;
  showLessLabel: string;
  featuresLabel: string;
};

// Utilizzo di memo per prevenire rerenders inutili
const ServiceCard = memo(function ServiceCard({
  id,
  title,
  description,
  image,
  features,
  contactLabel,
  showMoreLabel,
  showLessLabel,
  featuresLabel
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          width={400}
          height={300}
          quality={60}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjI3MDNmIi8+PC9zdmc+"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-800 mb-6">
          {description}
        </p>
        
        {expanded && (
          <div className="mt-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-green-600">{featuresLabel}</h3>
            <ul className="list-disc list-inside text-gray-800 space-y-2 mb-6">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button 
            onClick={toggleExpansion}
            className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors"
          >
            {expanded ? showLessLabel : showMoreLabel}
            <svg className={`w-5 h-5 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <Link 
            href="/contact" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ServiceCard; 