"use client";

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { Locale, locales } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

interface LanguageSwitcherProps {
  isScrolled: boolean;
}

export default function LanguageSwitcher({ isScrolled }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale || 'it';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chiudi il dropdown quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mappa delle bandiere per ogni lingua
  const flags: Record<Locale, string> = {
    it: '🇮🇹',
    fr: '🇫🇷',
    de: '🇩🇪',
  };

  // Nomi nativi delle lingue
  const nativeNames: Record<Locale, string> = {
    it: 'IT',
    fr: 'FR',
    de: 'DE',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          isScrolled
            ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
            : 'text-gray-100 hover:text-white hover:bg-green-600/20'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          <span className="mr-1.5">{flags[currentLocale]}</span>
          <span>{nativeNames[currentLocale]}</span>
        </span>
        <svg
          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="py-1">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={pathname || '/'}
                locale={locale}
                className={`flex items-center px-3 py-1.5 text-sm ${
                  locale === currentLocale
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
                } transition-colors duration-150`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2 text-base">{flags[locale]}</span>
                <span>{nativeNames[locale]}</span>
                {locale === currentLocale && (
                  <svg className="ml-auto h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 