// Export all stores from a centralized location
export { useCartStore } from './cart';
export { useWishlistStore } from './wishlist';
export { useUserProfileStore } from './userProfile';

// Export types
export type { 
  Product, 
  CartItem 
} from './cart';

export type { 
  WishlistItem 
} from './wishlist';

export type { 
  UserProfile, 
  UserDevice, 
  UserAddress, 
  UserPreferences 
} from './userProfile';
