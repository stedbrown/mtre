import { Link } from '@/i18n/navigation';
import { ReactNode } from 'react';

type ServiceDetailProps = {
  title: string;
  description: string;
  features: string[];
  icon: ReactNode;
  featuresLabel: string;
  showMoreLabel: string;
  hasQuoteBox?: boolean;
  quoteTitle?: string;
  quoteDescription?: string;
  contactLabel?: string;
};

export default function ServiceDetail({
  title,
  description,
  features,
  icon,
  featuresLabel,
  showMoreLabel,
  hasQuoteBox = false,
  quoteTitle = '',
  quoteDescription = '',
  contactLabel = ''
}: ServiceDetailProps) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-green-600">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-green-600">
          {title}
        </h2>
      </div>
      <p className="text-gray-800 mb-6">
        {description}
      </p>
      
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3 text-green-600">{featuresLabel}</h3>
        <ul className="list-disc list-inside text-gray-800 space-y-2">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      {hasQuoteBox ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-green-600">{quoteTitle}</h3>
          <p className="text-gray-800 mb-4">{quoteDescription}</p>
          <Link 
            href="/contact" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {contactLabel}
          </Link>
        </div>
      ) : (
        <button 
          className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors"
        >
          {showMoreLabel}
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      )}
    </div>
  );
} 