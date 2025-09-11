import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category?: string;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  
  // Actions
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const items = get().items;
        const exists = items.some(existingItem => existingItem.id === item.id);
        
        if (!exists) {
          set({
            items: [...items, { ...item, addedAt: new Date() }]
          });
        }
      },

      removeFromWishlist: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },

      toggleWishlist: (item) => {
        const isInWishlist = get().isInWishlist(item.id);
        
        if (isInWishlist) {
          get().removeFromWishlist(item.id);
        } else {
          get().addToWishlist(item);
        }
      },

      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),

      getWishlistCount: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
