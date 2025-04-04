"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import ServiceCard from '@/components/ServiceCard';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import ActionButton from '@/components/ActionButton';
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
        <div className="container mx-auto">
          <Breadcrumbs />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <FilterButton 
              active={activeCategory === 'all'} 
              onClick={() => setActiveCategory('all')}
              label={t('services.filters.all')}
            />
            <FilterButton 
              active={activeCategory === 'residential'} 
              onClick={() => setActiveCategory('residential')}
              label={t('services.filters.residential')}
            />
            <FilterButton 
              active={activeCategory === 'commercial'} 
              onClick={() => setActiveCategory('commercial')}
              label={t('services.filters.commercial')}
            />
            <FilterButton 
              active={activeCategory === 'maintenance'} 
              onClick={() => setActiveCategory('maintenance')}
              label={t('services.filters.maintenance')}
            />
          </div>
        </div>
      </section>

      {/* Elenco dei servizi */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="card-grid">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                title={t(service.titleKey)}
                description={t(service.descriptionKey)}
                imageSrc={service.image}
                moreText={t('common.readMore')}
                linkHref={`/services/${service.id}`}
                priority={index < 3}
              />
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {t('services.noResults')}
              </div>
              <ActionButton 
                variant="outline" 
                onClick={() => setActiveCategory('all')}
              >
                {t('services.showAll')}
              </ActionButton>
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 md:py-16 bg-green-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('services.cta.title')}
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            {t('services.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ActionButton 
              href="/contact" 
              variant="primary"
              size="lg"
              className="bg-white text-green-800 hover:bg-green-100"
            >
              {t('services.cta.contact')}
            </ActionButton>
            <ActionButton 
              href="/gallery" 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-green-700/50"
            >
              {t('services.cta.gallery')}
            </ActionButton>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

// Componente per i pulsanti di filtro
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function FilterButton({ active, onClick, label }: FilterButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
        active
          ? 'bg-green-600 text-white' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}