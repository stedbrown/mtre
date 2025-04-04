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
      
      // Aumenta il livello di compressione
      config.optimization.minimize = true;
      
      // Configurazione del Terser per minimizzazione più aggressiva
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,        // Rimuove console.log
              pure_funcs: ['console.info', 'console.debug', 'console.warn'],
              passes: 2,                 // Esegue più passaggi di ottimizzazione
              unsafe_arrows: true,      // Ottimizza le arrow functions
              reduce_vars: true,        // Ottimizza l'uso delle variabili
              booleans_as_integers: true // Ottimizza i boolean
            },
            mangle: true,
            output: {
              comments: false,          // Rimuove tutti i commenti
            }
          }
        }),
      ];
      
      // Configurazione splitChunks ottimizzata per ridurre vendors.js
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        minSize: 10000,    // Ridotto per creare chunk più piccoli
        maxSize: 150000,   // Limite massimo di 150KB per chunk
        cacheGroups: {
          // Separa React in un chunk specifico
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store|next\/dist\/compiled\/react)[\\/]/,
            name: 'react',
            priority: 40,
            chunks: 'all',
          },
          // Separa gli strumenti di internazionalizzazione
          intl: {
            test: /[\\/]node_modules[\\/](next-intl|intl-messageformat|@formatjs)[\\/]/,
            name: 'intl',
            priority: 35,
            chunks: 'all',
          },
          // Pacchetti UI comuni
          ui: {
            test: /[\\/]node_modules[\\/](react-icons|tailwindcss)[\\/]/,
            name: 'ui',
            priority: 30,
            chunks: 'all',
          },
          // Librerie utility
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|uuid)[\\/]/,
            name: 'utils',
            priority: 25,
            chunks: 'all', 
          },
          // Altri node_modules divisi in chunk più piccoli
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Estrai il nome del pacchetto da node_modules
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1] || 'misc';
              // Usa solo il nome principale del pacchetto per evitare troppi chunk
              const mainPackage = packageName.split('/')[0].replace('@', '');
              return `vendor.${mainPackage}`;
            },
            priority: 20,
            chunks: 'async', // Solo per chunk asincroni (non critici)
            minSize: 15000,
            maxSize: 100000,
          },
          // Codice riutilizzato in più pagine
          commons: {
            name: 'commons',
            minChunks: 2,        // Minimo numero di chunk che usano il codice
            priority: 10,
            reuseExistingChunk: true,
          }
        },
      };
      
      // Aggiungi plugin per analizzare la dimensione del bundle (solo durante lo sviluppo locale)
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
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