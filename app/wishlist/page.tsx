'use client';

import { useWishlist, useCart } from '@/hooks/useStore';
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
              <p className="text-slate-400">
                {wishlistItems.length > 0 
                  ? `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved for later`
                  : 'No items saved yet'
                }
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center text-red-400 hover:text-red-300 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:border-red-400 transition-colors duration-200"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 max-w-md mx-auto">
              <HeartIcon className="h-20 w-20 text-slate-600 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-slate-400 mb-3">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-6">
                Discover amazing products and save your favorites for later
              </p>
              <Link
                href="/"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors duration-200">
                <div className="aspect-square relative group">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-400">No Image</span>
                    </div>
                  )}
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-red-400 hover:text-red-300 hover:bg-opacity-70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <HeartSolidIcon className="h-5 w-5" />
                  </button>

                  {/* Quick add to cart overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => {
                        // Convert wishlist item to cart product format
                        const cartProduct = {
                          id: item.id,
                          name: item.name,
                          description: null,
                          price: item.price.replace('$', ''),
                          imageUrl: item.imageUrl,
                          category: item.category || null,
                          brand: null,
                          stock: null,
                          createdAt: null,
                          updatedAt: null,
                        };
                        addToCart(cartProduct);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-white text-lg leading-tight">{item.name}</h3>
                    {item.category && (
                      <p className="text-slate-400 text-sm">{item.category}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-500">{item.price}</span>
                    <button
                      onClick={() => {
                        // Convert wishlist item to cart product format
                        const cartProduct = {
                          id: item.id,
                          name: item.name,
                          description: null,
                          price: item.price.replace('$', ''),
                          imageUrl: item.imageUrl,
                          category: item.category || null,
                          brand: null,
                          stock: null,
                          createdAt: null,
                          updatedAt: null,
                        };
                        addToCart(cartProduct);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200 flex items-center text-sm"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
