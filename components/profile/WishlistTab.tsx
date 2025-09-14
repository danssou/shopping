'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useNotifications } from '@/components/notifications';
import { useWishlist } from '@/hooks/useStore';
import { useCartStore } from '@/lib/stores';

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  image?: string;
  category?: string;
}

export default function WishlistTab() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCartStore();
  const { success, error: showError } = useNotifications();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleRemoveFromWishlist = (itemId: string) => {
    const item = wishlistItems.find((item: WishlistItem) => item.id === itemId);
    if (item) {
      removeFromWishlist(itemId);
      success('Removed from Wishlist', `${item.name} has been removed from your wishlist`);
    }
  };

  const handleMoveToCart = (item: WishlistItem) => {
    try {
      // Convert wishlist item to cart product format
      const cartProduct = {
        id: item.id,
        name: item.name,
        description: null,
        price: item.price,
        imageUrl: item.imageUrl || item.image || null,
        category: item.category || null,
        brand: null,
        stock: null,
        createdAt: null,
        updatedAt: null,
      };
      
      addToCart(cartProduct);
      removeFromWishlist(item.id);
      success('Added to Cart', `${item.name} has been moved to your cart`);
    } catch (error) {
      showError('Failed to Move', 'Failed to move item to cart');
    }
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;
    
    if (confirm(`Are you sure you want to remove all ${wishlistItems.length} items from your wishlist?`)) {
      clearWishlist();
      success('Wishlist Cleared', 'All items have been removed from your wishlist');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, startIndex + itemsPerPage);

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartSolidIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
        <p className="text-gray-400 mb-6">
          Start adding products to your wishlist by clicking the heart icon on product cards
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-yellow-500 text-slate-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">My Wishlist</h3>
          <p className="text-gray-400">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/wishlist"
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            View All
          </Link>
          <button
            onClick={handleClearWishlist}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item: WishlistItem) => (
          <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors border border-slate-700">
            <div className="relative group">
              <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden mb-3">
                <Image
                  src={item.imageUrl || item.image || '/placeholder.jpg'}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                aria-label="Remove from wishlist"
              >
                <HeartIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white line-clamp-2">{item.name}</h4>
              {item.category && (
                <p className="text-sm text-gray-400">{item.category}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-yellow-400">${item.price}</span>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-slate-900 text-sm font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}