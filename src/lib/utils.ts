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