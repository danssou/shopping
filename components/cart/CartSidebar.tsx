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
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total: ${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 mb-2">
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
