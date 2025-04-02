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
    // Forza il dominio mtre.ch se necessario
    // Questa è una soluzione più robusta che sostituisce tutti i domini
    
    const correctDomain = 'https://mtre.ch';
    const oldDomain = /https?:\/\/mtre-giardinaggio\.it/g;
    
    // Estrai il percorso dall'URL originale rimuovendo qualsiasi dominio
    let path = url.replace(/^https?:\/\/[^\/]+/i, '');
    
    // Se il percorso non inizia con /, aggiungilo
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Crea un nuovo URL con il dominio corretto
    let newUrl = correctDomain + path;
    
    // Per sicurezza, assicuriamoci di sostituire qualsiasi riferimento rimanente al vecchio dominio
    newUrl = newUrl.replace(oldDomain, correctDomain);
    
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
    if(cleanUrl === correctDomain || cleanUrl.match(new RegExp(`${correctDomain}/[a-z]{2}$`))) {
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

    // Verifica finale: assicurati che l'URL inizi con il dominio corretto
    if (!cleanUrl.startsWith(correctDomain)) {
      // Se per qualche motivo l'URL non inizia con il dominio corretto, lo correggiamo
      console.warn(`URL non corretto rilevato: ${cleanUrl}, verrà corretto`);
      return {
        loc: correctDomain + (cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl),
        changefreq: changefreq,
        priority: priority,
        lastmod: new Date().toISOString(),
        alternateRefs: config.alternateRefs ? [...config.alternateRefs] : [],
      };
    }

    return {
      loc: cleanUrl,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ? [...config.alternateRefs] : [],
    };
  },
} 