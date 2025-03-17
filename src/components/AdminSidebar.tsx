'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';
import { HomeIcon, UsersIcon, DocumentTextIcon, CurrencyEuroIcon, WrenchScrewdriverIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  // Chiudi il menu quando la finestra viene ridimensionata
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  // Verifichiamo i link nella sidebar
  const menuItems = [
    { 
      name: 'Dashboard', 
      href: `/${locale}/admin/dashboard`, 
      icon: <HomeIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Clienti', 
      href: `/${locale}/admin/clienti`, 
      icon: <UsersIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Preventivi', 
      href: `/${locale}/admin/preventivi`, 
      icon: <DocumentTextIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Fatture', 
      href: `/${locale}/admin/fatture`, 
      icon: <CurrencyEuroIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Servizi', 
      href: `/${locale}/admin/servizi`, 
      icon: <WrenchScrewdriverIcon className="h-5 w-5" /> 
    },
    { 
      name: 'Impostazioni', 
      href: `/${locale}/admin/impostazioni`, 
      icon: <Cog6ToothIcon className="h-5 w-5" /> 
    }
  ];

  return (
    <>
      {/* Header mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-gray-800">MTRE Admin</span>
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Apri menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      
      {/* Overlay per mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
          onClick={toggleMobileMenu}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-30 md:z-0 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center flex-shrink-0 px-4 py-5 md:hidden">
            <span className="text-xl font-semibold text-gray-800">MTRE Admin</span>
            <button
              type="button"
              className="ml-auto text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Chiudi menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex items-center flex-shrink-0 px-4 py-5">
            <span className="text-xl font-semibold text-gray-800">MTRE Admin</span>
          </div>
          
          <div className="flex flex-col flex-grow px-4 mt-2">
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md group transition-colors ${
                    isActive(item.href) 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <svg className={`w-5 h-5 mr-3 ${
                    isActive(item.href) ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
                  } transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {item.icon}
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
} 