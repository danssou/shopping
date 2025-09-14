'use client';

import { useWishlist } from '@/hooks/useStore';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { NavigationHelper } from '@/components/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <NavigationHelper />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <HeartSolidIcon className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-slate-400 text-center mb-8">
              Discover amazing products and add them to your wishlist!
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <NavigationHelper />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
            <p className="text-slate-400">{wishlistItems.length} items saved</p>
          </div>
          <button
            onClick={clearWishlist}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-700">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      No Image
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <HeartSolidIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                {item.category && (
                  <p className="text-sm text-blue-400 font-medium">{item.category}</p>
                )}
                <p className="text-2xl font-bold text-green-400"></p>
                
                <button
                  onClick={() => {
                    console.log('Added to cart:', item);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors mt-4"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
