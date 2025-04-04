"use client";

import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { locales } from '@/i18n/navigation';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Assicurarsi che il componente sia montato lato client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  // Gestione dei click esterni per chiudere il dropdown
  useEffect(() => {
    if (!mounted) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mounted]);

  // Traduzioni solo quando il componente è montato
  const t = mounted ? useTranslations('languages') : null;

  // Mappa delle bandiere per ogni lingua
  const flagEmoji = {
    it: "🇮🇹",
    en: "🇬🇧",
  };

  // Ottieni il nome completo della lingua
  const localeNames = {
    it: "Italiano",
    en: "English",
  };

  // Non mostrare nulla finché non è montato
  if (!mounted) {
    return (
      <div className={`relative inline-block text-left ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full px-2 py-1.5 text-sm font-medium rounded-md hover:bg-opacity-30 focus:outline-none"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="w-5 h-5 bg-gray-200 rounded animate-pulse"></span>
          <span className="ml-1 w-4 h-4 bg-gray-200 rounded animate-pulse"></span>
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left z-50 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
      <button
        type="button"
        className={`inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-opacity-30 focus:outline-none ${
          isScrolled 
            ? 'hover:bg-gray-100 text-gray-800' 
            : 'hover:bg-green-600/20 text-white'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen ? "true" : "false"}
        aria-haspopup="true"
      >
        <span role="img" aria-label={localeNames[locale as keyof typeof localeNames]} className="text-base">
          {flagEmoji[locale as keyof typeof flagEmoji]}
        </span>
        <span className="ml-2 hidden sm:inline">{localeNames[locale as keyof typeof localeNames]}</span>
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg focus:outline-none ${
            isScrolled ? 'bg-white ring-1 ring-black ring-opacity-5' : 'bg-green-700 ring-1 ring-green-600'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {locales.map((l) => {
              return (
                <Link
                  key={l}
                  href={pathname || '/'}
                  locale={l}
                  className={`flex items-center px-4 py-3 text-sm ${
                    locale === l 
                      ? isScrolled
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'bg-green-600/40 text-white font-semibold'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
                        : 'text-white hover:bg-green-600/30'
                  } transition-colors duration-150`}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  <span role="img" aria-label={localeNames[l as keyof typeof localeNames]} className="mr-3 text-lg">
                    {flagEmoji[l as keyof typeof flagEmoji]}
                  </span>
                  {t ? t(l) : localeNames[l as keyof typeof localeNames]}
                  {locale === l && (
                    <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 