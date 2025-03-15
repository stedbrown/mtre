"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {[
              { href: '/', label: t('home') },
              { href: '/services', label: t('services') },
              { href: '/gallery', label: t('gallery') },
              { href: '/testimonials', label: t('testimonials') },
              { href: '/contact', label: t('contact') }
            ].map((item) => (
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
                {item.label}
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
          <div className="md:hidden mt-2 pb-2 border-t border-gray-200 dark:border-gray-700">
            <div className="pt-2 pb-2 space-y-1">
              {[
                { href: '/', label: t('home') },
                { href: '/services', label: t('services') },
                { href: '/gallery', label: t('gallery') },
                { href: '/testimonials', label: t('testimonials') },
                { href: '/contact', label: t('contact') }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-1.5 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? isScrolled
                        ? 'text-green-700 bg-green-50'
                        : 'text-white bg-green-600/30'
                      : isScrolled
                      ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                      : 'text-gray-100 hover:text-white hover:bg-green-600/20'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 pb-2 border-t border-gray-200 dark:border-gray-700">
              <LanguageSwitcher isScrolled={isScrolled} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 