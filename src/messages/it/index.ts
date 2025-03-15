const messages = {
  navigation: {
    home: 'Home',
    services: 'Servizi',
    gallery: 'Galleria',
    testimonials: 'Testimonianze',
    contact: 'Contatti'
  },
  home: {
    hero: {
      title: 'M.T.R.E. Giardinaggio',
      subtitle: 'Trasformiamo i tuoi spazi verdi in opere d\'arte',
      cta: 'Richiedi un preventivo'
    },
    about: {
      title: 'Chi Siamo',
      description: 'M.T.R.E. è un\'azienda specializzata nella cura e manutenzione di giardini e spazi verdi. Con anni di esperienza nel settore, offriamo servizi di alta qualità per privati e aziende.'
    },
    features: {
      experience: 'Esperienza pluriennale nel settore',
      staff: 'Personale qualificato e professionale',
      quality: 'Attenzione ai dettagli e alla qualità',
      sustainable: 'Soluzioni sostenibili e rispettose dell\'ambiente'
    },
    cta: {
      title: 'Pronto a trasformare il tuo spazio verde?',
      description: 'Contattaci oggi stesso per una consulenza gratuita e scopri come possiamo aiutarti a creare il giardino dei tuoi sogni.',
      contact: 'Contattaci ora',
      gallery: 'Guarda i nostri lavori'
    },
    services: {
      design: {
        title: 'Progettazione Giardini',
        description: 'Creiamo progetti personalizzati per trasformare il tuo spazio esterno in un\'oasi di bellezza.'
      },
      maintenance: {
        title: 'Manutenzione',
        description: 'Servizi regolari di manutenzione per mantenere il tuo giardino sempre in perfette condizioni.'
      },
      irrigation: {
        title: 'Impianti di Irrigazione',
        description: 'Sistemi di irrigazione automatizzati ed efficienti per il risparmio idrico e la salute delle tue piante.'
      },
      more: 'Scopri di più',
      all: 'Tutti i nostri servizi'
    }
  },
  services: {
    title: 'I Nostri Servizi',
    description: 'Trasformiamo ogni spazio verde in un\'opera d\'arte naturale, con soluzioni personalizzate e sostenibili per ogni esigenza.',
    filters: {
      all: 'Tutti i servizi',
      residential: 'Residenziale',
      commercial: 'Commerciale',
      maintenance: 'Manutenzione'
    },
    serviceDetails: {
      features: 'Caratteristiche del servizio:',
      quote: 'Richiedi un preventivo',
      quoteDescription: 'Contattaci per ricevere un preventivo personalizzato per questo servizio.',
      contact: 'Contattaci ora',
      showMore: 'Scopri di più',
      showLess: 'Mostra meno'
    },
    items: {
      gardenDesign: {
        title: 'Progettazione Giardini',
        description: 'Creiamo spazi verdi unici che riflettono la tua personalità e valorizzano la tua proprietà. Il nostro approccio combina estetica, funzionalità e sostenibilità, con particolare attenzione all\'armonia con l\'ambiente circostante e alle tue specifiche esigenze. Ogni progetto è sviluppato con cura meticolosa, dalla consulenza iniziale alla realizzazione finale.',
        features: {
          consultation: 'Consulenza personalizzata e analisi del terreno',
          design3d: 'Progettazione 3D con visualizzazione realistica',
          plantSelection: 'Selezione botanica adatta al microclima locale',
          implementation: 'Realizzazione con materiali di prima qualità',
          supervision: 'Supervisione esperta durante tutte le fasi di lavoro'
        }
      },
      maintenance: {
        title: 'Manutenzione Professionale',
        description: 'Preserviamo la bellezza e la salute del tuo spazio verde con interventi regolari e mirati. Il nostro servizio di manutenzione comprende tutte le cure necessarie per mantenere il tuo giardino in condizioni ottimali durante tutto l\'anno, con piani personalizzati in base alle caratteristiche specifiche della tua area verde e alle tue preferenze.',
        features: {
          lawnCare: 'Cura del prato con tecniche professionali',
          diseaseControl: 'Monitoraggio e prevenzione di malattie delle piante',
          fertilization: 'Fertilizzazione organica e nutrizione mirata',
          cleaning: 'Pulizia stagionale e gestione del fogliame',
          seasonal: 'Interventi programmati secondo il ciclo naturale'
        }
      },
      irrigation: {
        title: 'Sistemi di Irrigazione',
        description: 'Progettiamo e installiamo impianti di irrigazione intelligenti che garantiscono la giusta idratazione per le tue piante, risparmiando acqua ed energia. Utilizziamo tecnologie all\'avanguardia per creare sistemi efficienti, discreti e perfettamente integrati nel paesaggio, con controlli automatizzati e sensori di umidità per un\'irrigazione ottimale.',
        features: {
          design: 'Progettazione idraulica su misura',
          installation: 'Installazione professionale con minimo impatto',
          smartControl: 'Sistemi di controllo smart con app dedicata',
          maintenance: 'Manutenzione preventiva e assistenza rapida',
          waterSaving: 'Tecnologie per il risparmio idrico fino al 60%'
        }
      },
      greenAreas: {
        title: 'Creazione Aree Verdi',
        description: 'Trasformiamo spazi inutilizzati in rigogliose oasi verdi, creando ambienti vivibili e sostenibili. Dalla preparazione del terreno alla selezione delle piante, ci occupiamo di ogni aspetto della realizzazione, garantendo risultati duraturi e di grande impatto estetico, perfettamente integrati con l\'architettura circostante.',
        features: {
          groundPreparation: 'Preparazione e bonifica professionale del terreno',
          planting: 'Piantumazione strategica per effetti scenografici',
          flowerBeds: 'Composizioni floreali stagionali e perenni',
          pathways: 'Realizzazione di percorsi e aree funzionali',
          sustainable: 'Approccio ecologico e biodiversità'
        }
      },
      treeCare: {
        title: 'Arboricoltura Specializzata',
        description: 'Ci prendiamo cura del patrimonio arboreo con interventi specializzati e rispettosi della fisiologia delle piante. I nostri arboricoltori qualificati eseguono potature, trattamenti fitosanitari e valutazioni di stabilità, garantendo la salute, la sicurezza e la bellezza dei tuoi alberi, valorizzando questi preziosi elementi del paesaggio.',
        features: {
          pruning: 'Potature conservative e formative',
          treatment: 'Trattamenti biologici e fitosanitari avanzati',
          stability: 'Analisi strumentale della stabilità',
          removal: 'Abbattimenti controllati con tecniche di tree climbing',
          consultation: 'Consulenza specialistica per la gestione arborea'
        }
      },
      lighting: {
        title: 'Illuminazione Paesaggistica',
        description: 'Esaltiamo la bellezza del tuo giardino anche dopo il tramonto con soluzioni di illuminazione suggestive e funzionali. Progettiamo sistemi di luci che creano atmosfere uniche, valorizzano gli elementi architettonici e botanici, e aumentano la sicurezza e la fruibilità degli spazi esterni nelle ore serali.',
        features: {
          design: 'Progettazione illuminotecnica personalizzata',
          ledInstallation: 'Installazione di sistemi LED ad alta efficienza',
          automation: 'Automazione e scenari luminosi programmabili',
          pathLighting: 'Illuminazione di sicurezza per percorsi',
          decorative: 'Effetti decorativi e valorizzazione botanica'
        }
      },
      excavation: {
        title: 'Scavi e Movimenti Terra',
        description: 'Realizziamo interventi professionali di scavo e movimentazione terra per preparare il terreno alla creazione di giardini e spazi verdi. Utilizziamo macchinari moderni e tecniche avanzate per garantire precisione e rispetto dell\'ambiente, creando la base perfetta per qualsiasi progetto paesaggistico.',
        features: {
          sitePreparation: 'Preparazione e analisi preliminare del sito',
          precisionExcavation: 'Scavi di precisione con macchinari specializzati',
          soilManagement: 'Gestione e riutilizzo sostenibile del terreno',
          drainage: 'Sistemi di drenaggio efficaci contro ristagni idrici',
          landscapeModeling: 'Modellazione del terreno per effetti paesaggistici'
        }
      },
      winterService: {
        title: 'Servizio Invernale',
        description: 'Offriamo un servizio completo di sgombero neve e spargimento sale per garantire la sicurezza e l\'accessibilità di strade, vialetti e aree private durante i mesi invernali. Il nostro team interviene tempestivamente con attrezzature professionali per prevenire la formazione di ghiaccio e mantenere gli spazi esterni fruibili anche nelle condizioni meteorologiche più avverse.',
        features: {
          snowRemoval: 'Sgombero neve rapido ed efficiente',
          saltSpreading: 'Spargimento sale preventivo e curativo',
          emergencyService: 'Servizio di emergenza 24/7 durante nevicate',
          contractPlans: 'Piani stagionali personalizzati',
          environmentalSafety: 'Utilizzo di prodotti ecologici e sicuri'
        }
      },
      gardenMaterials: {
        title: 'Fornitura Materiali',
        description: 'Mettiamo a disposizione una vasta gamma di materiali selezionati per la realizzazione e manutenzione del tuo giardino. Dalla terra di qualità alle piante ornamentali, dai sistemi di irrigazione agli attrezzi specializzati, offriamo solo prodotti di prima scelta, garantendo la migliore qualità per ogni elemento del tuo spazio verde.',
        features: {
          soilSubstrates: 'Terricci e substrati specifici per ogni esigenza',
          plants: 'Piante ornamentali, arbusti e alberi selezionati',
          decorativeElements: 'Elementi decorativi e finiture di pregio',
          gardenTools: 'Attrezzature e strumenti professionali',
          consultancy: 'Consulenza esperta nella scelta dei materiali'
        }
      },
      landClearing: {
        title: 'Pulizia Aree Incolte',
        description: 'Trasformiamo aree incolte e abbandonate in spazi ordinati e valorizzati, pronti per nuovi progetti. Il nostro servizio comprende la rimozione di vegetazione infestante, potature di recupero e interventi fitosanitari mirati, ripristinando la salute e la bellezza di terreni trascurati con un approccio rispettoso dell\'ecosistema locale.',
        features: {
          vegetationRemoval: 'Rimozione controllata di vegetazione infestante',
          recoveryPruning: 'Potature di recupero per piante trascurate',
          phytosanitaryTreatments: 'Trattamenti fitosanitari mirati e biologici',
          wasteManagement: 'Gestione e smaltimento sostenibile dei residui',
          landReclamation: 'Recupero e valorizzazione di terreni abbandonati'
        }
      },
      fencing: {
        title: 'Recinzioni e Pavimentazioni',
        description: 'Progettiamo e realizziamo recinzioni eleganti e funzionali, pavimentazioni resistenti e opere murarie che completano e valorizzano il tuo spazio esterno. Utilizziamo materiali di alta qualità e tecniche costruttive all\'avanguardia per creare elementi strutturali che combinano estetica, durabilità e perfetta integrazione con il paesaggio circostante.',
        features: {
          customFencing: 'Recinzioni personalizzate in diversi materiali',
          naturalPaving: 'Pavimentazioni in pietra naturale e materiali ecologici',
          masonryWorks: 'Opere murarie decorative e funzionali',
          outdoorStructures: 'Strutture esterne come pergolati e gazebo',
          sustainableMaterials: 'Utilizzo di materiali sostenibili e durevoli'
        }
      },
      turfInstallation: {
        title: 'Posa Prato a Rotoli',
        description: 'Realizziamo prati perfetti in tempi rapidi con la nostra tecnica di posa di manto erboso a rotoli. Questo metodo garantisce un risultato immediato, uniforme e di grande impatto estetico. Ci occupiamo di ogni fase del processo, dalla preparazione accurata del terreno alla posa professionale, assicurando un prato verde, sano e resistente fin dal primo giorno.',
        features: {
          soilPreparation: 'Preparazione professionale del terreno',
          qualityTurf: 'Selezione di manti erbosi di prima qualità',
          expertInstallation: 'Posa eseguita da personale specializzato',
          aftercareService: 'Servizio di cura post-installazione',
          quickResults: 'Risultato immediato e di grande impatto estetico'
        }
      },
      syntheticTurf: {
        title: 'Posa Erba Sintetica',
        description: 'Offriamo soluzioni innovative con prati sintetici di alta qualità, perfetti per aree difficili da mantenere o con scarsa disponibilità idrica. Il nostro servizio di posa di erba artificiale garantisce un risultato estetico sorprendentemente naturale, con il vantaggio di una manutenzione minima, resistenza alle intemperie e durata nel tempo, ideale per giardini moderni e aree ad alto utilizzo.',
        features: {
          highQualitySynthetic: 'Erba sintetica di ultima generazione ultra-realistica',
          professionalInstallation: 'Installazione professionale con tecniche avanzate',
          lowMaintenance: 'Manutenzione ridotta e risparmio idrico totale',
          allYearPerfection: 'Aspetto perfetto in ogni stagione',
          environmentalOptions: 'Opzioni eco-compatibili e riciclabili'
        }
      }
    },
    cta: {
      title: 'Hai bisogno di un servizio personalizzato?',
      description: 'Contattaci per discutere delle tue esigenze specifiche. Il nostro team di esperti è pronto ad aiutarti a trovare la soluzione perfetta per il tuo spazio verde.',
      button: 'Richiedi una consulenza gratuita'
    }
  },
  gallery: {
    title: 'La Nostra Galleria',
    description: 'Scopri alcuni dei nostri lavori più recenti.',
    filters: {
      all: 'Tutti',
      residential: 'Giardini Residenziali',
      terraces: 'Terrazzi',
      irrigation: 'Impianti di Irrigazione',
      maintenance: 'Manutenzione'
    },
    loadMore: 'Carica altre immagini',
    requestInfo: 'Richiedi informazioni',
    fallback: {
      image1: {
        alt: 'Giardino con prato verde e fiori',
        title: 'Giardino Villa Moderna',
        description: 'Progettazione e realizzazione di un giardino moderno per una villa privata. Il progetto include un prato all\'inglese, aiuole fiorite e un sistema di irrigazione automatizzato.'
      },
      image2: {
        alt: 'Terrazzo con piante e fiori',
        title: 'Terrazzo Urbano',
        description: 'Trasformazione di un terrazzo cittadino in un\'oasi verde. Utilizzo di vasi di design, piante resistenti alla siccità e un sistema di irrigazione a goccia.'
      },
      image3: {
        alt: 'Sistema di irrigazione automatico',
        title: 'Impianto di Irrigazione Smart',
        description: 'Installazione di un sistema di irrigazione intelligente con controllo via app e sensori di umidità per ottimizzare il consumo d\'acqua.'
      },
      image4: {
        alt: 'Potatura di alberi',
        title: 'Manutenzione Professionale',
        description: 'Servizio di potatura e cura degli alberi per un parco condominiale. Intervento realizzato da personale specializzato con tecniche di arboricoltura moderna.'
      },
      image5: {
        alt: 'Giardino con piscina',
        title: 'Giardino con Area Relax',
        description: 'Progettazione di un giardino con area piscina e zona relax. Il progetto include pavimentazione in pietra naturale, illuminazione scenografica e piante ornamentali.'
      },
      image6: {
        alt: 'Giardino roccioso',
        title: 'Giardino Roccioso',
        description: 'Creazione di un giardino roccioso con piante succulente e graminacee ornamentali. Soluzione ideale per terreni in pendenza e zone con scarsa disponibilità idrica.'
      },
      image7: {
        alt: 'Impianto di irrigazione',
        title: 'Irrigazione per Frutteto',
        description: 'Sistema di irrigazione a goccia per un frutteto privato. Progettato per massimizzare l\'efficienza idrica e garantire la salute delle piante da frutto.'
      },
      image8: {
        alt: 'Giardino con sentiero',
        title: 'Percorso Naturalistico',
        description: 'Realizzazione di un sentiero in pietra naturale immerso nel verde. Il progetto include illuminazione a basso consumo e piante aromatiche lungo il percorso.'
      }
    },
    social: {
      title: 'Seguici sui Social',
      description: 'Scopri i nostri ultimi lavori e novità seguendoci sui social media',
      instagram: 'Seguici su Instagram',
      facebook: 'Seguici su Facebook',
      contact: 'Contattaci per maggiori informazioni'
    },
    instagram: {
      title: 'La Nostra Galleria Instagram',
      description: 'Segui i nostri ultimi lavori su Instagram',
      error: 'Si è verificato un errore durante il caricamento delle immagini da Instagram. Riprova più tardi o visita direttamente il nostro profilo Instagram.',
      noMedia: {
        title: 'Nessuna immagine trovata',
        message: 'Non ci sono immagini disponibili al momento. Visita il nostro profilo Instagram per vedere i nostri lavori.'
      },
      noCaption: 'Nessuna descrizione disponibile',
      viewOnInstagram: 'Vedi su Instagram',
      uploadPhoto: 'Carica una foto',
      uploadPhotoDescription: 'Condividi una foto del tuo giardino con noi usando l\'hashtag #MTREGiardinaggio'
    }
  },
  testimonials: {
    title: 'Cosa Dicono i Nostri Clienti',
    description: 'Leggi le testimonianze dei nostri clienti soddisfatti.',
    clients: {
      client1: {
        name: 'Marco Bianchi',
        role: 'Proprietario di Villa',
        text: 'Ho affidato a M.T.R.E. la progettazione e realizzazione del giardino della mia nuova villa. Il risultato è stato eccezionale, superando di gran lunga le mie aspettative.'
      },
      client2: {
        name: 'Laura Rossi',
        role: 'Amministratore Condominiale',
        text: 'Come amministratore di condominio, ho scelto M.T.R.E. per la manutenzione delle aree verdi del nostro complesso residenziale. Il servizio è sempre puntuale e di alta qualità.'
      },
      client3: {
        name: 'Giovanni Verdi',
        role: 'Ristoratore',
        text: 'Il mio ristorante ha un bellissimo dehor con piante e fiori curati da M.T.R.E. I clienti apprezzano molto l\'atmosfera creata e spesso mi fanno i complimenti.'
      },
      client4: {
        name: 'Francesca Neri',
        role: 'Proprietaria di Casa',
        text: 'Ho un piccolo giardino che sembrava impossibile da valorizzare. Il team di M.T.R.E. ha creato un progetto su misura che ha trasformato completamente lo spazio. Ora è il mio angolo di paradiso!'
      },
      client5: {
        name: 'Roberto Marini',
        role: 'Direttore Hotel',
        text: 'La nostra catena di hotel si affida a M.T.R.E. per la manutenzione di tutti i giardini delle nostre strutture. La qualità del servizio è sempre impeccabile e contribuisce significativamente all\'immagine di lusso dei nostri hotel.'
      },
      client6: {
        name: 'Elena Martini',
        role: 'Architetto',
        text: 'Collaboro spesso con M.T.R.E. per i progetti di architettura del paesaggio. La loro competenza tecnica e la capacità di interpretare le esigenze del cliente sono davvero notevoli. Un partner affidabile e professionale.'
      },
      readMore: 'Leggi tutte le testimonianze'
    },
    cta: {
      title: 'Sei soddisfatto dei nostri servizi?',
      description: 'Lascia una recensione e condividi la tua esperienza con noi. La tua opinione è importante per aiutarci a migliorare e per far conoscere i nostri servizi ad altri clienti.',
      button: 'Lascia una Recensione'
    }
  },
  contact: {
    title: 'Contattaci',
    description: 'Siamo qui per aiutarti. Contattaci per qualsiasi domanda o richiesta.',
    info: {
      title: 'Informazioni di contatto',
      address: {
        label: 'Indirizzo',
        street: 'Via Croce 2, 6710 Biasca',
        city: 'Svizzera, Ticino'
      },
      phone: {
        label: 'Telefono',
        number: '+41 76 742 67 36'
      },
      email: {
        label: 'Email',
        address: 'emanuele.novara77@gmail.com'
      },
      hours: {
        label: 'Orari di apertura',
        weekdays: 'Lunedì - Venerdì: 8:00 - 18:00',
        saturday: 'Sabato: 9:00 - 13:00',
        sunday: 'Domenica: Chiuso'
      },
      map: 'Mappa interattiva in arrivo'
    },
    form: {
      title: 'Inviaci un Messaggio',
      name: 'Nome e Cognome',
      email: 'Email',
      phone: 'Telefono',
      subject: 'Oggetto',
      service: 'Servizio di interesse',
      selectService: 'Seleziona un servizio',
      services: {
        gardenDesign: 'Progettazione Giardini',
        maintenance: 'Manutenzione',
        irrigation: 'Impianti di Irrigazione',
        landscaping: 'Paesaggistica',
        other: 'Altro'
      },
      message: 'Messaggio',
      submit: 'Invia Messaggio',
      sending: 'Invio in corso...',
      success: 'Messaggio inviato con successo! Ti contatteremo presto.',
      error: 'Si è verificato un errore. Riprova o contattaci direttamente.',
      requiredFields: '* I campi contrassegnati sono obbligatori'
    }
  },
  footer: {
    address: {
      street: 'Via Croce 2',
      city: '6710 Biasca, Svizzera',
      phone: 'Tel: +41 76 742 67 36',
      email: 'Email: emanuele.novara77@gmail.com'
    },
    usefulLinks: 'Link Utili',
    hours: {
      title: 'Orari',
      weekdays: 'Lunedì - Venerdì: 8:00 - 18:00',
      saturday: 'Sabato: 9:00 - 13:00',
      sunday: 'Domenica: Chiuso'
    },
    social: 'Social',
    copyright: '© {year} M.T.R.E. Giardinaggio. Tutti i diritti riservati.'
  }
};

export default messages; 