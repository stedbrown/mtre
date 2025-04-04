"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import ServiceCard from '@/components/ServiceCard';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// Definizione del tipo per i servizi
type Service = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  featuresKeys: Record<string, string>;
  category: string[];
};

export default function ServicesPage() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  
  // Assicurarsi che il componente sia montato lato client prima di usare le traduzioni
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Definizione dei servizi
  const services: Service[] = [
    {
      id: 'garden-design',
      titleKey: 'services.items.gardenDesign.title',
      descriptionKey: 'services.items.gardenDesign.description',
      image: '/images/services/garden-design.avif',
      featuresKeys: {
        consultation: 'services.items.gardenDesign.features.consultation',
        design3d: 'services.items.gardenDesign.features.design3d',
        plantSelection: 'services.items.gardenDesign.features.plantSelection',
        implementation: 'services.items.gardenDesign.features.implementation',
        supervision: 'services.items.gardenDesign.features.supervision'
      },
      category: ['residential', 'commercial']
    },
    {
      id: 'maintenance',
      titleKey: 'services.items.maintenance.title',
      descriptionKey: 'services.items.maintenance.description',
      image: '/images/services/maintenance.avif',
      featuresKeys: {
        lawnCare: 'services.items.maintenance.features.lawnCare',
        diseaseControl: 'services.items.maintenance.features.diseaseControl',
        fertilization: 'services.items.maintenance.features.fertilization',
        cleaning: 'services.items.maintenance.features.cleaning',
        seasonal: 'services.items.maintenance.features.seasonal'
      },
      category: ['residential', 'commercial', 'maintenance']
    },
    {
      id: 'irrigation',
      titleKey: 'services.items.irrigation.title',
      descriptionKey: 'services.items.irrigation.description',
      image: '/images/services/irrigation.avif',
      featuresKeys: {
        design: 'services.items.irrigation.features.design',
        installation: 'services.items.irrigation.features.installation',
        smartControl: 'services.items.irrigation.features.smartControl',
        maintenance: 'services.items.irrigation.features.maintenance',
        waterSaving: 'services.items.irrigation.features.waterSaving'
      },
      category: ['residential', 'commercial']
    },
    {
      id: 'green-areas',
      titleKey: 'services.items.greenAreas.title',
      descriptionKey: 'services.items.greenAreas.description',
      image: '/images/services/green-areas.avif',
      featuresKeys: {
        groundPreparation: 'services.items.greenAreas.features.groundPreparation',
        planting: 'services.items.greenAreas.features.planting',
        flowerBeds: 'services.items.greenAreas.features.flowerBeds',
        pathways: 'services.items.greenAreas.features.pathways',
        sustainable: 'services.items.greenAreas.features.sustainable'
      },
      category: ['residential', 'commercial']
    },
    {
      id: 'tree-care',
      titleKey: 'services.items.treeCare.title',
      descriptionKey: 'services.items.treeCare.description',
      image: '/images/services/tree-care.avif',
      featuresKeys: {
        pruning: 'services.items.treeCare.features.pruning',
        treatment: 'services.items.treeCare.features.treatment',
        stability: 'services.items.treeCare.features.stability',
        removal: 'services.items.treeCare.features.removal',
        consultation: 'services.items.treeCare.features.consultation'
      },
      category: ['residential', 'commercial', 'maintenance']
    },
    {
      id: 'lighting',
      titleKey: 'services.items.lighting.title',
      descriptionKey: 'services.items.lighting.description',
      image: '/images/services/lighting.avif',
      featuresKeys: {
        design: 'services.items.lighting.features.design',
        ledInstallation: 'services.items.lighting.features.ledInstallation',
        automation: 'services.items.lighting.features.automation',
        pathLighting: 'services.items.lighting.features.pathLighting',
        decorative: 'services.items.lighting.features.decorative'
      },
      category: ['residential', 'commercial']
    }
  ];
  
  // Filtra i servizi in base alla categoria attiva
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category.includes(activeCategory));
  
  // Se non è montato, mostra un placeholder di caricamento
  if (!mounted) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-green-50">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full"></div>
            <div className="h-6 bg-green-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection
        title={t('services.title')}
        description={t('services.description')}
        imageSrc="/images/hero/services-new.avif"
      />

      {/* Filtri per categoria & Breadcrumbs */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'all'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              {t('services.filters.all')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'residential'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('residential')}
            >
              {t('services.filters.residential')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'commercial'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('commercial')}
            >
              {t('services.filters.commercial')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'maintenance'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('maintenance')}
            >
              {t('services.filters.maintenance')}
            </button>
          </div>
        </div>
      </section>

      {/* Elenco dei servizi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Preview del servizio */}
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={t(service.titleKey)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
                
                {/* Contenuto del servizio */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{t(service.titleKey)}</h3>
                  <p className="text-gray-600 mb-4">{t(service.descriptionKey)}</p>
                  
                  {/* Lista di caratteristiche */}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-green-700 mb-2">
                      {t('services.serviceDetails.features')}
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {Object.values(service.featuresKeys).map((key, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-gray-700">{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Pulsanti di azione */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link 
                      href="/contact" 
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {t('services.serviceDetails.contact')}
                    </Link>
                    <Link 
                      href={`/services/${service.id}`} 
                      className="inline-block bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {t('services.serviceDetails.showMore')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}