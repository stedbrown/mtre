"use client";

import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';

export default function TestimonialsPage() {
  const t = useTranslations();
  
  // Array di testimonianze di esempio
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.clients.client1.name'),
      role: t('testimonials.clients.client1.role'),
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: t('testimonials.clients.client1.text'),
      rating: 5
    },
    {
      id: 2,
      name: t('testimonials.clients.client2.name'),
      role: t('testimonials.clients.client2.role'),
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: t('testimonials.clients.client2.text'),
      rating: 5
    },
    {
      id: 3,
      name: t('testimonials.clients.client3.name'),
      role: t('testimonials.clients.client3.role'),
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: t('testimonials.clients.client3.text'),
      rating: 4
    },
    {
      id: 4,
      name: t('testimonials.clients.client4.name', { defaultValue: 'Francesca Neri' }),
      role: t('testimonials.clients.client4.role', { defaultValue: 'Proprietaria di Casa' }),
      image: 'https://randomuser.me/api/portraits/women/17.jpg',
      text: t('testimonials.clients.client4.text', { defaultValue: 'Ho un piccolo giardino che sembrava impossibile da valorizzare. Il team di M.T.R.E. ha creato un progetto su misura che ha trasformato completamente lo spazio. Ora è il mio angolo di paradiso!' }),
      rating: 5
    },
    {
      id: 5,
      name: t('testimonials.clients.client5.name', { defaultValue: 'Roberto Marini' }),
      role: t('testimonials.clients.client5.role', { defaultValue: 'Direttore Hotel' }),
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: t('testimonials.clients.client5.text', { defaultValue: 'La nostra catena di hotel si affida a M.T.R.E. per la manutenzione di tutti i giardini delle nostre strutture. La qualità del servizio è sempre impeccabile e contribuisce significativamente all&quot;immagine di lusso dei nostri hotel.' }),
      rating: 5
    },
    {
      id: 6,
      name: t('testimonials.clients.client6.name', { defaultValue: 'Elena Martini' }),
      role: t('testimonials.clients.client6.role', { defaultValue: 'Architetto' }),
      image: 'https://randomuser.me/api/portraits/women/57.jpg',
      text: t('testimonials.clients.client6.text', { defaultValue: 'Collaboro spesso con M.T.R.E. per i progetti di architettura del paesaggio. La loro competenza tecnica e la capacità di interpretare le esigenze del cliente sono davvero notevoli. Un partner affidabile e professionale.' }),
      rating: 4
    }
  ];
  
  // Funzione per renderizzare le stelle in base al rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection
        title={t('testimonials.title')}
        description={t('testimonials.description')}
        backgroundImage="/images/hero/testimonials-new.jpg"
      />
      
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
            {t('testimonials.title')}
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12 text-gray-800 font-medium">
            {t('testimonials.description')}
          </p>
          
          {/* Griglia di testimonianze */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-700 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t('testimonials.cta.title')}</h2>
            <p className="text-gray-700 mb-6">{t('testimonials.cta.description')}</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              {t('testimonials.cta.button')}
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 