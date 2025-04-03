/**
 * Formatta una data nel formato italiano (DD/MM/YYYY)
 * @param dateString - La stringa della data da formattare
 * @returns La data formattata
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Formatta un numero come valuta in Franchi Svizzeri
 * @param amount - L'importo da formattare
 * @returns L'importo formattato come valuta
 */
export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('it-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(amount);
}

/**
 * Tronca un testo se supera la lunghezza massima
 * @param text - Il testo da troncare
 * @param maxLength - La lunghezza massima
 * @returns Il testo troncato con ellissi se necessario
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalizza la prima lettera di una stringa
 * @param text - Il testo da capitalizzare
 * @returns Il testo con la prima lettera maiuscola
 */
export function capitalize(text: string): string {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Genera un colore casuale basato su una stringa
 * Utile per generare colori consistenti per avatar o badge
 * @param str - La stringa da usare come seed
 * @returns Un colore esadecimale
 */
export function stringToColor(str: string): string {
  if (!str) return '#6366F1'; // Default indigo color
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
}

/**
 * Calcola il contrasto di un colore (chiaro o scuro)
 * @param hexColor - Il colore esadecimale
 * @returns 'light' o 'dark' a seconda del contrasto
 */
export function getContrastYIQ(hexColor: string): 'light' | 'dark' {
  if (!hexColor || hexColor.length < 7) return 'dark';
  
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return (yiq >= 128) ? 'dark' : 'light';
}

/**
 * Genera URL di immagini ottimizzate per dimensioni diverse
 * @param src - Il percorso dell'immagine
 * @param width - La larghezza desiderata
 * @param quality - La qualità dell'immagine (1-100)
 * @returns URL ottimizzato per l'immagine
 */
export function getOptimizedImageUrl(src: string, width: number = 1200, quality: number = 80): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;
  
  // Se è già un URL di next/image, non modificarlo
  if (src.includes('_next/image')) return src;
  
  // Se è un URL esterno (Instagram, ecc.)
  if (src.startsWith('http')) {
    // Qui si potrebbe implementare un proxy di immagini se necessario
    return src;
  }
  
  // Per immagini locali, aggiungi i parametri di ottimizzazione
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mtre.ch';
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  
  // Formato per next/image
  return `${baseUrl}/_next/image?url=${encodeURIComponent(imagePath)}&w=${width}&q=${quality}`;
}

/**
 * Calcola dimensioni responsive per le immagini
 * @param defaultWidth - La larghezza default dell'immagine
 * @returns Stringa di sizes per l'attributo sizes di next/image
 */
export function getResponsiveImageSizes(defaultWidth: number = 1200): string {
  return `(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, ${defaultWidth}px`;
}

/**
 * Effettua il debounce di una funzione
 * @param func - La funzione da eseguire con debounce
 * @param wait - Il tempo di attesa in millisecond
 * @returns Funzione con debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Verifica se il dispositivo è mobile
 * @returns true se il dispositivo è mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Genera un ID univoco
 * @returns Stringa ID
 */
export function generateUniqueId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
} 