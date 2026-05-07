// Category
export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: Date;
}

// Product
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  category?: Category;
  imageUrl?: string;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  debtAmount: number;
  totalPurchases: number;
  lastPurchaseAt?: Date;
  createdAt: Date;
}

// Order Item
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Cart Item (for creating orders)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order
export type PaymentStatus = 'paid' | 'pending';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: number;
  customerId?: string;
  customer?: Customer;
  items: OrderItem[];
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  adminNotes?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Quick Notes
export interface QuickNote {
  id: string;
  label: string;
  text: string;
}

// Printer
export interface PrinterDevice {
  id: string;
  name: string;
  address: string;
  isConnected: boolean;
}

export interface PrinterSettings {
  businessName: string;
  businessAddress?: string;
  businessPhone?: string;
  footerMessage?: string;
  printCopy: boolean;
}

// Daily Stats
export interface DailyStats {
  date: Date;
  totalSales: number;
  totalPaid: number;
  totalPending: number;
  ordersCompleted: number;
  ordersCancelled: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

// Auth
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier';
}

// Stock Level
export type StockLevel = 'high' | 'medium' | 'low' | 'out';

export function getStockLevel(quantity: number): StockLevel {
  if (quantity === 0) return 'out';
  if (quantity <= 5) return 'low';
  if (quantity <= 15) return 'medium';
  return 'high';
}
