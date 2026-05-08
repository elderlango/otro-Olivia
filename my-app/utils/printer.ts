import { Order, CartItem } from '@/types';
import { formatCurrency, formatDate } from './format';

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

export const ESC_POS = {
  // Initialize printer
  INIT: `${ESC}@`,
  
  // Text formatting
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,
  
  // Text alignment
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  
  // Text size
  NORMAL_SIZE: `${GS}!\x00`,
  DOUBLE_HEIGHT: `${GS}!\x01`,
  DOUBLE_WIDTH: `${GS}!\x10`,
  DOUBLE_SIZE: `${GS}!\x11`,
  
  // Line spacing
  LINE_SPACING_DEFAULT: `${ESC}2`,
  LINE_SPACING_SET: (n: number) => `${ESC}3${String.fromCharCode(n)}`,
  
  // Paper operations
  FEED_LINE: '\n',
  FEED_LINES: (n: number) => `${ESC}d${String.fromCharCode(n)}`,
  CUT_PAPER: `${GS}V\x00`,
  CUT_PAPER_PARTIAL: `${GS}V\x01`,
  
  // Cash drawer
  OPEN_DRAWER: `${ESC}p\x00\x19\xFA`,
};

// Character width for 58mm printer (32 chars) or 80mm printer (48 chars)
const LINE_WIDTH = 32;

function centerText(text: string, width: number = LINE_WIDTH): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

function leftRightText(left: string, right: string, width: number = LINE_WIDTH): string {
  const spaces = Math.max(1, width - left.length - right.length);
  return left + ' '.repeat(spaces) + right;
}

function repeatChar(char: string, count: number = LINE_WIDTH): string {
  return char.repeat(count);
}

function wrapText(text: string, width: number = LINE_WIDTH): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

interface TicketConfig {
  businessName: string;
  businessAddress?: string;
  businessPhone?: string;
  footerMessage?: string;
  showLogo?: boolean;
}

const defaultConfig: TicketConfig = {
  businessName: 'Mi Negocio',
  businessAddress: 'Calle Principal #123',
  businessPhone: '555-123-4567',
  footerMessage: 'Gracias por su compra',
};

export function generateOrderTicket(
  order: Order,
  config: TicketConfig = defaultConfig
): string {
  let ticket = '';

  // Initialize printer
  ticket += ESC_POS.INIT;
  ticket += ESC_POS.ALIGN_CENTER;

  // Header - Business name
  ticket += ESC_POS.DOUBLE_SIZE;
  ticket += ESC_POS.BOLD_ON;
  ticket += config.businessName + '\n';
  ticket += ESC_POS.BOLD_OFF;
  ticket += ESC_POS.NORMAL_SIZE;

  // Business info
  if (config.businessAddress) {
    ticket += config.businessAddress + '\n';
  }
  if (config.businessPhone) {
    ticket += `Tel: ${config.businessPhone}\n`;
  }

  ticket += '\n';
  ticket += repeatChar('=') + '\n';

  // Order info
  ticket += ESC_POS.ALIGN_LEFT;
  ticket += ESC_POS.BOLD_ON;
  ticket += `PEDIDO #${order.orderNumber}\n`;
  ticket += ESC_POS.BOLD_OFF;
  ticket += `Fecha: ${formatDate(order.createdAt)}\n`;
  
  if (order.customer) {
    ticket += `Cliente: ${order.customer.name}\n`;
    if (order.customer.phone) {
      ticket += `Tel: ${order.customer.phone}\n`;
    }
  }

  if (order.deliveryAddress) {
    ticket += `Direccion: ${order.deliveryAddress}\n`;
  }

  ticket += repeatChar('-') + '\n';

  // Items header
  ticket += ESC_POS.BOLD_ON;
  ticket += leftRightText('PRODUCTO', 'TOTAL') + '\n';
  ticket += ESC_POS.BOLD_OFF;
  ticket += repeatChar('-') + '\n';

  // Order items
  for (const item of order.items) {
    // Product name (may wrap)
    const productName = item.product.name;
    const nameLines = wrapText(productName, LINE_WIDTH - 12);
    
    for (let i = 0; i < nameLines.length; i++) {
      if (i === 0) {
        ticket += nameLines[i] + '\n';
      } else {
        ticket += '  ' + nameLines[i] + '\n';
      }
    }

    // Quantity x Price = Subtotal
    const qtyPrice = `  ${item.quantity} x ${formatCurrency(item.unitPrice)}`;
    const subtotal = formatCurrency(item.subtotal);
    ticket += leftRightText(qtyPrice, subtotal) + '\n';

    // Notes if any
    if (item.notes) {
      ticket += `  > ${item.notes}\n`;
    }
  }

  ticket += repeatChar('-') + '\n';

  // Totals
  ticket += ESC_POS.ALIGN_RIGHT;
  
  ticket += leftRightText('Subtotal:', formatCurrency(order.subtotal)) + '\n';
  
  if (order.discount > 0) {
    ticket += leftRightText('Descuento:', `-${formatCurrency(order.discount)}`) + '\n';
  }
  
  if (order.deliveryFee && order.deliveryFee > 0) {
    ticket += leftRightText('Envio:', formatCurrency(order.deliveryFee)) + '\n';
  }

  ticket += repeatChar('-') + '\n';
  ticket += ESC_POS.BOLD_ON;
  ticket += ESC_POS.DOUBLE_HEIGHT;
  ticket += leftRightText('TOTAL:', formatCurrency(order.total)) + '\n';
  ticket += ESC_POS.NORMAL_SIZE;
  ticket += ESC_POS.BOLD_OFF;

  // Payment method
  ticket += ESC_POS.ALIGN_LEFT;
  const paymentLabels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
  };
  ticket += `Pago: ${paymentLabels[order.paymentMethod] || order.paymentMethod}\n`;

  // Order notes
  if (order.notes) {
    ticket += repeatChar('-') + '\n';
    ticket += 'Notas:\n';
    const noteLines = wrapText(order.notes);
    for (const line of noteLines) {
      ticket += line + '\n';
    }
  }

  // Footer
  ticket += '\n';
  ticket += repeatChar('=') + '\n';
  ticket += ESC_POS.ALIGN_CENTER;
  
  if (config.footerMessage) {
    ticket += config.footerMessage + '\n';
  }

  ticket += '\n\n\n';
  ticket += ESC_POS.CUT_PAPER_PARTIAL;

  return ticket;
}

export function generateDailyCutTicket(
  date: Date,
  summary: {
    totalOrders: number;
    totalSales: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
    deliveryOrders: number;
    pickupOrders: number;
    cancelledOrders: number;
  },
  config: TicketConfig = defaultConfig
): string {
  let ticket = '';

  ticket += ESC_POS.INIT;
  ticket += ESC_POS.ALIGN_CENTER;

  // Header
  ticket += ESC_POS.DOUBLE_SIZE;
  ticket += ESC_POS.BOLD_ON;
  ticket += 'CORTE DE CAJA\n';
  ticket += ESC_POS.BOLD_OFF;
  ticket += ESC_POS.NORMAL_SIZE;
  ticket += config.businessName + '\n';
  ticket += '\n';
  ticket += formatDate(date) + '\n';
  ticket += repeatChar('=') + '\n';

  ticket += ESC_POS.ALIGN_LEFT;

  // Sales summary
  ticket += ESC_POS.BOLD_ON;
  ticket += 'RESUMEN DE VENTAS\n';
  ticket += ESC_POS.BOLD_OFF;
  ticket += repeatChar('-') + '\n';

  ticket += leftRightText('Total Pedidos:', summary.totalOrders.toString()) + '\n';
  ticket += leftRightText('Pedidos Entrega:', summary.deliveryOrders.toString()) + '\n';
  ticket += leftRightText('Pedidos Recoger:', summary.pickupOrders.toString()) + '\n';
  ticket += leftRightText('Cancelados:', summary.cancelledOrders.toString()) + '\n';

  ticket += repeatChar('-') + '\n';

  // Payment breakdown
  ticket += ESC_POS.BOLD_ON;
  ticket += 'DESGLOSE POR PAGO\n';
  ticket += ESC_POS.BOLD_OFF;
  ticket += repeatChar('-') + '\n';

  ticket += leftRightText('Efectivo:', formatCurrency(summary.cashSales)) + '\n';
  ticket += leftRightText('Tarjeta:', formatCurrency(summary.cardSales)) + '\n';
  ticket += leftRightText('Transferencia:', formatCurrency(summary.transferSales)) + '\n';

  ticket += repeatChar('=') + '\n';

  // Total
  ticket += ESC_POS.BOLD_ON;
  ticket += ESC_POS.DOUBLE_HEIGHT;
  ticket += leftRightText('TOTAL:', formatCurrency(summary.totalSales)) + '\n';
  ticket += ESC_POS.NORMAL_SIZE;
  ticket += ESC_POS.BOLD_OFF;

  ticket += '\n\n\n';
  ticket += ESC_POS.CUT_PAPER_PARTIAL;

  return ticket;
}

// Convert ticket string to bytes for Bluetooth transmission
export function ticketToBytes(ticket: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(ticket);
}

// Generate plain text version for sharing/preview
export function generatePlainTextTicket(order: Order, config: TicketConfig = defaultConfig): string {
  let text = '';

  text += centerText(config.businessName) + '\n';
  if (config.businessAddress) {
    text += centerText(config.businessAddress) + '\n';
  }
  if (config.businessPhone) {
    text += centerText(`Tel: ${config.businessPhone}`) + '\n';
  }
  text += '\n';
  text += repeatChar('=') + '\n';
  text += `PEDIDO #${order.orderNumber}\n`;
  text += `Fecha: ${formatDate(order.createdAt)}\n`;
  
  if (order.customer) {
    text += `Cliente: ${order.customer.name}\n`;
  }
  
  text += repeatChar('-') + '\n';
  
  for (const item of order.items) {
    text += `${item.product.name}\n`;
    text += `  ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.subtotal)}\n`;
    if (item.notes) {
      text += `  > ${item.notes}\n`;
    }
  }
  
  text += repeatChar('-') + '\n';
  text += leftRightText('Subtotal:', formatCurrency(order.subtotal)) + '\n';
  
  if (order.discount > 0) {
    text += leftRightText('Descuento:', `-${formatCurrency(order.discount)}`) + '\n';
  }
  
  text += repeatChar('=') + '\n';
  text += leftRightText('TOTAL:', formatCurrency(order.total)) + '\n';
  text += '\n';
  
  if (config.footerMessage) {
    text += centerText(config.footerMessage) + '\n';
  }

  return text;
}
