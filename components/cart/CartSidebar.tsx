'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useStore';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import SignInModal from '@/components/auth/SignInModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { data: session } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!session) {
      // Show sign-in modal instead of redirecting
      setShowSignInModal(true);
      return;
    }
    // Proceed to checkout if authenticated
    window.location.href = '/checkout';
  };

  const handleSignInSuccess = () => {
    // After successful sign-in, proceed to checkout
    window.location.href = '/checkout';
  };

  return (
    <>
      <div className="fixed right-4 top-4 bottom-4 w-96 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl rounded-xl border border-slate-600/50 z-50 flex flex-col">
      <div className="p-6 border-b border-slate-600 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-t-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBagIcon className="h-6 w-6 text-yellow-400" />
              Shopping Cart
            </h2>
            <p className="text-sm text-yellow-400 font-medium">{items.length} items</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-600/20 rounded-full text-white hover:text-yellow-400 transition-all duration-200 hover:rotate-90 hover:scale-110 active:scale-95">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 h-full">
            <ShoppingBagIcon className="w-16 h-16 text-slate-500 mb-4" />
            <p className="text-slate-300 font-medium">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/30 hover:border-yellow-500/40">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-600 rounded-lg overflow-hidden">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-yellow-400 font-bold">${item.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gradient-to-br from-red-500/30 to-red-600/30 hover:from-red-500/50 hover:to-red-600/50 rounded-lg text-red-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                        >
                          −
                        </button>
                        <span className="text-white font-bold w-10 text-center bg-slate-600/30 rounded-lg py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gradient-to-br from-green-500/30 to-emerald-600/30 hover:from-green-500/50 hover:to-emerald-600/50 rounded-lg text-green-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-slate-600 p-6 bg-slate-800 rounded-b-xl flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-white">Total:</span>
            <span className="text-2xl font-bold text-yellow-400">${subtotal.toFixed(2)}</span>
          </div>
          <div className="space-y-3">
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border border-emerald-500/20"
            >
              <span className="mr-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h12.6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </span>
              {session ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
            <button 
              onClick={clearCart} 
              className="w-full bg-gradient-to-br from-slate-600/70 to-slate-700/70 hover:from-red-600/70 hover:to-red-700/70 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md border border-slate-500/20 hover:border-red-500/30 flex items-center justify-center"
            >
              <span className="mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Sign In Modal */}
    <SignInModal
      isOpen={showSignInModal}
      onClose={() => setShowSignInModal(false)}
      onSuccess={handleSignInSuccess}
      redirectTo="/checkout"
    />
  </>
  );
}

// Remove the export line
