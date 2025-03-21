import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Rimuovo la definizione di fontPath che causa problemi
// const fontPath = path.join(process.cwd(), 'node_modules', 'pdfkit', 'js', 'data');

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Ottieni i dati dell'azienda
    const { data: azienda, error: aziendaError } = await supabase
      .from('azienda_info')
      .select('*')
      .single();
    
    if (aziendaError) {
      console.error('Errore nel recupero dei dati aziendali:', aziendaError);
      // Continuiamo comunque, anche senza i dati aziendali
    }
    
    // Crea un preventivo di esempio
    const preventivoEsempio = {
      numero: 'ESEMPIO-001',
      data_emissione: new Date().toISOString(),
      data_scadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 giorni
      stato: 'Inviato',
      importo_totale: 1525.00,
      valuta: 'EUR',
      note: 'Questo è un preventivo di esempio per mostrare come appariranno le informazioni aziendali nei documenti PDF.',
      cliente: {
        nome: 'Mario',
        cognome: 'Rossi',
        indirizzo: 'Via Roma 123',
        cap: '00100',
        citta: 'Roma',
        provincia: 'RM',
        email: 'mario.rossi@esempio.it',
        telefono: '+39 123 456 7890'
      },
      dettagli: [
        {
          id: '1',
          descrizione: 'Sviluppo sito web',
          quantita: 1,
          prezzo_unitario: 800.00,
          importo: 800.00,
          servizio: { nome: 'Sviluppo Web' }
        },
        {
          id: '2',
          descrizione: 'Configurazione hosting e dominio',
          quantita: 1,
          prezzo_unitario: 150.00,
          importo: 150.00,
          servizio: { nome: 'Hosting' }
        },
        {
          id: '3',
          descrizione: 'Manutenzione mensile',
          quantita: 3,
          prezzo_unitario: 100.00,
          importo: 300.00,
          servizio: { nome: 'Manutenzione' }
        },
        {
          id: '4',
          descrizione: 'Ottimizzazione SEO',
          quantita: 1,
          prezzo_unitario: 275.00,
          importo: 275.00,
          servizio: { nome: 'SEO' }
        }
      ]
    };
    
    // Crea un nuovo documento PDF
    const pdfBuffer = await generatePDF(preventivoEsempio, azienda);
    
    // Restituisci il PDF come risposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Preventivo_Esempio.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Errore durante la generazione del PDF di esempio:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la generazione del PDF di esempio', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function generatePDF(preventivo: any, azienda: any): Promise<Buffer> {
  // Prepara il buffer del logo se esiste
  let logoBuffer: Buffer | null = null;
  if (azienda?.logo_url) {
    try {
      const logoResponse = await fetch(azienda.logo_url);
      const arrayBuffer = await logoResponse.arrayBuffer();
      logoBuffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Errore nel pre-caricamento del logo:', error);
    }
  }

  return new Promise((resolve, reject) => {
    try {
      // Crea un buffer per il PDF
      const chunks: Buffer[] = [];
      
      // Crea un nuovo documento PDF senza specificare font
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        autoFirstPage: true,
        layout: 'portrait', // Esplicitamente imposto il layout a portrait
        pdfVersion: '1.7', // Uso una versione recente del PDF
        compress: true,
        // Assicuro che il documento sia limitato a una sola pagina
        bufferPages: false, // Disabilito il buffer delle pagine multiple
        // Non specificare l'opzione font per evitare errori con Turbopack
        info: {
          Title: `Preventivo ${preventivo.numero}`,
          Author: azienda?.nome_azienda || 'Azienda',
          Subject: 'Preventivo',
          Keywords: 'preventivo, offerta, servizi',
          Creator: 'Sistema Gestionale',
          Producer: 'PDFKit'
        }
      });
      
      // Raccogli i chunk del PDF
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Formatta la data
      const formatDate = (dateString: string) => {
        if (!dateString) return 'Data non specificata';
        
        try {
          const date = new Date(dateString);
          
          // Verifica se la data è valida
          if (isNaN(date.getTime())) {
            console.error('Data non valida:', dateString);
            return 'Data non valida';
          }
          
          return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        } catch (error) {
          console.error('Errore nella formattazione della data:', error);
          return 'Errore data';
        }
      };
      
      // Formatta la valuta
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-CH', {
          style: 'currency',
          currency: preventivo.valuta || 'CHF',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      };
      
      // Colori - Utilizziamo colori più sobri
      const primaryColor = '#4B5563'; // Grigio scuro
      const accentColor = '#6B7280'; // Grigio medio
      const lightGray = '#F3F4F6'; // Grigio chiaro per sfondi
      const borderColor = '#D1D5DB'; // Grigio per bordi
      
      // --- INTESTAZIONE DOCUMENTO ---
      
      // Logo (se disponibile)
      try {
        if (azienda?.logo_url) {
          // Se l'URL è assoluto, utilizziamo fetch
          if (azienda.logo_url.startsWith('http')) {
            // Usiamo il buffer del logo che abbiamo già pre-caricato
            if (logoBuffer) {
              doc.image(logoBuffer, 50, 30, { width: 80 });
            } else {
              // Fallback se il buffer del logo non è disponibile
              doc.rect(50, 30, 80, 40).fillAndStroke(lightGray, borderColor);
              doc.fillColor(accentColor).fontSize(10).text('LOGO', 70, 45);
            }
          } else {
            // Se è un percorso locale, proviamo a caricarlo direttamente
            try {
              doc.image(azienda.logo_url, 50, 30, { width: 80 });
            } catch (logoError) {
              console.error('Errore nel caricamento del logo locale:', logoError);
              doc.rect(50, 30, 80, 40).fillAndStroke(lightGray, borderColor);
              doc.fillColor(accentColor).fontSize(10).text('LOGO', 70, 45);
            }
          }
        } else {
          // Non carichiamo immagini locali per evitare problemi di percorso
          doc.rect(50, 30, 80, 40).fillAndStroke(lightGray, borderColor);
          doc.fillColor(accentColor).fontSize(10).text('LOGO', 70, 45);
        }
      } catch (error) {
        console.error('Errore nel caricamento del logo:', error);
        // Continuiamo senza logo
        doc.rect(50, 30, 80, 40).fillAndStroke(lightGray, borderColor);
        doc.fillColor(accentColor).fontSize(10).text('LOGO', 70, 45);
      }
      
      // Intestazione azienda
      if (azienda) {
        doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text(azienda.nome_azienda || 'Azienda', 145, 30);
        doc.fontSize(9).font('Helvetica').fillColor('#000000');
        doc.text(azienda.indirizzo || '', 145, 50);
        doc.text(`${azienda.cap || ''} ${azienda.citta || ''} ${azienda.cantone || ''}`, 145, 62);
        doc.text(`Tel: ${azienda.telefono || ''} - Email: ${azienda.email || ''}`, 145, 74);
      }
      
      // Linea separatrice orizzontale - spostata più in basso per evitare sovrapposizioni con il logo
      doc.moveTo(50, 110).lineTo(550, 110).lineWidth(0.5).stroke(borderColor);
      
      // Titolo documento
      doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold').text('PREVENTIVO', 50, 120);
      doc.fillColor('#000000').fontSize(12).font('Helvetica').text(`N. ${preventivo.numero}`, 50, 145);
      
      // --- GRIGLIA INFORMAZIONI ---
      
      // Informazioni preventivo (a sinistra)
      doc.fontSize(11).font('Helvetica-Bold').text('INFORMAZIONI PREVENTIVO', 50, 170);
      doc.font('Helvetica').fontSize(10).lineGap(4);
      doc.text(`Data emissione: ${formatDate(preventivo.data_emissione)}`, 50, 190);
      doc.text(`Validità fino al: ${formatDate(preventivo.data_scadenza)}`, 50, 210);
      
      // Badge stato
      let statoColor = '#9CA3AF'; // Grigio di default
      switch (preventivo.stato.toLowerCase()) {
        case 'accettato':
          statoColor = '#047857'; // Verde scuro
          break;
        case 'inviato':
          statoColor = '#1E40AF'; // Blu scuro
          break;
        case 'rifiutato':
          statoColor = '#B91C1C'; // Rosso scuro
          break;
      }
      
      doc.roundedRect(50, 235, 80, 18, 3).fillAndStroke(statoColor, statoColor);
      doc.fillColor('#FFFFFF').fontSize(9).text(preventivo.stato.toUpperCase(), 60, 239);
      
      // Informazioni cliente (a destra)
      doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text('CLIENTE', 300, 170);
      doc.font('Helvetica').fontSize(10).lineGap(4);
      doc.text(`${preventivo.cliente.nome} ${preventivo.cliente.cognome || ''}`, 300, 190);
      if (preventivo.cliente.indirizzo) {
        doc.text(preventivo.cliente.indirizzo, 300, 210);
      }
      if (preventivo.cliente.citta) {
        doc.text(`${preventivo.cliente.cap || ''} ${preventivo.cliente.citta} ${preventivo.cliente.provincia || ''}`, 300, 230);
      }
      
      // --- TABELLA DETTAGLI ---
      
      // Linea separatrice
      doc.moveTo(50, 270).lineTo(550, 270).lineWidth(0.5).stroke(borderColor);
      
      // Ottimizzazione dello spazio - riduciamo le dimensioni della tabella per risparmiare spazio
      // Tabella dettagli
      const tableTop = 280;
      const tableHeaders = ['Servizio', 'Descrizione', 'Quantità', 'Prezzo', 'Importo'];
      const tableColumnWidths = [100, 200, 50, 70, 70];
      
      // Intestazione tabella - compattata
      doc.fillColor('#FFFFFF').rect(50, tableTop - 10, 500, 20).fillAndStroke(primaryColor, primaryColor);
      let currentX = 50;
      doc.fontSize(9).font('Helvetica-Bold');
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX + 5, tableTop - 5, { width: tableColumnWidths[i], align: 'left' });
        currentX += tableColumnWidths[i];
      });
      
      // Righe tabella - compattate
      let currentY = tableTop + 20;
      doc.fillColor('#000000').fontSize(9).font('Helvetica');
      
      preventivo.dettagli.forEach((dettaglio: any, index: number) => {
        const isEvenRow = index % 2 === 0;
        if (isEvenRow) {
          doc.rect(50, currentY - 5, 500, 20).fill(lightGray);
        }
        
        currentX = 50;
        doc.fillColor('#000000');
        
        // Servizio
        doc.text(dettaglio.servizio?.nome || 'Servizio', currentX + 5, currentY, {
          width: tableColumnWidths[0] - 10,
          align: 'left'
        });
        currentX += tableColumnWidths[0];
        
        // Descrizione
        doc.text(dettaglio.descrizione || '', currentX + 5, currentY, {
          width: tableColumnWidths[1] - 10,
          align: 'left'
        });
        currentX += tableColumnWidths[1];
        
        // Quantità
        doc.text(dettaglio.quantita?.toString() || '1', currentX + 5, currentY, {
          width: tableColumnWidths[2] - 10,
          align: 'center'
        });
        currentX += tableColumnWidths[2];
        
        // Prezzo unitario
        doc.text(formatCurrency(dettaglio.prezzo_unitario || 0), currentX + 5, currentY, {
          width: tableColumnWidths[3] - 10,
          align: 'right'
        });
        currentX += tableColumnWidths[3];
        
        // Importo
        doc.text(formatCurrency(dettaglio.importo || 0), currentX + 5, currentY, {
          width: tableColumnWidths[4] - 10,
          align: 'right'
        });
        
        // Passiamo alla riga successiva - ridotta per compattare
        currentY += 20;
      });
      
      // Calcolo totali
      // Linea sopra i totali
      doc.moveTo(50, currentY + 10).lineTo(550, currentY + 10).lineWidth(0.5).stroke(borderColor);
      currentY += 20;
      
      // Totale - corretto definitivamente per visualizzazione su singola riga
      doc.font('Helvetica-Bold');
      doc.fillColor(primaryColor);
      doc.text('Totale:', 300, currentY, { align: 'right', width: 100 });
      doc.text(formatCurrency(preventivo.importo_totale || 0), 405, currentY, { align: 'right', width: 140 });
      doc.fillColor('#000000');
      
      // Note del preventivo - compattate
      if (preventivo.note) {
        currentY += 20;
        doc.font('Helvetica-Bold').fontSize(10).text('Note:', 50, currentY);
        currentY += 15;
        doc.font('Helvetica').fontSize(9).text(preventivo.note, 50, currentY, {
          width: 500,
          align: 'left'
        });
      }
      
      // Verifica dello spazio - se abbiamo più di 650px di altezza, ridurremo tutto per stare in una pagina
      const remainingSpace = doc.page.height - 100 - currentY;
      
      // Informazioni finali e condizioni - adattate in base allo spazio disponibile
      const spacingForFinalInfo = Math.min(remainingSpace, 40);
      currentY += spacingForFinalInfo;
      
      // Calcolo dello spazio necessario per il testo finale
      const finalTextHeight = 70; // Altezza stimata per tutti i testi finali
      
      // Verifico se c'è spazio sufficiente per tutto il testo restante
      const availableSpace = doc.page.height - 50 - currentY;
      
      if (availableSpace >= finalTextHeight) {
        // C'è spazio sufficiente, mostro tutti i testi
        doc.font('Helvetica').fontSize(9).fillColor(accentColor);
        doc.text('Il presente preventivo ha validità di 30 giorni dalla data di emissione.', 50, currentY, {
          width: 500,
          align: 'center'
        });
        
        // Ringraziamenti
        currentY += 15;
        doc.fillColor(accentColor);
        doc.text('Grazie per averci scelto. Siamo a disposizione per eventuali chiarimenti o modifiche.', 50, currentY, {
          width: 500,
          align: 'center'
        });
        
        // Condizioni di pagamento
        currentY += 15;
        doc.text('Condizioni di pagamento: 30% all\'accettazione, saldo alla consegna.', 50, currentY, {
          width: 500,
          align: 'center'
        });
        
        // Informazioni copyright a piè di pagina - posizionate in modo da stare nella prima pagina
        const bottomY = Math.min(doc.page.height - 30, currentY + 40);
        doc.fontSize(8).fillColor(accentColor).text(`Preventivo generato automaticamente il ${new Date().toLocaleString('it-CH')}`, 50, bottomY, { align: 'center', width: doc.page.width - 100 });
      } else {
        // Spazio limitato, mostro solo le informazioni essenziali
        doc.font('Helvetica').fontSize(9).fillColor(accentColor);
        doc.text('Il presente preventivo ha validità di 30 giorni dalla data di emissione.', 50, currentY, {
          width: 500,
          align: 'center'
        });
        
        // Informazioni copyright a piè di pagina - posizionate in modo da stare nella prima pagina
        const bottomY = Math.min(doc.page.height - 30, currentY + 25);
        doc.fontSize(8).fillColor(accentColor).text(`Preventivo generato automaticamente il ${new Date().toLocaleString('it-CH')}`, 50, bottomY, { align: 'center', width: doc.page.width - 100 });
      }
      
      // Impostazione per evitare la creazione di una nuova pagina
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
} 