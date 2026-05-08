import { useState, useCallback, useMemo } from 'react';
import { mockProducts, mockCustomers, mockOrders, mockCategories } from '@/constants/mock-data';
import { Product, Customer, Order, Category } from '@/types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Products hook
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    await delay(300);
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string) => {
    if (!categoryId || categoryId === 'all') return products;
    return products.filter(p => p.categoryId === categoryId);
  }, [products]);

  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [products]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    await delay(300);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setLoading(false);
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    updateProduct,
  };
}

// Categories hook
export function useCategories() {
  const categories = useMemo(() => mockCategories, []);
  
  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  return {
    categories,
    getCategoryById,
  };
}

// Customers hook
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    await delay(300);
    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const getCustomerById = useCallback((id: string) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  const searchCustomers = useCallback((query: string) => {
    const q = query.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [customers]);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => {
    setLoading(true);
    await delay(300);
    const newCustomer: Customer = {
      ...customer,
      id: `customer-${Date.now()}`,
      createdAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setLoading(false);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    setLoading(true);
    await delay(300);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setLoading(false);
  }, []);

  return {
    customers,
    loading,
    fetchCustomers,
    getCustomerById,
    searchCustomers,
    addCustomer,
    updateCustomer,
  };
}

// Orders hook
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    await delay(300);
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  const getOrdersByDate = useCallback((date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  }, [orders]);

  const getTodayOrders = useCallback(() => {
    return getOrdersByDate(new Date());
  }, [getOrdersByDate]);

  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    await delay(300);
    
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setLoading(false);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    setLoading(true);
    await delay(300);
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status, updatedAt: new Date() } : o
    ));
    setLoading(false);
  }, []);

  const cancelOrder = useCallback(async (id: string) => {
    await updateOrderStatus(id, 'cancelled');
  }, [updateOrderStatus]);

  // Daily summary
  const getDailySummary = useCallback((date: Date) => {
    const dayOrders = getOrdersByDate(date);
    const completedOrders = dayOrders.filter(o => o.status !== 'cancelled');
    
    return {
      totalOrders: completedOrders.length,
      totalSales: completedOrders.reduce((sum, o) => sum + o.total, 0),
      cashSales: completedOrders.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0),
      cardSales: completedOrders.filter(o => o.paymentMethod === 'card').reduce((sum, o) => sum + o.total, 0),
      transferSales: completedOrders.filter(o => o.paymentMethod === 'transfer').reduce((sum, o) => sum + o.total, 0),
      deliveryOrders: completedOrders.filter(o => o.orderType === 'delivery').length,
      pickupOrders: completedOrders.filter(o => o.orderType === 'pickup').length,
      cancelledOrders: dayOrders.filter(o => o.status === 'cancelled').length,
    };
  }, [getOrdersByDate]);

  return {
    orders,
    loading,
    fetchOrders,
    getOrderById,
    getOrdersByStatus,
    getOrdersByDate,
    getTodayOrders,
    addOrder,
    updateOrderStatus,
    cancelOrder,
    getDailySummary,
  };
}

// Search hook with debounce
export function useSearch<T>(
  items: T[],
  searchFn: (items: T[], query: string) => T[],
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const results = useMemo(() => {
    if (!debouncedQuery) return items;
    return searchFn(items, debouncedQuery);
  }, [items, debouncedQuery, searchFn]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    // Simple debounce
    setTimeout(() => setDebouncedQuery(text), debounceMs);
  }, [debounceMs]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    results,
    handleSearch,
    clearSearch,
  };
}
