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
  return new Promise((resolve, reject) => {
    try {
      // Crea un buffer per il PDF
      const chunks: Buffer[] = [];
      
      // Crea un nuovo documento PDF senza specificare font
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        autoFirstPage: true,
        compress: true,
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
          currency: fattura.valuta || 'CHF'
        }).format(amount);
      };
      
      // Colori
      const primaryColor = '#10B981'; // Verde
      
      // Intestazione con colore di sfondo
      doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
      
      // Logo (se disponibile)
      try {
        if (azienda?.logo_url) {
          // Usa il logo caricato dall'utente
          doc.image(azienda.logo_url, 50, 30, { width: 100 });
        } else {
          // Non carichiamo immagini locali per evitare problemi di percorso
          doc.rect(50, 30, 100, 60).fillAndStroke('#FFFFFF', '#CCCCCC');
          doc.fillColor('#CCCCCC').text('LOGO', 80, 55);
        }
      } catch (error) {
        console.error('Errore nel caricamento del logo:', error);
        // Continuiamo senza logo
      }
      
      // Intestazione azienda (testo bianco su sfondo colorato)
      if (azienda) {
        doc.fillColor('#FFFFFF');
        doc.fontSize(20).text(azienda.nome_azienda || 'Azienda', 160, 40);
        doc.fontSize(10).text(azienda.indirizzo || '', 160, 65);
        doc.text(`${azienda.cap || ''} ${azienda.citta || ''} ${azienda.cantone || ''}`, 160, 80);
        doc.text(`Tel: ${azienda.telefono || ''} - Email: ${azienda.email || ''}`, 160, 95);
      }
      
      // Titolo documento
      doc.fillColor('#000000');
      doc.fontSize(24).text('FATTURA', 50, 140);
      doc.fontSize(16).text(`N. ${fattura.numero}`, 50, 170);
      
      // Riquadro informazioni fattura
      doc.roundedRect(50, 200, 240, 100, 5).fillAndStroke('#F3F4F6', '#E5E7EB');
      doc.fillColor('#000000').fontSize(12).text('INFORMAZIONI FATTURA', 60, 210);
      doc.text(`Data emissione: ${formatDate(fattura.data_emissione)}`, 60, 230);
      doc.text(`Data scadenza: ${formatDate(fattura.data_scadenza)}`, 60, 250);
      
      // Badge stato
      let statoColor = '#9CA3AF'; // Grigio di default
      switch (fattura.stato.toLowerCase()) {
        case 'pagata':
          statoColor = '#10B981'; // Verde
          break;
        case 'emessa':
          statoColor = '#3B82F6'; // Blu
          break;
        case 'scaduta':
          statoColor = '#EF4444'; // Rosso
          break;
      }
      
      doc.roundedRect(60, 270, 100, 20, 10).fill(statoColor);
      doc.fillColor('#FFFFFF').text(fattura.stato.toUpperCase(), 70, 274);
      
      // Riquadro informazioni cliente
      doc.roundedRect(310, 200, 240, 100, 5).fillAndStroke('#F3F4F6', '#E5E7EB');
      doc.fillColor('#000000').fontSize(12).text('CLIENTE', 320, 210);
      doc.text(`${fattura.cliente.nome} ${fattura.cliente.cognome || ''}`, 320, 230);
      if (fattura.cliente.indirizzo) {
        doc.text(fattura.cliente.indirizzo, 320, 250);
      }
      if (fattura.cliente.citta) {
        doc.text(`${fattura.cliente.cap || ''} ${fattura.cliente.citta} ${fattura.cliente.provincia || ''}`, 320, 270);
      }
      
      // Linea separatrice
      doc.moveTo(50, 320).lineTo(550, 320).lineWidth(1).stroke(primaryColor);
      
      // Tabella dettagli
      const tableTop = 350;
      const tableHeaders = ['Servizio', 'Descrizione', 'Quantità', 'Prezzo', 'Importo'];
      const tableColumnWidths = [120, 180, 60, 70, 70];
      
      // Intestazione tabella
      doc.rect(50, tableTop - 10, 500, 25).fill(primaryColor);
      let currentX = 50;
      doc.fillColor('#FFFFFF').fontSize(10);
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX + 5, tableTop, { width: tableColumnWidths[i], align: 'left' });
        currentX += tableColumnWidths[i];
      });
      
      // Righe tabella
      let currentY = tableTop + 25;
      doc.fillColor('#000000').fontSize(10);
      
      fattura.dettagli.forEach((dettaglio: any, index: number) => {
        const isEvenRow = index % 2 === 0;
        if (isEvenRow) {
          doc.rect(50, currentY - 5, 500, 25).fill('#F9FAFB');
        }
        
        currentX = 50;
        doc.fillColor('#000000');
        
        // Servizio
        doc.text(dettaglio.servizio?.nome || 'Servizio personalizzato', currentX + 5, currentY, { width: tableColumnWidths[0], align: 'left' });
        currentX += tableColumnWidths[0];
        
        // Descrizione
        doc.text(dettaglio.descrizione, currentX + 5, currentY, { width: tableColumnWidths[1], align: 'left' });
        currentX += tableColumnWidths[1];
        
        // Quantità
        doc.text(dettaglio.quantita.toString(), currentX + 5, currentY, { width: tableColumnWidths[2], align: 'center' });
        currentX += tableColumnWidths[2];
        
        // Prezzo unitario
        doc.text(formatCurrency(dettaglio.prezzo_unitario), currentX + 5, currentY, { width: tableColumnWidths[3], align: 'right' });
        currentX += tableColumnWidths[3];
        
        // Importo
        doc.text(formatCurrency(dettaglio.importo), currentX + 5, currentY, { width: tableColumnWidths[4], align: 'right' });
        
        currentY += 25;
      });
      
      // Totale
      doc.rect(50, currentY - 5, 500, 30).fill('#F3F4F6');
      doc.fillColor('#000000').fontSize(12);
      doc.text('Totale:', 380, currentY + 5, { width: 100, align: 'right' });
      doc.text(formatCurrency(fattura.importo_totale), 480, currentY + 5, { width: 70, align: 'right' });
      
      // Informazioni di pagamento
      doc.fontSize(12).text('Informazioni di pagamento:', 50, currentY + 50);
      doc.fontSize(10);
      doc.text('Metodo di pagamento: Bonifico bancario', 50, currentY + 70);
      
      if (azienda) {
        doc.text(`Intestatario: ${azienda.nome_azienda || ''}`, 50, currentY + 90);
        
        // Dati bancari fittizi per l'esempio
        doc.text('IBAN: IT60X0542811101000000123456', 50, currentY + 110);
        doc.text('Banca: Esempio Banca', 50, currentY + 130);
      }
      
      // Note
      if (fattura.note) {
        doc.fontSize(12).text('Note:', 50, currentY + 160);
        doc.fontSize(10).text(fattura.note, 50, currentY + 180, { width: 500 });
      }
      
      // Piè di pagina - aggiunto direttamente sulla pagina corrente invece di creare una nuova pagina
      if (currentY + 250 > doc.page.height) {
        // Se lo spazio non è sufficiente, comprimiamo leggermente il contenuto
        currentY = doc.page.height - 250;
      }
      
      doc.fontSize(8).fillColor('#666666');
      doc.text(`Documento generato automaticamente - ${new Date().toLocaleDateString()}`, 50, currentY + 210, { width: 500, align: 'center' });
      
      if (azienda?.partita_iva) {
        doc.text(`Partita IVA: ${azienda.partita_iva}`, 50, currentY + 225, { width: 500, align: 'center' });
      }
      
      if (azienda?.sito_web) {
        doc.text(azienda.sito_web, 50, currentY + 240, { width: 500, align: 'center' });
      }
      
      // Finalizza il documento
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 