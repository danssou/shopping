export const SITE_CONFIG = {
  name: 'CODALWARE Store',
  description: 'Premium athletic wear and sneakers store featuring quality products and innovative design',
  url: 'https://codalware-store.vercel.app',
  title: 'CODALWARE Store - Premium Athletic Wear & Sneakers',
  keywords: [
    'CODALWARE', 'sneakers', 'athletic wear', 'shoes', 'comfort shoes', 
    'performance', 'sports equipment', 'running shoes', 'lifestyle shoes',
    'premium footwear', 'sportswear', 'CODALWARE store', 'quality products'
  ],
} as const;

export const NAVIGATION_LINKS = [
  { label: 'Products', href: '#', external: false },
  { label: 'About', href: '#', external: false },
  { label: 'Contact', href: '#', external: false },
] as const;

export const API_ENDPOINTS = {
  products: '/api/products',
  cart: '/api/cart',
} as const;

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Export products
export * from './products';
