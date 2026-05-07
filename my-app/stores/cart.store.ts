import { create } from 'zustand';
import type { CartItem, Product, Customer, PaymentStatus } from '@/types';

interface CartState {
  items: CartItem[];
  customer: Customer | null;
  paymentStatus: PaymentStatus;
  adminNotes: string;
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  setCustomer: (customer: Customer | null) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setAdminNotes: (notes: string) => void;
  appendNote: (note: string) => void;
  clearCart: () => void;
  
  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: null,
  paymentStatus: 'pending',
  adminNotes: '',

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  incrementQuantity: (productId) => {
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  },

  decrementQuantity: (productId) => {
    const item = get().items.find(i => i.product.id === productId);
    if (item && item.quantity <= 1) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  },

  setCustomer: (customer) => {
    set({ customer });
  },

  setPaymentStatus: (paymentStatus) => {
    set({ paymentStatus });
  },

  setAdminNotes: (adminNotes) => {
    set({ adminNotes });
  },

  appendNote: (note) => {
    set((state) => ({
      adminNotes: state.adminNotes ? `${state.adminNotes}\n${note}` : note,
    }));
  },

  clearCart: () => {
    set({
      items: [],
      customer: null,
      paymentStatus: 'pending',
      adminNotes: '',
    });
  },

  getTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
