module.exports = {
  siteUrl: 'https://mtre.ch',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  alternateRefs: [
    {
      href: 'https://mtre.ch/en',
      hreflang: 'en',
    },
    {
      href: 'https://mtre.ch/de',
      hreflang: 'de',
    },
    {
      href: 'https://mtre.ch/fr',
      hreflang: 'fr',
    },
    {
      href: 'https://mtre.ch',
      hreflang: 'it',
    },
  ],
  transform: (config, url) => {
    // Sostituisce eventuali URL con mtre-giardinaggio.it con mtre.ch
    const newUrl = url.replace('https://mtre-giardinaggio.it', 'https://mtre.ch');
    return {
      loc: newUrl,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
} 