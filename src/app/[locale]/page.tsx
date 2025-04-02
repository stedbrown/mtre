"use client";

import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const t = useTranslations();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection
        title={t('home.hero.title')}
        description={t('home.hero.subtitle')}
        height="h-[85vh]"
        backgroundImage="/images/hero/home-new.jpg"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <Link 
            href="/contact" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 text-center border border-transparent hover:shadow-lg flex items-center justify-center group"
          >
            {t('home.hero.cta')}
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
          <Link 
            href="/services" 
            className="bg-transparent hover:bg-white/10 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 text-center border border-white hover:border-green-400"
          >
            {t('navigation.services')}
          </Link>
        </div>
      </HeroSection>

      {/* About Section con immagine */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-6">
                {t('home.about.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {t('home.about.description')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('home.features.experience')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('home.features.staff')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('home.features.quality')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('home.features.sustainable')}</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link 
                  href="/about" 
                  className="text-green-600 hover:text-green-800 font-semibold flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/mtregiardinaggio.JPG"
                alt="M.T.R.E. Giardinaggio - Team al lavoro"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Servizi Preview con immagini */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            {t('services.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Servizio 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
                  alt={t('home.services.design.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.design.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.design.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Servizio 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1611843467160-25afb8df1074"
                  alt={t('home.services.maintenance.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.maintenance.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.maintenance.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Servizio 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1598902108854-10e335adac99"
                  alt={t('home.services.irrigation.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">{t('home.services.irrigation.title')}</h3>
                <p className="text-gray-600 mb-4">{t('home.services.irrigation.description')}</p>
                <Link 
                  href="/services" 
                  className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                >
                  {t('home.services.more')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block"
            >
              {t('home.services.all')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {t('home.cta.contact')}
            </Link>
            <Link 
              href="/gallery" 
              className="bg-transparent hover:bg-green-700 border-2 border-white text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {t('home.cta.gallery')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonianze Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            {t('testimonials.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonianza 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt={t('testimonials.clients.client1.name')}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('testimonials.clients.client1.name')}</h3>
                  <p className="text-gray-600 text-sm">{t('testimonials.clients.client1.role')}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client1.text')}&quot;</p>
            </div>
            
            {/* Testimonianza 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt={t('testimonials.clients.client2.name')}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('testimonials.clients.client2.name')}</h3>
                  <p className="text-gray-600 text-sm">{t('testimonials.clients.client2.role')}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client2.text')}&quot;</p>
            </div>
            
            {/* Testimonianza 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://randomuser.me/api/portraits/men/67.jpg"
                    alt={t('testimonials.clients.client3.name')}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('testimonials.clients.client3.name')}</h3>
                  <p className="text-gray-600 text-sm">{t('testimonials.clients.client3.role')}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quot;{t('testimonials.clients.client3.text')}&quot;</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/testimonials" 
              className="text-green-600 hover:text-green-800 font-semibold flex items-center justify-center transition-colors"
            >
              {t('testimonials.clients.readMore')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
