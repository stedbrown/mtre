import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { SwissQRBill } from 'swissqrbill/pdf';
import { mm2pt } from 'swissqrbill/utils';

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
    
    // Crea una fattura di esempio
    const fatturaEsempio = {
      numero: 'ESEMPIO-001',
      data_emissione: new Date().toISOString(),
      data_scadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 giorni
      stato: 'Emessa',
      importo_totale: 1525.00,
      valuta: 'EUR',
      note: 'Questa è una fattura di esempio per mostrare come appariranno le informazioni aziendali nei documenti PDF.',
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
    const pdfBuffer = await generatePDF(fatturaEsempio, azienda);
    
    // Restituisci il PDF come risposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Fattura_Esempio.pdf"`,
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

async function generatePDF(fattura: any, azienda: any): Promise<Buffer> {
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
          Title: `Fattura ${fattura.numero}`,
          Author: azienda?.nome_azienda || 'Azienda',
          Subject: 'Fattura',
          Keywords: 'fattura, pagamento, servizi',
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
          currency: fattura.valuta || 'CHF',
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
            // Usiamo il buffer del logo prec-caricato all'inizio della funzione
            if (logoBuffer) {
              doc.image(logoBuffer, 50, 30, { width: 80 });
            } else {
              // Se non è stato possibile pre-caricare il logo, usiamo un placeholder
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
      doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold').text('FATTURA', 50, 120);
      doc.fillColor('#000000').fontSize(12).font('Helvetica').text(`N. ${fattura.numero}`, 50, 145);
      
      // --- GRIGLIA INFORMAZIONI ---
      
      // Informazioni fattura (a sinistra)
      doc.fontSize(11).font('Helvetica-Bold').text('INFORMAZIONI FATTURA', 50, 170);
      doc.font('Helvetica').fontSize(10).lineGap(4);
      doc.text(`Data emissione: ${formatDate(fattura.data_emissione)}`, 50, 190);
      doc.text(`Data scadenza: ${formatDate(fattura.data_scadenza)}`, 50, 210);
      
      // Badge stato
      let statoColor = '#9CA3AF'; // Grigio di default
      switch (fattura.stato.toLowerCase()) {
        case 'pagata':
          statoColor = '#047857'; // Verde scuro
          break;
        case 'emessa':
          statoColor = '#1E40AF'; // Blu scuro
          break;
        case 'scaduta':
          statoColor = '#B91C1C'; // Rosso scuro
          break;
      }
      
      doc.roundedRect(50, 235, 80, 18, 3).fillAndStroke(statoColor, statoColor);
      doc.fillColor('#FFFFFF').fontSize(9).text(fattura.stato.toUpperCase(), 60, 239);
      
      // Informazioni cliente (a destra)
      doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text('CLIENTE', 300, 170);
      doc.font('Helvetica').fontSize(10).lineGap(4);
      doc.text(`${fattura.cliente.nome} ${fattura.cliente.cognome || ''}`, 300, 190);
      if (fattura.cliente.indirizzo) {
        doc.text(fattura.cliente.indirizzo, 300, 210);
      }
      if (fattura.cliente.citta) {
        doc.text(`${fattura.cliente.cap || ''} ${fattura.cliente.citta} ${fattura.cliente.provincia || ''}`, 300, 230);
      }
      
      // --- TABELLA DETTAGLI ---
      
      // Linea separatrice
      doc.moveTo(50, 270).lineTo(550, 270).lineWidth(0.5).stroke(borderColor);
      
      // Tabella dettagli
      const tableTop = 290;
      const tableHeaders = ['Servizio', 'Descrizione', 'Quantità', 'Prezzo', 'Importo'];
      const tableColumnWidths = [120, 180, 60, 70, 70];
      
      // Intestazione tabella
      doc.fillColor('#FFFFFF').rect(50, tableTop - 10, 500, 25).fillAndStroke(primaryColor, primaryColor);
      let currentX = 50;
      doc.fontSize(10).font('Helvetica-Bold');
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX + 5, tableTop, { width: tableColumnWidths[i], align: 'left' });
        currentX += tableColumnWidths[i];
      });
      
      // Righe tabella
      let currentY = tableTop + 25;
      doc.fillColor('#000000').fontSize(10).font('Helvetica');
      
      fattura.dettagli.forEach((dettaglio: any, index: number) => {
        const isEvenRow = index % 2 === 0;
        if (isEvenRow) {
          doc.rect(50, currentY - 5, 500, 25).fill(lightGray);
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
        
        // Passiamo alla riga successiva
        currentY += 25;
      });
      
      // Calcolo totali
      // Linea sopra i totali
      doc.moveTo(50, currentY + 10).lineTo(550, currentY + 10).lineWidth(0.5).stroke(borderColor);
      currentY += 20;
      
      // Totale - corretto definitivamente per visualizzazione su singola riga
      doc.font('Helvetica-Bold');
      doc.fillColor(primaryColor);
      doc.text('Totale:', 300, currentY, { align: 'right', width: 100 });
      doc.text(formatCurrency(fattura.importo_totale || 0), 405, currentY, { align: 'right', width: 140 });
      doc.fillColor('#000000');
      
      // --- INFORMAZIONI DI PAGAMENTO CON QR CODE ---
      
      // Calcolo lo spazio disponibile per le informazioni di pagamento
      const availableSpaceForPayment = doc.page.height - 100 - currentY;
      
      // Se c'è poco spazio e l'IBAN è presente, mettiamo il QR code su una nuova pagina
      const needsNewPage = availableSpaceForPayment < 220 && azienda?.iban;
      
      if (needsNewPage) {
        // Se lo spazio non è sufficiente, aggiungiamo il copyright alla prima pagina
        // e creiamo una nuova pagina per il QR code
        const bottomY = doc.page.height - 30;
        doc.fontSize(8).fillColor(accentColor).text(
          `Fattura generata automaticamente il ${new Date().toLocaleString('it-CH')} - Informazioni di pagamento nella pagina seguente`,
          50, bottomY, { align: 'center', width: doc.page.width - 100 }
        );
        
        // Aggiungiamo una nuova pagina per il QR code
        doc.addPage();
        currentY = 50;
      } else {
        // Altrimenti continuiamo sulla stessa pagina
        currentY += 40;
      }
      
      // Informazioni di pagamento
      if (!needsNewPage) {
        // Aggiungiamo una separazione prima delle informazioni di pagamento
        doc.moveTo(50, currentY).lineTo(550, currentY).lineWidth(0.5).stroke(borderColor);
        currentY += 20;
      }
      
      doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Informazioni di pagamento', 50, currentY);
      currentY += 20;
      
      doc.fontSize(9).font('Helvetica').fillColor('#000000');
      
      if (azienda) {
        doc.fontSize(9).font('Helvetica-Bold').text('Coordinate bancarie:', 50, currentY);
        currentY += 15;
        
        // Usare l'IBAN salvato invece di un valore fittizio
        if (azienda.iban) {
          doc.font('Helvetica').text(`IBAN: ${azienda.iban}`, 50, currentY);
          currentY += 15;
          
          doc.text(`Intestatario: ${azienda.nome_azienda || ''}`, 50, currentY);
          currentY += 15;
          
          doc.text('Banca: Esempio Banca', 50, currentY);
          currentY += 15;
          
          const coordStartY = currentY;
          doc.text(`Importo: ${formatCurrency(fattura.importo_totale)}`, 50, currentY);
          currentY += 15;
          
          doc.text(`Riferimento: Fattura n. ${fattura.numero}`, 50, currentY);

          // Costruisci un indirizzo strutturato per il QR code
          const indirizzoStrutturato = {
            address: azienda.via || azienda.indirizzo || '',
            buildingNumber: azienda.numero_civico || '',
            zip: azienda.cap || '',
            city: azienda.citta || '',
            country: 'CH'
          };
          
          // Informazioni per il QR bill
          const qrBillData = {
            currency: fattura.valuta || 'CHF',
            amount: fattura.importo_totale,
            creditor: {
              account: azienda.iban,
              name: azienda.nome_azienda || '',
              ...indirizzoStrutturato
            },
            debtor: {
              name: `${fattura.cliente.nome} ${fattura.cliente.cognome || ''}`,
              address: fattura.cliente.indirizzo || '',
              zip: fattura.cliente.cap || '',
              city: fattura.cliente.citta || '',
              country: 'CH'
            },
            reference: `RF${fattura.numero.replace('ESEMPIO-', '').padStart(23, '0')}`,
            message: `Fattura n. ${fattura.numero}`
          };
          
          try {
            // Salviamo lo stato corrente del documento
            doc.save();
            
            // Creare il QR code e incorporarlo direttamente nel documento
            const qrBill = new SwissQRBill(qrBillData);
            
            // Spostiamo il documento alla posizione desiderata
            doc.translate(270, coordStartY - 40);
            
            // Aggiungiamo il QR code al documento
            qrBill.attachTo(doc);
            
            // Ripristiniamo lo stato del documento
            doc.restore();
          } catch (error) {
            console.error('Errore nella generazione del QR code:', error);
            
            // In caso di errore, mostriamo un placeholder
            doc.rect(350, coordStartY - 40, 150, 150).stroke(borderColor);
            doc.fontSize(10).fillColor('#B91C1C').text('QR code non disponibile', 350, coordStartY + 25, { width: 150, align: 'center' });
          }
        } else {
          // Se l'IBAN non è presente, mostrare un messaggio
          doc.fontSize(11).font('Helvetica').fillColor('#B91C1C').text(
            'Per generare il QR code svizzero, inserisci il tuo IBAN nelle impostazioni.',
            50, currentY + 30, { align: 'center', width: 500 }
          );
        }
      }
      
      // Informazioni copyright a piè di pagina, ma solo se non è già stata aggiunta
      if (!needsNewPage) {
        const bottomY = Math.min(doc.page.height - 30, currentY + 50);
        doc.fontSize(8).fillColor(accentColor).text(`Fattura generata automaticamente il ${new Date().toLocaleString('it-CH')}`, 50, bottomY, { align: 'center', width: doc.page.width - 100 });
      }
      
      // Finalizza il documento
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
} 