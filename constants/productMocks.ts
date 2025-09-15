export const SAMPLE_PRODUCT = {
  id: 'sample-1',
  name: "Air Force 1 Mid '07",
  brand: 'Nike',
  category: "Men's Shoes",
  price: 98.3,
  originalPrice: 119.99,
  rating: 4.6,
  reviewCount: 124,
  description: 'A versatile sneaker that blends performance with everyday comfort.',
  features: ['Responsive cushioning', 'Breathable upper', 'Lightweight design', 'Durable outsole'],
  specifications: { 'Upper Material': 'Mesh', 'Midsole': 'React Foam', 'Drop': '10mm' },
  images: ['/shoes/shoe-1.jpg', '/shoes/shoe-2.webp', '/shoes/shoe-3.webp'],
  variants: [
    { id: 'v1', color: 'Black/White', sizes: ['7','8','9','10'], stock: 15, images: ['/shoes/shoe-1.jpg', '/shoes/shoe-2.webp'] },
    { id: 'v2', color: 'White/Blue', sizes: ['7','8','9','10'], stock: 8, images: ['/shoes/shoe-3.webp', '/shoes/shoe-4.webp'] }
  ],
  inStock: true,
  tags: ['Running', 'Lifestyle', 'Comfort']
};

export const getProductById = async (id: string) => {
  // simulate network
  await new Promise((res) => setTimeout(res, 120));
  // return a shallow clone so callers may mutate safely
  return { ...SAMPLE_PRODUCT, id };
};
