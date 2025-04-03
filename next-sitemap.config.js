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
      'https://mtre.ch/sitemap-image.xml',  // Aggiungiamo sitemap delle immagini
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
    { href: 'https://mtre.ch/it', hreflang: 'it' },
    { href: 'https://mtre.ch', hreflang: 'x-default' },
  ],
  // Configurazione per generare sitemap delle immagini
  additionalPaths: async (config) => {
    const result = [];
    
    // Aggiungi sitemap specifica per le immagini
    const imageUrls = [
      // Immagini di servizi
      { url: '/images/services/garden-design.avif', title: 'Progettazione Giardini', caption: 'Servizi di progettazione giardini in Ticino' },
      { url: '/images/services/maintenance.avif', title: 'Manutenzione Giardini', caption: 'Servizi di manutenzione ordinaria e straordinaria in Ticino' },
      { url: '/images/services/irrigation.avif', title: 'Impianti di Irrigazione', caption: 'Sistemi di irrigazione automatizzati in Ticino' },
      { url: '/images/services/green-areas.avif', title: 'Aree Verdi', caption: 'Creazione e manutenzione di aree verdi in Ticino' },
      { url: '/images/services/lighting.avif', title: 'Illuminazione Giardini', caption: 'Installazione e progettazione illuminazione per giardini in Ticino' },
      { url: '/images/services/tree-care.avif', title: 'Cura degli Alberi', caption: 'Servizi di potatura, trattamento e cura degli alberi in Ticino' },
      { url: '/images/mtregiardinaggio.avif', title: 'M.T.R.E. Giardinaggio - Team', caption: 'Team di professionisti del giardinaggio in Ticino' },
      { url: '/images/hero/home-new.avif', title: 'M.T.R.E. Giardinaggio', caption: 'Servizi di giardinaggio professionali in Ticino' },
      { url: '/images/hero/gallery-new.avif', title: 'Galleria M.T.R.E. Giardinaggio', caption: 'Galleria fotografica dei nostri progetti in Ticino' },
      { url: '/images/hero/testimonials-new.avif', title: 'Testimonianze M.T.R.E. Giardinaggio', caption: 'Cosa dicono i nostri clienti dei nostri servizi' },
      { url: '/images/hero/contact-new.avif', title: 'Contatta M.T.R.E. Giardinaggio', caption: 'Informazioni di contatto per i nostri servizi di giardinaggio' },
      { url: '/images/hero/services-new.avif', title: 'Servizi M.T.R.E. Giardinaggio', caption: 'I nostri servizi di giardinaggio in Ticino' },
    ];
    
    // Crea URL per la sitemap delle immagini
    for (const imgUrl of imageUrls) {
      result.push({
        loc: `https://mtre.ch/gallery`, // Link alla pagina della galleria
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
        alternateRefs: config.alternateRefs ?? [],
        img: [{
          url: `https://mtre.ch${imgUrl.url}`,
          title: imgUrl.title,
          caption: imgUrl.caption,
          geoLocation: 'Ticino, Svizzera',
          license: 'https://mtre.ch/license' // URL fittizio per la licenza
        }]
      });
    }
    
    return result;
  },
  transform: (config, url) => {
    // Forza il dominio mtre.ch se necessario
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
    if(cleanUrl === correctDomain) {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Pagine in lingua specifiche
    else if(cleanUrl.match(new RegExp(`${correctDomain}/[a-z]{2}$`))) {
      priority = 0.9;
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
    // Pagina contatti - alta priorità (importante per conversioni)
    else if(cleanUrl.includes('/contact')) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Pagine di robots.txt e sitemap - priorità bassa
    else if(cleanUrl.includes('robots.txt') || cleanUrl.includes('sitemap')) {
      priority = 0.1;
      changefreq = 'monthly';
    }
    
    // Gestisci le priorità in base alla lingua (inglese e italiano più importanti)
    if(cleanUrl.includes('/en/') || cleanUrl.includes('/it/')) {
      priority = Math.min(priority + 0.05, 1.0); // Aumenta ma massimo 1.0
    }
    
    // Aggiusta le priorità in base alla profondità dell'URL (pagine più profonde hanno meno priorità)
    const urlDepth = (cleanUrl.match(/\//g) || []).length;
    if (urlDepth > 2 && priority > 0.5) {
      // Riduci leggermente la priorità per pagine più profonde, ma mantieni un minimo
      priority = Math.max(priority - (urlDepth - 2) * 0.1, 0.5);
    }

    // Verifica finale: assicurati che l'URL inizi con il dominio corretto
    if (!cleanUrl.startsWith(correctDomain)) {
      console.warn(`URL non corretto rilevato: ${cleanUrl}, verrà corretto`);
      return {
        loc: correctDomain + (cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl),
        changefreq: changefreq,
        priority: priority,
        lastmod: new Date().toISOString(),
        alternateRefs: generateCorrectAlternateRefs(cleanUrl),
      };
    }
    
    // Genera riferimenti hreflang corretti per ogni URL
    const alternateRefs = generateCorrectAlternateRefs(cleanUrl);
    
    // Output con informazioni complete e ottimizzate
    return {
      loc: cleanUrl,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
      alternateRefs: alternateRefs,
    };
  },
};

// Funzione per generare riferimenti alternativi corretti basati sul percorso
function generateCorrectAlternateRefs(url) {
  const baseUrl = 'https://mtre.ch';
  
  // Estrai il percorso relativo dall'URL completo
  const relativePath = url.replace(/^https?:\/\/[^\/]+/i, '');
  
  // Determina il percorso senza il prefisso della lingua (se presente)
  let pathWithoutLocale = relativePath;
  const localeMatch = relativePath.match(/^\/+(it|en|de|fr)\//);
  
  if (localeMatch) {
    // Rimuovi il prefisso della lingua dal percorso
    pathWithoutLocale = relativePath.substring(localeMatch[0].length - 1);
  } else if (relativePath === '/it' || relativePath === '/en' || 
            relativePath === '/de' || relativePath === '/fr') {
    // Se è solo un prefisso di lingua, il percorso senza locale è la radice
    pathWithoutLocale = '/';
  }
  
  // Se è la pagina radice, gestiscila in modo speciale
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    return [
      { href: `${baseUrl}/en`, hreflang: 'en' },
      { href: `${baseUrl}/de`, hreflang: 'de' },
      { href: `${baseUrl}/fr`, hreflang: 'fr' },
      { href: `${baseUrl}/it`, hreflang: 'it' },
      { href: baseUrl, hreflang: 'x-default' }
    ];
  }
  
  // Altrimenti, genera versioni per ogni lingua
  return [
    { href: `${baseUrl}/en${pathWithoutLocale}`, hreflang: 'en' },
    { href: `${baseUrl}/de${pathWithoutLocale}`, hreflang: 'de' },
    { href: `${baseUrl}/fr${pathWithoutLocale}`, hreflang: 'fr' },
    { href: `${baseUrl}/it${pathWithoutLocale}`, hreflang: 'it' },
    { href: `${baseUrl}${pathWithoutLocale}`, hreflang: 'x-default' }
  ];
} 