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
  // Configurazione webpack migliorata per PageSpeed
  webpack: (config, { dev, isServer }) => {
    // Manteniamo moduleIds deterministici per caching migliore
    config.optimization.moduleIds = 'deterministic';
    
    if (!dev && !isServer) {
      // Ottimizzazioni solo per la build di produzione lato client
      
      // Attiva il tree shaking per ridurre dimensioni bundle
      config.optimization.usedExports = true;
      
      // Configurazione splitChunks ottimizzata per LCP
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        minSize: 15000,
        cacheGroups: {
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            chunks: 'all',
          },
          commons: {
            name: 'commons',
            minChunks: 3,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'async',
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1] || 'vendors';
              return `lib.${packageName.replace('@', '')}`;
            },
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
    ];
  },
};

export default withNextIntl(nextConfig); 