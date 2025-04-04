"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/HeroSection';
import ActionButton from '@/components/ActionButton';
import Script from 'next/script';

export default function ContactPage() {
  const t = useTranslations();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Sostituisco con l'ultimo ID Formspree fornito dall'utente
      const response = await fetch('https://formspree.io/f/xrbpyagy', // NUOVO ID AGGIORNATO
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          service: '',
          message: ''
        });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };
  
  return (
    <MainLayout showBreadcrumbs>
      {/* Google Maps script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=Function.prototype`}
        strategy="lazyOnload"
      />
      
      {/* Hero Section */}
      <HeroSection
        title={t('contact.title')}
        description={t('contact.description')}
        imageSrc="/images/hero/contact-new.avif"
      />
      
      <section className="py-10 md:py-16 bg-green-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6 md:mb-8">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-10 md:mb-12 text-gray-800 font-medium px-4">
            {t('contact.description')}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-4">
            {/* Informazioni di contatto */}
            <div className="bg-white p-5 md:p-8 rounded-lg shadow-md card-shadow">
              <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-6">{t('contact.info.title')}</h3>
              
              <div className="space-y-5">
                <ContactInfoItem 
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  }
                  title={t('contact.info.address.label')}
                  content={<>Via Croce 2, 6710 Biasca<br />Svizzera, Ticino</>}
                />
                
                <ContactInfoItem 
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  }
                  title={t('contact.info.phone.label')}
                  content={
                    <a href="tel:+41767426736" className="hover:text-green-600 transition-colors">
                      +41 76 742 67 36
                    </a>
                  }
                />
                
                <ContactInfoItem 
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  }
                  title={t('contact.info.email.label')}
                  content={
                    <a href="mailto:emanuele.novara77@gmail.com" className="hover:text-green-600 transition-colors">
                      emanuele.novara77@gmail.com
                    </a>
                  }
                />
                
                <ContactInfoItem 
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  }
                  title={t('contact.info.hours.label')}
                  content={
                    <>
                      {t('contact.info.hours.weekdays')}<br />
                      {t('contact.info.hours.saturday')}<br />
                      {t('contact.info.hours.sunday')}
                    </>
                  }
                />
              </div>
              
              {/* Mappa di Google Maps */}
              <div className="mt-8 h-64 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2757.2116918755173!2d8.965923977173276!3d46.35951797123022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47844984d8a6fb13%3A0x88dbdf7ce32164f9!2sVia%20Croce%202%2C%206710%20Biasca%2C%20Svizzera!5e0!3m2!1sit!2sit!4v1718057222888!5m2!1sit!2sit" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sede M.T.R.E. Giardinaggio a Biasca, Ticino"
                  aria-label="Mappa della sede di M.T.R.E. Giardinaggio a Biasca, Ticino"
                ></iframe>
              </div>
            </div>
            
            {/* Form di contatto */}
            <div className="bg-white p-5 md:p-8 rounded-lg shadow-md card-shadow">
              <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-6">{t('contact.form.title')}</h3>
              
              {formStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                  <div className="flex">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p>{t('contact.form.success')}</p>
                  </div>
                </div>
              ) : formStatus === 'error' ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p>{t('contact.form.error')}</p>
                  </div>
                </div>
              ) : null}
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.form.service')}
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{t('contact.form.serviceOptions.choose')}</option>
                    <option value="garden-design">{t('contact.form.serviceOptions.gardenDesign')}</option>
                    <option value="maintenance">{t('contact.form.serviceOptions.maintenance')}</option>
                    <option value="irrigation">{t('contact.form.serviceOptions.irrigation')}</option>
                    <option value="tree-care">{t('contact.form.serviceOptions.treeCare')}</option>
                    <option value="green-areas">{t('contact.form.serviceOptions.greenAreas')}</option>
                    <option value="lighting">{t('contact.form.serviceOptions.lighting')}</option>
                    <option value="other">{t('contact.form.serviceOptions.other')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="text-center mt-6">
                  <ActionButton
                    variant="primary"
                    size="md"
                    className={formStatus === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''}
                    icon={
                      formStatus === 'submitting' ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null
                    }
                    iconPosition="left"
                  >
                    {formStatus === 'submitting'
                      ? t('contact.form.submitting')
                      : t('contact.form.submit')}
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social media */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-8">{t('contact.social.title')}</h2>
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://www.facebook.com/profile.php?id=100063575210819" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <div className="bg-green-50 p-3 rounded-full hover:bg-green-100 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
            <a href="https://instagram.com/mtregiardiniere/?igsh=ZXNqdXk4eW14dHJs" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <div className="bg-green-50 p-3 rounded-full hover:bg-green-100 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
            <a href="https://wa.me/41767426736" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <div className="bg-green-50 p-3 rounded-full hover:bg-green-100 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.94 3.654c-1.94-1.95-4.52-3.022-7.27-3.023-5.67 0-10.29 4.607-10.29 10.28 0 1.812.47 3.583 1.37 5.15L3 22l5.5-1.438c1.377.772 2.948 1.186 4.552 1.188h.005c5.66 0 10.28-4.608 10.29-10.282.01-2.747-1.06-5.33-3.007-7.274l.01.011zm-7.27 19.147h-.004c-1.53 0-3.034-.412-4.344-1.188l-.31-.185-3.22.845.86-3.147-.203-.323c-.853-1.36-1.302-2.932-1.302-4.533 0-4.715 3.84-8.558 8.566-8.558 2.286.01 4.435.895 6.05 2.517 1.614 1.623 2.503 3.777 2.493 6.07-.01 4.715-3.843 8.557-8.585 8.557l-.001-.005zm4.705-6.403c-.257-.128-1.524-.753-1.762-.837-.237-.086-.41-.127-.583.127-.173.255-.67.837-.82 1.01-.152.17-.303.193-.56.064-.258-.128-1.089-.4-2.073-1.278-.766-.684-1.284-1.53-1.433-1.786-.15-.255-.017-.393.112-.52.115-.115.257-.298.387-.447.127-.15.17-.255.257-.425.086-.172.043-.32-.022-.448-.064-.127-.582-1.404-.799-1.922-.21-.51-.425-.44-.582-.447-.15-.006-.322-.012-.494-.012-.173 0-.45.065-.687.32-.236.257-.904.886-.904 2.162 0 1.275.927 2.507 1.056 2.678.128.17 1.818 2.778 4.406 3.9.616.266 1.096.426 1.472.545.62.197 1.18.168 1.624.1.498-.073 1.523-.623 1.74-1.223.214-.6.214-1.113.15-1.222-.064-.107-.235-.17-.495-.298z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto px-4">
            {t('contact.social.description')}
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

// Componente per elementi di informazioni di contatto
interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

function ContactInfoItem({ icon, title, content }: ContactInfoItemProps) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        <div className="mt-1 text-gray-600">
          {content}
        </div>
      </div>
    </div>
  );
} 