import type { Metadata } from "next";

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

export const SITE_METADATA: Metadata = {
  title: {
    default: "CODALWARE Store - Premium Products & Technology | Shop Official CODALWARE Products",
    template: "%s | CODALWARE Store - Premium Products & Technology"
  },
  description: "Shop the latest CODALWARE products and technology solutions. Find premium quality CODALWARE products with fast shipping.",
  keywords: [
    "CODALWARE", "technology", "premium products", "software", "solutions",
    "tech store", "CODALWARE products", "official CODALWARE"
  ],
  authors: [{ name: "CODALWARE Ltd co" }],
  creator: "CODALWARE Store",
  publisher: "CODALWARE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://codalware.com'), 
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CODALWARE Store - Premium Products & Technology",
    description: "Shop the latest CODALWARE products and technology solutions. Premium quality CODALWARE products with fast shipping.",
    url: 'https://codalware-store.vercel.app', 
    siteName: 'CODALWARE Store',
    images: [
      {
        url: '/og-image.jpg', // We'll create this
        width: 1200,
        height: 630,
        alt: 'CODALWARE Store - Premium Product Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CODALWARE Store - Premium Products & Technology",
    description: "Shop the latest CODALWARE products and technology solutions. Premium quality CODALWARE products.",
    images: ['/og-image.jpg'], // We'll create this
    creator: '@codalwarestore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const STRUCTURED_DATA = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CODALWARE Store",
    "description": "Premium products and technology solutions store featuring official CODALWARE products",
    "url": "https://codalware-store.vercel.app"
  }
};

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
