'use client';

import { useStore } from '@/lib/store';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const cart = useStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">CODALWARE Store</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Products</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            
            {/* Shopping Cart */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
