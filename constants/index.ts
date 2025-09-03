export const SITE_CONFIG = {
  name: 'Nike Store',
  description: 'Premium athletic wear and sneakers store featuring official Nike products',
  url: 'https://nike-store.vercel.app',
  title: 'Nike Store - Premium Athletic Wear & Sneakers',
  keywords: [
    'Nike', 'sneakers', 'athletic wear', 'Air Max', 'Air Force 1', 
    'Dri-FIT', 'sports equipment', 'running shoes', 'basketball shoes',
    'Nike apparel', 'sportswear', 'Nike store', 'official Nike'
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
