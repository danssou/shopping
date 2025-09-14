import { Product, CartItem, WishlistItem, OrderStatus } from '@/types';
import { ProductConstant } from '@/constants/products';

// ========================================
// PRODUCT UTILITIES
// ========================================

/**
 * Safely extracts product properties from Product or ProductConstant
 */
export const getProductTitle = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.title : product.name || '';
};

export const getProductCategory = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.category : (product.category || '');
};

export const getProductPrice = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.price : product.price;
};

export const getProductImage = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.image : (product.imageUrl || '');
};

/**
 * Converts Product to CartItem
 */
export const convertToCartProduct = (product: Product, quantity: number = 1): CartItem => {
  return {
    ...product,
    quantity
  };
};

/**
 * Converts Product or ProductConstant to WishlistItem
 */
export const convertToWishlistItem = (product: Product | ProductConstant): WishlistItem => {
  return {
    id: product.id,
    title: getProductTitle(product),
    price: getProductPrice(product),
    image: getProductImage(product),
    category: getProductCategory(product),
    addedAt: new Date()
  };
};

// ========================================
// CART UTILITIES
// ========================================

/**
 * Calculate total price for cart items
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[$,]/g, ''));
    return total + (price * item.quantity);
  }, 0);
};

/**
 * Calculate total items in cart
 */
export const calculateCartItemCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Find cart item by ID
 */
export const findCartItem = (items: CartItem[], productId: string): CartItem | undefined => {
  return items.find(item => item.id === productId);
};

// ========================================
// ORDER UTILITIES
// ========================================

/**
 * Get order status color classes
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'text-green-400 bg-green-400/10';
    case 'processing':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'shipped':
      return 'text-blue-400 bg-blue-400/10';
    case 'cancelled':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

/**
 * Format order status for display
 */
export const formatOrderStatus = (status: OrderStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ========================================
// VALIDATION UTILITIES
// ========================================
// FORMAT UTILITIES
// ========================================

/**
 * Format date with proper locale support
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format time with proper locale support
 */
export const formatTime = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  },
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Shuffle array items randomly
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Group array items by a key
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Remove duplicates from array based on a key
 */
export const uniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

