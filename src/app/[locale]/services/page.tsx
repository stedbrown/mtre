"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import ServiceCard from '@/components/ServiceCard';
import HeroSection from '@/components/HeroSection';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Definizione del tipo per i servizi
type Service = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  featuresKeys: Record<string, string>;
  category: string[];
};

// Genera i metadata specifici per la pagina dei servizi
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre-giardinaggio.it';
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      images: [
        {
          url: `${baseUrl}/images/hero/services-new.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
}

export default function ServicesPage() {
  const t = useTranslations('services');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Array dei servizi
  const services: Service[] = [
    {
      id: 'garden-design',
      titleKey: 'items.gardenDesign.title',
      descriptionKey: 'items.gardenDesign.description',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
      featuresKeys: {
        consultation: 'items.gardenDesign.features.consultation',
        design3d: 'items.gardenDesign.features.design3d',
        plantSelection: 'items.gardenDesign.features.plantSelection',
        implementation: 'items.gardenDesign.features.implementation',
        supervision: 'items.gardenDesign.features.supervision',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'maintenance',
      titleKey: 'items.maintenance.title',
      descriptionKey: 'items.maintenance.description',
      image: 'https://images.unsplash.com/photo-1611843467160-25afb8df1074',
      featuresKeys: {
        lawnCare: 'items.maintenance.features.lawnCare',
        diseaseControl: 'items.maintenance.features.diseaseControl',
        fertilization: 'items.maintenance.features.fertilization',
        cleaning: 'items.maintenance.features.cleaning',
        seasonal: 'items.maintenance.features.seasonal',
      },
      category: ['residential', 'commercial', 'maintenance'],
    },
    {
      id: 'irrigation',
      titleKey: 'items.irrigation.title',
      descriptionKey: 'items.irrigation.description',
      image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99',
      featuresKeys: {
        design: 'items.irrigation.features.design',
        installation: 'items.irrigation.features.installation',
        smartControl: 'items.irrigation.features.smartControl',
        maintenance: 'items.irrigation.features.maintenance',
        waterSaving: 'items.irrigation.features.waterSaving',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'green-areas',
      titleKey: 'items.greenAreas.title',
      descriptionKey: 'items.greenAreas.description',
      image: 'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c',
      featuresKeys: {
        groundPreparation: 'items.greenAreas.features.groundPreparation',
        planting: 'items.greenAreas.features.planting',
        flowerBeds: 'items.greenAreas.features.flowerBeds',
        pathways: 'items.greenAreas.features.pathways',
        sustainable: 'items.greenAreas.features.sustainable',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'tree-care',
      titleKey: 'items.treeCare.title',
      descriptionKey: 'items.treeCare.description',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
      featuresKeys: {
        pruning: 'items.treeCare.features.pruning',
        treatment: 'items.treeCare.features.treatment',
        stability: 'items.treeCare.features.stability',
        removal: 'items.treeCare.features.removal',
        consultation: 'items.treeCare.features.consultation',
      },
      category: ['residential', 'commercial', 'maintenance'],
    },
    {
      id: 'landscape-lighting',
      titleKey: 'items.lighting.title',
      descriptionKey: 'items.lighting.description',
      image: 'https://images.unsplash.com/photo-1558370781-d6196949e317',
      featuresKeys: {
        design: 'items.lighting.features.design',
        ledInstallation: 'items.lighting.features.ledInstallation',
        automation: 'items.lighting.features.automation',
        pathLighting: 'items.lighting.features.pathLighting',
        decorative: 'items.lighting.features.decorative',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'excavation',
      titleKey: 'items.excavation.title',
      descriptionKey: 'items.excavation.description',
      image: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7',
      featuresKeys: {
        sitePreparation: 'items.excavation.features.sitePreparation',
        precisionExcavation: 'items.excavation.features.precisionExcavation',
        soilManagement: 'items.excavation.features.soilManagement',
        drainage: 'items.excavation.features.drainage',
        landscapeModeling: 'items.excavation.features.landscapeModeling',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'winter-service',
      titleKey: 'items.winterService.title',
      descriptionKey: 'items.winterService.description',
      image: 'https://images.unsplash.com/photo-1612709863934-3bf7e3e8a7e2',
      featuresKeys: {
        snowRemoval: 'items.winterService.features.snowRemoval',
        saltSpreading: 'items.winterService.features.saltSpreading',
        emergencyService: 'items.winterService.features.emergencyService',
        contractPlans: 'items.winterService.features.contractPlans',
        environmentalSafety: 'items.winterService.features.environmentalSafety',
      },
      category: ['residential', 'commercial', 'maintenance'],
    },
    {
      id: 'garden-materials',
      titleKey: 'items.gardenMaterials.title',
      descriptionKey: 'items.gardenMaterials.description',
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e',
      featuresKeys: {
        soilSubstrates: 'items.gardenMaterials.features.soilSubstrates',
        plants: 'items.gardenMaterials.features.plants',
        decorativeElements: 'items.gardenMaterials.features.decorativeElements',
        gardenTools: 'items.gardenMaterials.features.gardenTools',
        consultancy: 'items.gardenMaterials.features.consultancy',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'land-clearing',
      titleKey: 'items.landClearing.title',
      descriptionKey: 'items.landClearing.description',
      image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6',
      featuresKeys: {
        vegetationRemoval: 'items.landClearing.features.vegetationRemoval',
        recoveryPruning: 'items.landClearing.features.recoveryPruning',
        phytosanitaryTreatments: 'items.landClearing.features.phytosanitaryTreatments',
        wasteManagement: 'items.landClearing.features.wasteManagement',
        landReclamation: 'items.landClearing.features.landReclamation',
      },
      category: ['residential', 'commercial', 'maintenance'],
    },
    {
      id: 'fencing',
      titleKey: 'items.fencing.title',
      descriptionKey: 'items.fencing.description',
      image: 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7',
      featuresKeys: {
        customFencing: 'items.fencing.features.customFencing',
        naturalPaving: 'items.fencing.features.naturalPaving',
        masonryWorks: 'items.fencing.features.masonryWorks',
        outdoorStructures: 'items.fencing.features.outdoorStructures',
        sustainableMaterials: 'items.fencing.features.sustainableMaterials',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'turf-installation',
      titleKey: 'items.turfInstallation.title',
      descriptionKey: 'items.turfInstallation.description',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b',
      featuresKeys: {
        soilPreparation: 'items.turfInstallation.features.soilPreparation',
        qualityTurf: 'items.turfInstallation.features.qualityTurf',
        expertInstallation: 'items.turfInstallation.features.expertInstallation',
        aftercareService: 'items.turfInstallation.features.aftercareService',
        quickResults: 'items.turfInstallation.features.quickResults',
      },
      category: ['residential', 'commercial'],
    },
    {
      id: 'synthetic-turf',
      titleKey: 'items.syntheticTurf.title',
      descriptionKey: 'items.syntheticTurf.description',
      image: 'https://images.unsplash.com/photo-1599594004359-d5fa37a1e400',
      featuresKeys: {
        highQualitySynthetic: 'items.syntheticTurf.features.highQualitySynthetic',
        professionalInstallation: 'items.syntheticTurf.features.professionalInstallation',
        lowMaintenance: 'items.syntheticTurf.features.lowMaintenance',
        allYearPerfection: 'items.syntheticTurf.features.allYearPerfection',
        environmentalOptions: 'items.syntheticTurf.features.environmentalOptions',
      },
      category: ['residential', 'commercial'],
    },
  ];
  
  // Filtra i servizi in base alla categoria selezionata
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category.includes(activeCategory));

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection
        title={t('title')}
        description={t('description')}
        backgroundImage="/images/hero/services-new.jpg"
      />
      
      {/* Filtri per categoria */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'all'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              {t('filters.all')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'residential'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('residential')}
            >
              {t('filters.residential')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'commercial'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('commercial')}
            >
              {t('filters.commercial')}
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'maintenance'
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory('maintenance')}
            >
              {t('filters.maintenance')}
            </button>
          </div>
        </div>
      </section>

      {/* Elenco dei servizi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={t(service.titleKey)}
                description={t(service.descriptionKey)}
                image={service.image}
                features={Object.values(service.featuresKeys).map(key => t(key))}
                contactLabel={t('serviceDetails.contact')}
                showMoreLabel={t('serviceDetails.showMore')}
                showLessLabel={t('serviceDetails.showLess')}
                featuresLabel={t('serviceDetails.features')}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 