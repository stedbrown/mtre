import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabilita ESLint durante il build
    ignoreDuringBuilds: true,
  },
  // Configurazioni aggiuntive qui
  serverExternalPackages: ["pdfkit"],
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
  },
  // Ottimizzazioni per le prestazioni
  experimental: {
    // Rimuoviamo optimizeCss perché non è supportato in Next.js 15.2.2
    optimizePackageImports: [
      'next-intl',
      'react-icons',
      'lodash'
    ],
    // Miglioramenti per prestazioni e build
    serverActions: {
      bodySizeLimit: '2mb',
    },
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
  },
  // Ottimizzazione per browser moderni
  webpack: (config, { isServer }) => {
    config.optimization.moduleIds = 'deterministic';
    
    // Disabilita il code splitting sul server per evitare errori "self is not defined"
    if (isServer) {
      config.optimization.splitChunks = false;
    } else {
      // Configurazione splitChunks solo per il client
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  // Compress JS/HTML
  compress: true,
  // Ottimizzazioni per le immagini
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
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
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
    ];
  },
};

export default withNextIntl(nextConfig); 