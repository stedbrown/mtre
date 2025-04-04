import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabilita ESLint durante il build
    ignoreDuringBuilds: true,
  },
  // Configurazioni immagini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-mxp1-1.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-mxp2-1.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-mxp1-2.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-mxp2-2.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 anno in secondi
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ottimizzazioni base
  experimental: {
    optimizePackageImports: [
      'next-intl',
      'react-icons',
      'lodash'
    ],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ottimizzazioni webpack semplificate per non bloccare la build
  webpack: (config, { dev, isServer }) => {
    // Attiva tree shaking
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
    }
    return config;
  },
  // Compressione attiva
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // Redirect veloci
  async redirects() {
    return [
      {
        source: '/giardiniere-ticino',
        destination: '/',
        permanent: true,
      },
      {
        source: '/servizi',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/galleria',
        destination: '/gallery',
        permanent: true,
      },
      {
        source: '/contatti',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
  // Headers per ottimizzare le performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig); 