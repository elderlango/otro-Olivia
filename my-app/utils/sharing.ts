import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert, Share, Platform } from 'react-native';
import { Order } from '@/types';
import { generatePlainTextTicket } from './printer';
import { formatCurrency, formatDate } from './format';

export async function shareOrderViaWhatsApp(order: Order, phone?: string): Promise<void> {
  const message = generateOrderShareMessage(order);
  
  // Format phone number (remove spaces, dashes, etc.)
  const formattedPhone = phone?.replace(/\D/g, '') || '';
  
  // Use WhatsApp URL scheme
  const whatsappUrl = formattedPhone
    ? `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`
    : `whatsapp://send?text=${encodeURIComponent(message)}`;

  try {
    const { Linking } = await import('react-native');
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Fallback to regular share
      await shareOrderGeneric(order);
    }
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
    await shareOrderGeneric(order);
  }
}

export async function shareOrderGeneric(order: Order): Promise<void> {
  const message = generateOrderShareMessage(order);
  
  try {
    await Share.share({
      message,
      title: `Pedido #${order.orderNumber}`,
    });
  } catch (error) {
    console.error('Error sharing order:', error);
    Alert.alert('Error', 'No se pudo compartir el pedido');
  }
}

export function generateOrderShareMessage(order: Order): string {
  let message = '';
  
  message += `*PEDIDO #${order.orderNumber}*\n`;
  message += `Fecha: ${formatDate(order.createdAt)}\n\n`;
  
  if (order.customer) {
    message += `*Cliente:* ${order.customer.name}\n`;
    if (order.customer.phone) {
      message += `Tel: ${order.customer.phone}\n`;
    }
  }
  
  if (order.deliveryAddress) {
    message += `*Direccion:* ${order.deliveryAddress}\n`;
  }
  
  message += '\n*PRODUCTOS:*\n';
  message += '─────────────\n';
  
  for (const item of order.items) {
    message += `${item.quantity}x ${item.product.name}\n`;
    message += `   ${formatCurrency(item.unitPrice)} c/u = ${formatCurrency(item.subtotal)}\n`;
    if (item.notes) {
      message += `   _${item.notes}_\n`;
    }
  }
  
  message += '─────────────\n';
  message += `*Subtotal:* ${formatCurrency(order.subtotal)}\n`;
  
  if (order.discount > 0) {
    message += `*Descuento:* -${formatCurrency(order.discount)}\n`;
  }
  
  if (order.deliveryFee && order.deliveryFee > 0) {
    message += `*Envio:* ${formatCurrency(order.deliveryFee)}\n`;
  }
  
  message += `\n*TOTAL: ${formatCurrency(order.total)}*\n`;
  
  const paymentLabels: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
  };
  message += `Pago: ${paymentLabels[order.paymentMethod] || order.paymentMethod}\n`;
  
  if (order.notes) {
    message += `\n_Notas: ${order.notes}_\n`;
  }
  
  return message;
}

export async function saveTicketAsText(order: Order): Promise<string | null> {
  try {
    const ticketContent = generatePlainTextTicket(order);
    const fileName = `pedido_${order.orderNumber}_${Date.now()}.txt`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, ticketContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    return filePath;
  } catch (error) {
    console.error('Error saving ticket:', error);
    return null;
  }
}

export async function shareTicketFile(order: Order): Promise<void> {
  const filePath = await saveTicketAsText(order);
  
  if (!filePath) {
    Alert.alert('Error', 'No se pudo generar el archivo');
    return;
  }
  
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/plain',
        dialogTitle: `Compartir Pedido #${order.orderNumber}`,
      });
    } else {
      Alert.alert('Error', 'Compartir no esta disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error sharing file:', error);
    Alert.alert('Error', 'No se pudo compartir el archivo');
  }
}

export async function exportDailySummary(
  date: Date,
  orders: Order[],
  summary: {
    totalOrders: number;
    totalSales: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
  }
): Promise<void> {
  let content = '';
  
  content += '================================\n';
  content += '      REPORTE DIARIO DE VENTAS\n';
  content += '================================\n\n';
  content += `Fecha: ${formatDate(date)}\n\n`;
  
  content += 'RESUMEN:\n';
  content += '--------\n';
  content += `Total de Pedidos: ${summary.totalOrders}\n`;
  content += `Ventas en Efectivo: ${formatCurrency(summary.cashSales)}\n`;
  content += `Ventas con Tarjeta: ${formatCurrency(summary.cardSales)}\n`;
  content += `Ventas por Transferencia: ${formatCurrency(summary.transferSales)}\n`;
  content += `\nTOTAL DEL DIA: ${formatCurrency(summary.totalSales)}\n\n`;
  
  content += '================================\n';
  content += '      DETALLE DE PEDIDOS\n';
  content += '================================\n\n';
  
  for (const order of orders) {
    content += `Pedido #${order.orderNumber}\n`;
    content += `  Cliente: ${order.customer?.name || 'Sin cliente'}\n`;
    content += `  Total: ${formatCurrency(order.total)}\n`;
    content += `  Estado: ${order.status}\n`;
    content += `  Pago: ${order.paymentMethod}\n`;
    content += '\n';
  }
  
  const fileName = `reporte_${formatDate(date).replace(/\//g, '-')}.txt`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  
  try {
    await FileSystem.writeAsStringAsync(filePath, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/plain',
        dialogTitle: 'Exportar Reporte Diario',
      });
    }
  } catch (error) {
    console.error('Error exporting summary:', error);
    Alert.alert('Error', 'No se pudo exportar el reporte');
  }
}
