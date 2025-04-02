'use client';

import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

// Helper function to capitalize first letter (optional, for better display)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Breadcrumbs = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Breadcrumbs');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';

  // Remove locale prefix from pathname if present
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.slice(`/${locale}`.length)
    : pathname;

  // Split path, filter out empty strings (from leading/trailing slashes)
  const pathSegments = pathWithoutLocale.split('/').filter(Boolean);

  // Generate JSON-LD structured data
  const generateBreadcrumbSchema = () => {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('home'),
        item: `${baseUrl}/${locale}`,
      },
    ];

    pathSegments.forEach((segment, index) => {
      const href = `${baseUrl}/${locale}/${pathSegments.slice(0, index + 1).join('/')}`;
      const displayName = capitalize(decodeURIComponent(segment.replace(/-/g, ' ')));
      itemListElement.push({
        '@type': 'ListItem',
        position: index + 2, // Position starts from 1, Home is 1
        name: displayName,
        item: href,
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  };

  const breadcrumbSchema = generateBreadcrumbSchema();

  // Don't show breadcrumbs on the homepage
  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <>
      {/* JSON-LD Script for SEO */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 px-4 py-2 text-sm text-green-700 dark:text-green-400">
        <ol className="list-none p-0 inline-flex items-center space-x-2">
          <li className="flex items-center">
            <Link href={`/${locale}`} className="hover:text-green-800 dark:hover:text-green-300 transition-colors">
              {t('home')}
            </Link>
          </li>
          {pathSegments.map((segment, index) => {
            const href = `/${locale}/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;

            // Decode URI component for display (e.g., %20 -> space) and capitalize
            const displayName = capitalize(decodeURIComponent(segment.replace(/-/g, ' '))); // Replace hyphens with spaces for readability

            return (
              <li key={href} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-gray-700 dark:text-gray-400 font-medium" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-green-800 dark:hover:text-green-300 transition-colors">
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs; 