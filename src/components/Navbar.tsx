"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Assicurarsi che il componente sia montato lato client prima di mostrare le traduzioni
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Disabilita lo scroll quando il menu mobile è aperto
  useEffect(() => {
    if (!mounted) return;
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, mounted]);

  // Traduzioni solo quando il componente è montato
  const navTranslations = mounted ? useTranslations('navigation') : null;

  // Array di oggetti per i link del menu
  const menuItems = [
    { href: '/', label: 'home' },
    { href: '/services', label: 'services' },
    { href: '/gallery', label: 'gallery' },
    { href: '/testimonials', label: 'testimonials' },
    { href: '/contact', label: 'contact' }
  ];

  // Non renderizzare nulla finché non siamo montati
  if (!mounted) {
    return (
      <nav className={`fixed w-full z-50 transition-all duration-300 bg-gradient-to-r from-green-800/90 to-green-700/90 py-2.5`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8"></div>
            <div className="hidden md:flex space-x-4">
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-1.5 backdrop-blur-sm bg-opacity-95' 
          : 'bg-gradient-to-r from-green-800/90 to-green-700/90 py-2.5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="w-8 h-8" color={isScrolled ? '#15803d' : '#ffffff'} />
            <span 
              className={`ml-2 font-bold text-lg tracking-tight ${
                isScrolled ? 'text-green-700' : 'text-white'
              }`}
            >
              M.T.R.E.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? isScrolled
                      ? 'text-green-700 bg-green-50'
                      : 'text-white bg-green-600/30'
                    : isScrolled
                    ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    : 'text-gray-100 hover:text-white hover:bg-green-600/20'
                }`}
              >
                {navTranslations?.(item.label)}
              </Link>
            ))}
            
            <div className="ml-2 pl-2 border-l border-gray-300 dark:border-gray-700">
              <LanguageSwitcher isScrolled={isScrolled} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className={`w-6 h-6 ${isScrolled ? 'text-green-700' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Tema migliorato */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-b from-green-800 to-green-700 pt-16 overflow-y-auto">
            <div className="flex justify-end p-4 absolute top-0 right-0">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-green-200 transition-colors p-2"
                aria-label="Chiudi menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col p-6">
              <div className="flex items-center mb-8 mt-4">
                <Logo className="w-10 h-10" color="#ffffff" />
                <span className="ml-3 font-bold text-xl tracking-tight text-white">
                  M.T.R.E.
                </span>
              </div>
              
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-4 px-4 text-lg ${
                    pathname === item.href
                      ? 'text-white font-bold bg-green-600/30 rounded-lg'
                      : 'text-white/90 hover:text-white hover:bg-green-600/20 rounded-lg'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label === 'home' && (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2" />
                    </svg>
                  )}
                  {item.label === 'services' && (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {item.label === 'gallery' && (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {item.label === 'testimonials' && (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )}
                  {item.label === 'contact' && (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {navTranslations?.(item.label)}
                </Link>
              ))}
              
              <div className="mt-8 pt-6 border-t border-green-600/30">
                <p className="text-white/80 text-sm mb-4">Seleziona lingua:</p>
                <LanguageSwitcher isScrolled={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 