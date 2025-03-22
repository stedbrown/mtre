// Type definitions for swissqrbill
declare module 'swissqrbill' {
  interface QRBillCreditor {
    name: string;
    address: string;
    zip: string;
    city: string;
    account: string;
    country: string;
  }

  interface QRBillDebtor {
    name: string;
    address: string;
    zip: string;
    city: string;
    country: string;
  }

  interface QRBillData {
    currency: string;
    amount: number;
    reference: string;
    creditor: QRBillCreditor;
    debtor: QRBillDebtor;
    message?: string;
    language?: 'it' | 'de' | 'fr' | 'en';
  }

  // Function to generate QR code synchronously
  export function generateQRCodeSync(data: QRBillData): string;
  
  // Function to generate QR code asynchronously
  export function generateQRCode(data: QRBillData): Promise<string>;
} 