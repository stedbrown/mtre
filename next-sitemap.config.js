module.exports = {
  siteUrl: 'https://mtre.ch',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/admin/**',         // Escludi tutte le pagine amministrative
    '/api/**',           // Escludi tutte le API
    '/**/modifica/**',   // Escludi tutte le pagine di modifica
    '/**/nuovo/**',      // Escludi tutte le pagine di creazione
    '/**/login/**',      // Escludi pagine di login
    '/_next/**',         // Escludi file statici interni
    '/*.json',           // Escludi file JSON
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://mtre.ch/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/*.json',
        ],
      },
    ],
  },
  alternateRefs: [
    { href: 'https://mtre.ch/en', hreflang: 'en' },
    { href: 'https://mtre.ch/de', hreflang: 'de' },
    { href: 'https://mtre.ch/fr', hreflang: 'fr' },
    { href: 'https://mtre.ch', hreflang: 'it' },
    { href: 'https://mtre.ch', hreflang: 'x-default' }, // Default per i browser che non supportano le lingue specificate
  ],
  transform: (config, url) => {
    // Sostituisce eventuali URL con mtre-giardinaggio.it con mtre.ch
    const newUrl = url.replace('https://mtre-giardinaggio.it', 'https://mtre.ch');
    
    // Elimina eventuali URL duplicati o query string
    const cleanUrl = newUrl.split('?')[0];
    
    // Configura priorità personalizzate in base all'importanza della pagina
    let priority = 0.7;
    let changefreq = 'monthly';
    
    // Verifica se l'URL contiene percorsi da escludere dalla sitemap
    if(cleanUrl.includes('/admin') || 
       cleanUrl.includes('/api') || 
       cleanUrl.includes('/_next') ||
       cleanUrl.includes('/login')) {
      return null; // Escludi questo URL dalla sitemap
    }
    
    // Homepage in tutte le lingue - massima priorità
    if(cleanUrl === 'https://mtre.ch' || cleanUrl.match(/https:\/\/mtre\.ch\/[a-z]{2}$/)) {
      priority = 1.0;
      changefreq = 'daily';
    } 
    // Pagine principali dei servizi - alta priorità
    else if(cleanUrl.includes('/services')) {
      priority = 0.9;
      changefreq = 'weekly';
    } 
    // Galleria - alta priorità (importante per conversioni)
    else if(cleanUrl.includes('/gallery')) {
      priority = 0.9;
      changefreq = 'weekly'; // Cambia spesso se aggiungi nuove foto
    } 
    // Testimonianze - priorità media-alta (importante per credibilità)
    else if(cleanUrl.includes('/testimonials')) {
      priority = 0.8;
      changefreq = 'monthly';
    } 
    // Pagina contatti - priorità alta (importante per conversioni)
    else if(cleanUrl.includes('/contact')) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Pagine di robots.txt e sitemap - priorità bassa
    else if(cleanUrl.includes('robots.txt') || cleanUrl.includes('sitemap')) {
      priority = 0.1;
      changefreq = 'monthly';
    }
    
    // Aggiusta le priorità in base alla profondità dell'URL (pagine più profonde hanno meno priorità)
    const urlDepth = (cleanUrl.match(/\//g) || []).length;
    if (urlDepth > 2 && priority > 0.5) {
      // Riduci leggermente la priorità per pagine più profonde, ma mantieni un minimo
      priority = Math.max(priority - (urlDepth - 2) * 0.1, 0.5);
    }

    // Aggiungi codice lingua all'hreflang per localizzazione avanzata
    const alternateRefs = config.alternateRefs ? [...config.alternateRefs] : [];
    
    return {
      loc: cleanUrl,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
      alternateRefs: alternateRefs,
      // Aggiunta di metadati strutturati per migliorare l'interpretazione dei motori di ricerca
      // I metadati saranno automaticamente elaborati dai crawler
    };
  },
} 