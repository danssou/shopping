import { useCallback } from 'react';
import { useCartStore, useWishlistStore } from '@/lib/stores';
import { Product } from '@/lib/stores/cart';
import { ProductConstant } from '@/constants/products';

/**
 * Custom hook for cart operations
 */
export const useCart = () => {
  const {
    items,
    addToCart: addToCartStore,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartCount,
    getCartSubtotal,
  } = useCartStore();

  const addToCart = useCallback((product: Product, quantity = 1) => {
    addToCartStore(product, quantity);
    
    // Show success notification (you can integrate with a toast library)
    console.log(`Added ${product.name} to cart`);
  }, [addToCartStore]);

  const removeItem = useCallback((productId: string) => {
    removeFromCart(productId);
    console.log('Removed item from cart');
  }, [removeFromCart]);

  return {
    items,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    count: getCartCount(),
    subtotal: getCartSubtotal(),
  };
};

/**
 * Custom hook for wishlist operations
 */
export const useWishlist = () => {
  const {
    items,
    addToWishlist: addToWishlistStore,
    removeFromWishlist,
    toggleWishlist: toggleWishlistStore,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  } = useWishlistStore();

  const addToWishlist = useCallback((item: Parameters<typeof addToWishlistStore>[0]) => {
    addToWishlistStore(item);
    console.log(`Added ${item.name} to wishlist`);
  }, [addToWishlistStore]);

  const removeFromWishlistWithNotification = useCallback((id: string) => {
    removeFromWishlist(id);
    console.log('Removed from wishlist');
  }, [removeFromWishlist]);

  const toggleWishlist = useCallback((item: Parameters<typeof toggleWishlistStore>[0]) => {
    const wasInWishlist = isInWishlist(item.id);
    toggleWishlistStore(item);
    console.log(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  }, [toggleWishlistStore, isInWishlist]);

  return {
    items,
    addToWishlist,
    removeFromWishlist: removeFromWishlistWithNotification,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    count: getWishlistCount(),
  };
};

/**
 * Helper function to convert product data to the required format
 */
export const convertToCartProduct = (productData: Record<string, unknown>): Product => {
  return {
    id: String(productData.id),
    name: String(productData.name || productData.title),
    description: productData.description ? String(productData.description) : null,
    price: String(productData.price).replace('$', ''),
    imageUrl: productData.imageUrl || productData.image ? String(productData.imageUrl || productData.image) : null,
    category: productData.category ? String(productData.category) : null,
    brand: productData.brand ? String(productData.brand) : null,
    stock: productData.stock ? Number(productData.stock) : null,
    createdAt: productData.createdAt ? new Date(String(productData.createdAt)) : null,
    updatedAt: productData.updatedAt ? new Date(String(productData.updatedAt)) : null,
  };
};

/**
 * Helper function to convert ProductConstant to cart product format
 */
export const convertConstantToCartProduct = (productData: ProductConstant): Product => {
  return {
    id: productData.id,
    name: productData.title,
    description: null,
    price: productData.price.replace('$', ''),
    imageUrl: productData.image,
    category: productData.category,
    brand: null,
    stock: null,
    createdAt: null,
    updatedAt: null,
  };
};

/**
 * Helper function to convert product data to wishlist item format
 */
export const convertToWishlistItem = (productData: Record<string, unknown>) => {
  return {
    id: String(productData.id),
    name: String(productData.name || productData.title),
    price: String(productData.price),
    imageUrl: String(productData.imageUrl || productData.image),
    category: productData.category ? String(productData.category) : undefined,
  };
};

/**
 * Helper function to convert ProductConstant to wishlist item format
 */
export const convertConstantToWishlistItem = (productData: ProductConstant) => {
  return {
    id: productData.id,
    name: productData.title,
    price: productData.price,
    imageUrl: productData.image,
    category: productData.category,
  };
};
