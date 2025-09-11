'use client';

import { useCart, useWishlist } from '@/hooks/useStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { addToWishlist } = useWishlist();

  const saveForLater = (item: any) => {
    // Convert cart item to wishlist format
    const wishlistItem = {
      id: item.id,
      name: item.name,
      price: `$${item.price}`,
      imageUrl: item.imageUrl,
      category: item.category,
    };
    addToWishlist(wishlistItem);
    removeItem(item.id);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-slate-800 shadow-2xl flex flex-col border-l border-slate-700 z-[10000]">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Shopping Cart ({items.length})</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full text-white transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-400 text-center">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-slate-700 p-3 rounded-lg">
                  <div className="w-16 h-16 bg-slate-600 rounded overflow-hidden flex-shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{item.name}</h3>
                    <p className="text-slate-400">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 border border-slate-600 rounded text-white hover:bg-slate-600 transition-colors duration-200"
                      >
                        -
                      </button>
                      <span className="text-white min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-slate-600 rounded text-white hover:bg-slate-600 transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Save for Later */}
                    <button
                      onClick={() => saveForLater(item)}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1 flex items-center"
                    >
                      <BookmarkIcon className="h-3 w-3 mr-1" />
                      Save for later
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with total and buttons - only show when cart has items */}
        {items.length > 0 && (
          <div className="border-t border-slate-700 p-6 bg-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Total: ${subtotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-3 rounded-lg font-semibold mb-3 transition-colors duration-200">
                Proceed to Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="w-full border border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
