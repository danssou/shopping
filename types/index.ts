// ========================================
// CORE PRODUCT TYPES
// ========================================

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
}

export interface WishlistItem {
  id: string;
  title: string;
  price: string;
  image: string;
  category?: string;
  addedAt?: Date;
}

// ========================================
// ORDER & TRACKING TYPES
// ========================================

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderTrackingStep {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  current: boolean;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

export type OrderStatus = 'delivered' | 'processing' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery?: string;
  trackingNumber?: string;
  timeline: OrderTrackingStep[];
}

// ========================================
// AUTHENTICATION TYPES
// ========================================

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  user: User;
  expires: string;
}

// ========================================
// STORE TYPES
// ========================================

export interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
  isInWishlist: (itemId: string) => boolean;
}

// ========================================
// COMPONENT PROPS TYPES
// ========================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  id: string;
  title: string;
  category?: string;
  price: string;
  originalPrice?: string;
  image: string;
  colors?: number;
  isBestSeller?: boolean;
  isWishlisted?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
}

export interface NavigationHelperProps extends BaseComponentProps {
  showBackButton?: boolean;
  showContinueShoppingButton?: boolean;
  customBackPath?: string;
  customBackLabel?: string;
}

// ========================================
// API TYPES
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// ========================================
// UTILITY TYPES
// ========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  duration?: number;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
