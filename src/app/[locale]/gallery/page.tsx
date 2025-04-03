"use client";

import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import InstagramGallery from '@/components/InstagramGallery';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

export default function GalleryPage() {
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Token di accesso Instagram dalle variabili d'ambiente
  const instagramAccessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '';
  
  // Array di immagini di esempio (usate come fallback se Instagram non è disponibile)
  const fallbackImages: GalleryImage[] = [
    {
      id: 1,
      src: '/images/services/garden-design.avif',
      alt: t('gallery.fallback.image1.alt'),
      category: 'residential',
      title: t('gallery.fallback.image1.title'),
      description: t('gallery.fallback.image1.description')
    },
    {
      id: 2,
      src: '/images/services/maintenance.avif',
      alt: t('gallery.fallback.image2.alt'),
      category: 'terraces',
      title: t('gallery.fallback.image2.title'),
      description: t('gallery.fallback.image2.description')
    },
    {
      id: 3,
      src: '/images/services/irrigation.avif',
      alt: t('gallery.fallback.image3.alt'),
      category: 'irrigation',
      title: t('gallery.fallback.image3.title'),
      description: t('gallery.fallback.image3.description')
    },
    {
      id: 4,
      src: '/images/services/tree-care.avif',
      alt: t('gallery.fallback.image4.alt'),
      category: 'maintenance',
      title: t('gallery.fallback.image4.title'),
      description: t('gallery.fallback.image4.description')
    },
    {
      id: 5,
      src: '/images/services/green-areas.avif',
      alt: t('gallery.fallback.image5.alt'),
      category: 'residential',
      title: t('gallery.fallback.image5.title'),
      description: t('gallery.fallback.image5.description')
    },
    {
      id: 6,
      src: '/images/services/lighting.avif',
      alt: t('gallery.fallback.image6.alt'),
      category: 'residential',
      title: t('gallery.fallback.image6.title'),
      description: t('gallery.fallback.image6.description')
    },
    {
      id: 7,
      src: '/images/services/irrigation.avif',
      alt: t('gallery.fallback.image7.alt'),
      category: 'irrigation',
      title: t('gallery.fallback.image7.title'),
      description: t('gallery.fallback.image7.description')
    },
    {
      id: 8,
      src: '/images/services/garden-design.avif',
      alt: t('gallery.fallback.image8.alt'),
      category: 'residential',
      title: t('gallery.fallback.image8.title'),
      description: t('gallery.fallback.image8.description')
    }
  ];
  
  // Categorie per filtrare
  const categories = [
    { id: 'all', label: t('gallery.filters.all') },
    { id: 'residential', label: t('gallery.filters.residential') },
    { id: 'terraces', label: t('gallery.filters.terraces') },
    { id: 'irrigation', label: t('gallery.filters.irrigation') },
    { id: 'maintenance', label: t('gallery.filters.maintenance') }
  ];
  
  // Filtra le immagini per categoria
  const filteredImages = activeCategory === 'all' 
    ? fallbackImages 
    : fallbackImages.filter(img => img.category === activeCategory);
  
  // Funzione per aprire il modale con l'immagine selezionata
  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };
  
  // Funzione per chiudere il modale
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection
        title={t('gallery.title')}
        description={t('gallery.description')}
        backgroundImage="/images/hero/gallery-new.avif"
      />
      
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <Breadcrumbs />
          <h1 className="text-4xl font-bold text-center text-green-800 mb-8 mt-4">
            {t('gallery.title')}
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-8 text-gray-800 font-medium">
            {t('gallery.description')}
          </p>
          
          {/* Filtri di categoria (mostrati solo se utilizziamo le immagini di fallback) */}
          {!instagramAccessToken && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Griglia di immagini - Usa InstagramGallery se il token è disponibile, altrimenti usa le immagini di fallback */}
          {instagramAccessToken ? (
            <InstagramGallery accessToken={instagramAccessToken} limit={36} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => openModal(image)}
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                      <div className="p-4 w-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Call to Action per i social media */}
          <div className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t('gallery.social.title')}</h2>
            <p className="text-gray-700 mb-6">{t('gallery.social.description')}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://www.instagram.com/mtregiardiniere/?igsh=ZXNqdXk4eW14dHJs#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {t('gallery.social.instagram')}
              </a>
              
              <a 
                href="https://www.facebook.com/share/18Gu23c6qq/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {t('gallery.social.facebook')}
              </a>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/contact" 
                className="text-green-600 hover:text-green-800 font-semibold flex items-center justify-center transition-colors"
              >
                {t('gallery.social.contact')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal per visualizzare l'immagine selezionata - Migliorato */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4" 
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[95vh] bg-white rounded-lg overflow-hidden shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md"
              onClick={closeModal}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col h-full max-h-[95vh]">
              <div className="relative w-full h-[35vh] sm:h-[45vh] lg:h-[50vh] bg-black">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              
              <div className="p-4 w-full overflow-y-auto flex-grow" style={{ maxHeight: 'calc(60vh - 2rem)' }}>
                <h3 className="text-xl font-bold text-green-800 mb-3">{selectedImage.title}</h3>
                <p className="text-gray-700 mb-4">{selectedImage.description}</p>
                
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  {t('gallery.requestInfo')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

// Definizione del tipo per le immagini della galleria
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
}