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
            className="md:hidden p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-5 h-5 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 pt-16">
            <div className="flex justify-end p-4 absolute top-0 right-0">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-800 dark:text-gray-200 hover:text-green-600 transition-colors"
                aria-label="Close menu"
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
            
            <div className="flex flex-col p-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 text-lg ${
                    pathname === item.href
                      ? 'text-green-600 font-bold'
                      : 'text-gray-800 dark:text-gray-200'
                  } hover:text-green-600 transition-colors border-b border-gray-100`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navTranslations?.(item.label)}
                </Link>
              ))}
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <LanguageSwitcher isScrolled={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 