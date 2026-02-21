/**
 * Order Cache System
 * Stores user orders locally for 2-3 days without requiring login
 * Users can view their orders anytime within this period
 */

export interface CachedOrder {
  id: string;
  name: string;
  phone: string;
  address: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  timestamp: number; // Unix timestamp
  expiresAt: number; // Expiration timestamp
}

const CACHE_KEY = 'timber_strong_orders';
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export const orderCache = {
  /**
   * Add a new order to cache
   */
  addOrder: (order: Omit<CachedOrder, 'id' | 'timestamp' | 'expiresAt'>) => {
    try {
      const cachedOrders = orderCache.getAllOrders();
      const newOrder: CachedOrder = {
        ...order,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION,
      };

      cachedOrders.push(newOrder);
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedOrders));
      return newOrder;
    } catch (error) {
      console.error('Failed to cache order:', error);
      return null;
    }
  },

  /**
   * Get all orders from cache (non-expired only)
   */
  getAllOrders: (): CachedOrder[] => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return [];

      const orders: CachedOrder[] = JSON.parse(stored);
      const now = Date.now();

      // Filter out expired orders
      const validOrders = orders.filter((order) => order.expiresAt > now);

      // Update storage if any were removed
      if (validOrders.length < orders.length) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(validOrders));
      }

      return validOrders;
    } catch (error) {
      console.error('Failed to retrieve cached orders:', error);
      return [];
    }
  },

  /**
   * Get orders by phone number
   */
  getOrdersByPhone: (phone: string): CachedOrder[] => {
    try {
      const orders = orderCache.getAllOrders();
      return orders.filter((order) => order.phone === phone);
    } catch (error) {
      console.error('Failed to get orders by phone:', error);
      return [];
    }
  },

  /**
   * Get a single order by ID
   */
  getOrderById: (id: string): CachedOrder | null => {
    try {
      const orders = orderCache.getAllOrders();
      return orders.find((order) => order.id === id) || null;
    } catch (error) {
      console.error('Failed to get order by ID:', error);
      return null;
    }
  },

  /**
   * Delete an order from cache
   */
  deleteOrder: (id: string): boolean => {
    try {
      const orders = orderCache.getAllOrders();
      const filtered = orders.filter((order) => order.id !== id);
      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
      return filtered.length < orders.length;
    } catch (error) {
      console.error('Failed to delete order:', error);
      return false;
    }
  },

  /**
   * Clear all cached orders
   */
  clearAllOrders: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear orders:', error);
      return false;
    }
  },

  /**
   * Get cache stats
   */
  getStats: () => {
    try {
      const orders = orderCache.getAllOrders();
      const now = Date.now();

      return {
        totalOrders: orders.length,
        cacheSize: new Blob([JSON.stringify(orders)]).size,
        oldestOrder: orders.length > 0 ? Math.min(...orders.map((o) => o.timestamp)) : null,
        newestOrder: orders.length > 0 ? Math.max(...orders.map((o) => o.timestamp)) : null,
        expiringIn: orders.length > 0 ? Math.min(...orders.map((o) => o.expiresAt - now)) : null,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  },
};

export default orderCache;
