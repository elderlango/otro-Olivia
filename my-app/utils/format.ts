import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency in Mexican Pesos
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency without symbol (for inputs)
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format date relative (today, yesterday, or full date)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(d)) {
    return `Hoy, ${format(d, 'HH:mm')}`;
  }
  
  if (isYesterday(d)) {
    return `Ayer, ${format(d, 'HH:mm')}`;
  }
  
  return format(d, "d 'de' MMMM, HH:mm", { locale: es });
}

/**
 * Format date short (for lists)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm');
}

/**
 * Format date for daily cut
 */
export function formatDateFull(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "EEEE d 'de' MMMM, yyyy", { locale: es });
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'HH:mm');
}

/**
 * Format distance to now (e.g., "hace 5 minutos")
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}

/**
 * Format order number with padding
 */
export function formatOrderNumber(orderNumber: number): string {
  return `#${orderNumber.toString().padStart(4, '0')}`;
}

/**
 * Format phone number (Mexican format)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format quantity (with decimals only if needed)
 */
export function formatQuantity(quantity: number): string {
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }
  return quantity.toFixed(2);
}
