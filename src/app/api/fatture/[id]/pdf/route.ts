import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { SwissQRBill } from 'swissqrbill/pdf';
import { mm2pt } from 'swissqrbill/utils';

// Rimuovo la definizione di fontPath che causa problemi
// const fontPath = path.join(process.cwd(), 'node_modules', 'pdfkit', 'js', 'data');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Ottieni i dati della fattura
    const { data: fattura, error: fatturaError } = await supabase
      .from('fatture')
      .select(`
        *,
        cliente:cliente_id(*),
        dettagli:dettagli_fattura(
          *,
          servizio:servizio_id(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (fatturaError || !fattura) {
      console.error('Errore nel recupero della fattura:', fatturaError);
      return NextResponse.json(
        { error: 'Fattura non trovata' },
        { status: 404 }
      );
    }
    
    // Ottieni i dati dell'azienda
    const { data: azienda, error: aziendaError } = await supabase
      .from('azienda_info')
      .select('*')
      .single();
    
    if (aziendaError) {
      console.error('Errore nel recupero dei dati aziendali:', aziendaError);
      // Continuiamo comunque, anche senza i dati aziendali
    }
    
    // Crea un nuovo documento PDF
    const pdfBuffer = await generatePDF(fattura, azienda);
    
    // Restituisci il PDF come risposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Fattura_${fattura.numero}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Errore durante la generazione del PDF:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la generazione del PDF', details: error instanceof Error ? error.message : String(error) },
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
        if (logoBuffer) {
          // Usa il logo caricato dall'utente - ridotto a 80px di larghezza
          doc.image(logoBuffer, 50, 30, { width: 80 });
        } else {
          // Placeholder per il logo - ridotto a 80px di larghezza
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
      doc.text(`Data emissione: ${formatDate(fattura.data_emissione || fattura.created_at)}`, 50, 190);
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
      let totale = fattura.importo_totale || fattura.dettagli.reduce((sum: number, dettaglio: any) => sum + (dettaglio.importo || 0), 0);
      
      doc.font('Helvetica-Bold');
      doc.fillColor(primaryColor);
      doc.text('Totale:', 300, currentY, { align: 'right', width: 100 });
      doc.text(formatCurrency(totale), 405, currentY, { align: 'right', width: 140 });
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
      
      // Dati per il QR Code svizzero
      if (azienda?.iban) {
        // Aggiungiamo una separazione prima del QR code
        if (!needsNewPage) {
          doc.moveTo(50, currentY).lineTo(550, currentY).lineWidth(0.5).stroke(borderColor);
          currentY += 20;
        }
        
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Informazioni di pagamento', 50, currentY);
        currentY += 20;

        try {
          // Costruisci un indirizzo strutturato per il QR code
          const indirizzoStrutturato = {
            address: azienda.via || azienda.indirizzo || '',
            buildingNumber: azienda.numero_civico || '',
            zip: azienda.cap || '',
            city: azienda.citta || '',
            country: 'CH'
          };
          
          // Aggiungiamo le informazioni bancarie in una colonna a sinistra
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text('Coordinate bancarie:', 50, currentY);
          currentY += 15;
          doc.font('Helvetica').text(`IBAN: ${azienda.iban}`, 50, currentY);
          currentY += 15;
          
          if (azienda.nome_banca) {
            doc.text(`Banca: ${azienda.nome_banca}`, 50, currentY);
            currentY += 15;
          }
          
          if (azienda.swift_bic) {
            doc.text(`SWIFT/BIC: ${azienda.swift_bic}`, 50, currentY);
            currentY += 15;
          }
          
          const coordStartY = currentY;
          doc.text(`Beneficiario: ${azienda.nome_azienda}`, 50, currentY);
          currentY += 15;
          doc.text(`Importo: ${formatCurrency(totale)}`, 50, currentY);
          currentY += 15;
          doc.text(`Riferimento: Fattura n. ${fattura.numero}`, 50, currentY);
          
          // Creare i dati per il QR Bill
          const qrBillData = {
            currency: fattura.valuta || 'CHF',
            amount: totale,
            creditor: {
              account: azienda.iban,
              name: azienda.nome_azienda,
              ...indirizzoStrutturato
            },
            debtor: {
              name: `${fattura.cliente.nome} ${fattura.cliente.cognome || ''}`,
              address: fattura.cliente.indirizzo || '',
              zip: fattura.cliente.cap || '',
              city: fattura.cliente.citta || '',
              country: 'CH'
            },
            reference: `RF${fattura.numero.padStart(23, '0')}`,
            message: `Fattura n. ${fattura.numero}`
          };
          
          // Salviamo lo stato corrente del documento
          doc.save();
          
          try {
            // Aggiungiamo il QR code al documento - posizionato a destra
            const qrBill = new SwissQRBill(qrBillData);
            // Posiziona il QR code sulla destra del documento
            qrBill.attachTo(doc);
            
            // La libreria non supporta il posizionamento diretto, quindi spostiamo il documento
            // alla posizione desiderata prima di attaccare il QR code
            doc.translate(270, coordStartY - 20);
          } catch (qrError) {
            console.error('Errore nella generazione del QR Swiss Bill:', qrError);
            // Se c'è un errore nel QR bill, mostriamo un messaggio e un riquadro vuoto
            doc.rect(350, coordStartY - 20, 150, 150).stroke(borderColor);
            doc.fontSize(10).fillColor('#B91C1C').text('QR code non disponibile', 350, coordStartY + 55, { width: 150, align: 'center' });
          }
          
          // Ripristiniamo lo stato del documento
          doc.restore();
          
        } catch (error) {
          console.error('Errore nella generazione del QR code:', error);
          doc.fontSize(10).fillColor('#B91C1C').text('Impossibile generare il codice QR. Si prega di utilizzare le coordinate bancarie per effettuare il pagamento.', 50, currentY, { width: 400 });
        }
      } else {
        // Se non ci sono dati bancari, mostriamo un messaggio chiaro
        doc.fontSize(11).font('Helvetica').fillColor('#B91C1C').text('Per generare il QR code svizzero, inserisci il tuo IBAN nelle impostazioni.', 50, currentY, { align: 'center', width: 500 });
      }
      
      // Note della fattura
      if (fattura.note) {
        // Aggiungiamo la sezione note solo se c'è spazio
        const spaceForNotes = doc.page.height - 100 - currentY;
        if (spaceForNotes >= 60) {
          currentY += 40;
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#000000').text('Note:', 50, currentY);
          currentY += 20;
          doc.font('Helvetica').fontSize(10).text(fattura.note, 50, currentY, {
            width: 500,
            align: 'left'
          });
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
      console.error('Errore durante la generazione del PDF:', error);
      reject(error);
    }
  });
} 