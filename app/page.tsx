'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Loading } from '@/components/ui';
import { Card } from '@/components';
import { FEATURED_PRODUCTS } from '@/constants';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  category: string | null;
  brand: string | null;
  stock: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function Home() {
  const { products, loading, error, setProducts, setLoading, setError } = useStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [setProducts, setLoading, setError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
            </div>
          );
      </div>
    );
  }

  return (
    <div className="font-jost min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section with Local Images */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="CODALWARE Hero Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Premium
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Technology</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Discover CODALWARE&apos;s cutting-edge products and innovative solutions. Quality crafted for the digital future.
              </p>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                Shop Now
              </button>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/hero-shoe.png"
                alt="Featured CODALWARE Product"
                width={500}
                height={400}
                className="max-w-md lg:max-w-lg xl:max-w-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section using new Card component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-bold text-heading-1 text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Discover our latest collection of premium products</p>
        </div>

        {/* Demo Cards using new Card component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {FEATURED_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              title={product.title}
              category={product.category}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              colors={product.colors}
              isBestSeller={product.isBestSeller}
              onAddToCart={(id) => console.log('Added to cart:', id)}
              onToggleWishlist={(id) => console.log('Toggled wishlist:', id)}
            />
          ))}
        </div>

        {/* Database Products */}
        {loading && <Loading />}
        
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error Loading Products</h3>
              <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Check back later for new arrivals!</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Products</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      category={product.category || 'Shoes'}
                      price={`$${product.price}`}
                      image={product.imageUrl || '/shoes/shoe-1.jpg'}
                      colors={3}
                      onAddToCart={(id) => console.log('Added to cart:', id)}
                      onToggleWishlist={(id) => console.log('Toggled wishlist:', id)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
      
    </div>
  );
    }
