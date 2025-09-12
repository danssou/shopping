// Re-export from utility modules
export * from './formatters';
export * from './validation';
export * from './notifications';

// Legacy utilities (consider moving to formatters.ts)
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice);
};

export const formatStock = (stock: number | null): string => {
  if (!stock || stock <= 0) return 'Out of stock';
  if (stock === 1) return '1 in stock';
  return `${stock} in stock`;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
