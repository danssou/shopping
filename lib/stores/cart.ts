import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  category: string | null;
  brand: string | null;
  stock: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  hasHydrated: boolean;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
  getCartSubtotal: () => number;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          // Add new item to cart
          set({
            items: [...items, { 
              ...product, 
              quantity, 
              addedAt: new Date() 
            }]
          });
        }
      },

      removeFromCart: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      isInCart: (productId) => {
        return get().items.some(item => item.id === productId);
      },

      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        return get().items.length;
      },

      getCartSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
