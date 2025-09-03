'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/product';
import { Header } from '@/components/layout';
import { Loading } from '@/components/ui';

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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      {/* Structured Data for Products */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Nike Products Collection",
              "description": "Premium Nike athletic wear, sneakers, and sports equipment",
              "numberOfItems": products.length,
              "itemListElement": products.map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.description,
                "image": product.imageUrl,
                "brand": {
                  "@type": "Brand",
                  "name": product.brand || "Nike"
                },
                "category": product.category,
                "offers": {
                  "@type": "Offer",
                  "price": product.price,
                  "priceCurrency": "USD",
                  "availability": product.stock && product.stock > 0 
                    ? "https://schema.org/InStock" 
                    : "https://schema.org/OutOfStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Nike Store"
                  }
                }
              }))
            })
          }}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Nike Products</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover our latest collection of premium athletic wear and sneakers</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
