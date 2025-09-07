'use client';

import { useStore } from '@/lib/store';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-slate-800 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-slate-400 text-center">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-700 rounded"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-slate-400">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border border-slate-600 rounded text-white hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border border-slate-600 rounded text-white hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-white">Total: ${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-500 mb-2">
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
