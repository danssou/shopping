

// Env variables
export { PORT, NODE_ENV, DATABASE_URL, GMAIL_APP_PASSWORD } from './config/env';


// Nodemailer transporter
export { default as transporter } from './config/nodemailer';
// Re-export from utility modules
export * from './formatters';
export * from './validation';
export * from './notifications';
export * from './profile';
export * from './security';

// Product utilities
export {
  getProductTitle,
  getProductCategory,
  getProductPrice,
  getProductImage,
  convertToCartProduct,
  convertToWishlistItem
} from './helpers';

// Cart utilities
export {
  calculateCartTotal,
  calculateCartItemCount,
  findCartItem
} from './helpers';

// Order utilities
export {
  getOrderStatusColor,
  formatOrderStatus
} from './helpers';

// Array utilities
export {
  shuffleArray,
  groupBy,
  uniqueBy
} from './helpers';

// Storage utilities
export { storage } from './helpers';

// Date/Time utilities
export {
  formatDate,
  formatTime
} from './helpers';

// Slugify utility

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
