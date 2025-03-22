# Piano di Ottimizzazione SEO - M.T.R.E. Giardinaggio

## Priorità Alta (1-3 mesi)

### 1. Implementazione Dati Strutturati (Schema.org)
- [ ] Aggiungere JSON-LD per LocalBusiness
  ```json
  {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "name": "M.T.R.E. Giardinaggio",
    "image": "[URL_IMMAGINE]",
    "address": {...},
    "geo": {...},
    "telephone": "[TELEFONO]",
    "priceRange": "$$",
    "serviceArea": {...}
  }
  ```
- [ ] Aggiungere JSON-LD per servizi principali
- [ ] Implementare schema per recensioni
- [ ] Creare un componente riutilizzabile per l'inserimento di FAQ strutturate

### 2. Ottimizzazione Performance
- [ ] Analizzare Core Web Vitals con Lighthouse/PageSpeed Insights
- [ ] Ottimizzare tutte le immagini utilizzando next/image con priorità
- [ ] Implementare caricamento differito per contenuti sotto la piega
- [ ] Configurare font display swap e preload per i caratteri critici
- [ ] Ridurre il JavaScript non necessario

### 3. Contenuti Ottimizzati
- [ ] Rivedere e migliorare i meta title e description di ogni pagina
- [ ] Aggiungere sezioni FAQ a ogni pagina di servizio
- [ ] Migliorare la struttura dei titoli (h1, h2, h3)
- [ ] Ottimizzare il testo ALT delle immagini con keyword pertinenti

## Priorità Media (3-6 mesi)

### 4. Local SEO
- [ ] Creare pagine dedicate per ogni area geografica servita
  - [ ] Biasca
  - [ ] Bellinzona
  - [ ] Lugano
  - [ ] Locarno
- [ ] Ottimizzare Google Business Profile
- [ ] Implementare rich snippet per recensioni locali
- [ ] Aggiungere mappa interattiva con le aree servite

### 5. Link Building Interno
- [ ] Sviluppare una matrice di link tra contenuti correlati
- [ ] Implementare una sidebar con servizi correlati
- [ ] Aggiungere breadcrumbs strutturati in tutte le pagine
- [ ] Ottimizzare il footer con link alle pagine principali

### 6. Monitoraggio Avanzato
- [ ] Implementare Google Tag Manager
- [ ] Configurare eventi di conversione (richieste preventivo, chiamate, etc.)
- [ ] Installare heatmap per analisi comportamentale
- [ ] Configurare monitoraggio rank per keyword target

## Priorità Bassa (6-12 mesi)

### 7. Blog e Contenuti Freschi
- [ ] Implementare sezione blog
- [ ] Creare calendario editoriale mensile
- [ ] Produrre 3-5 articoli di alta qualità su temi di giardinaggio
- [ ] Integrare condivisione social automatica per nuovi contenuti

### 8. Social Proof
- [ ] Integrare testimonianze verificabili
- [ ] Aggiungere widget per recensioni Google
- [ ] Mostrare badge e certificazioni
- [ ] Implementare galleria dei progetti con case study

### 9. Ottimizzazione Mobile e PWA
- [ ] Migliorare esperienza mobile (menu, form, etc.)
- [ ] Implementare service worker per caching
- [ ] Configurare manifest.json per PWA
- [ ] Testare esperienza utente su vari dispositivi

### 10. Sitemaps e Indicizzazione Avanzata
- [ ] Creare sitemap separata per immagini
- [ ] Implementare news sitemap per contenuti del blog
- [ ] Ottimizzare parametri changefreq e priority
- [ ] Monitorare copertura in Google Search Console

## Strumenti Raccomandati

- **Analisi SEO**: Google Search Console, Semrush, Ahrefs
- **Performance**: Google PageSpeed Insights, GTmetrix
- **Monitoraggio**: Google Analytics 4, HotJar, Microsoft Clarity
- **Keyword Research**: Semrush, Ubersuggest, AnswerThePublic
- **Schema.org**: Schema Markup Generator, Schema App

## KPI da Monitorare

- **Visibilità organica**: Posizioni per keyword target
- **Traffico organico**: Utenti da ricerca organica
- **Conversioni**: Richieste preventivo, chiamate, form compilati
- **Performance**: Core Web Vitals
- **Engagement**: Tempo sulla pagina, frequenza di rimbalzo
- **Indicizzazione**: Pagine indicizzate, errori di scansione

## Note per Implementazione

- Ogni modifica deve mantenere l'attuale struttura multilingua
- Testare regolarmente in Google Search Console
- Mantenere coerenza stilistica e di branding
- Documentare tutti i cambiamenti per analisi successiva 