'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { RecommendationsSection } from '@/components';
import { FEATURED_PRODUCTS } from '@/constants';
import { Loading } from '@/components/ui';

const RecommendationsPage = () => {
  const { products, loading, error, setProducts, setLoading, setError } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) return; // Don't fetch if we already have products
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products.length, setProducts, setLoading, setError]);

  if (loading) {
    return (
      <div className="bg-slate-900 text-white py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold mb-4">Error Loading Recommendations</h1>
            <p className="text-slate-400 text-center mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Recommendations
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover products tailored just for you with our intelligent recommendation system
          </p>
        </div>

        {/* Recommendations Section */}
        <RecommendationsSection
          products={[...FEATURED_PRODUCTS, ...products]}
          className="mt-8"
          maxItems={12}
          showLogic={true}
        />
      </div>
    </div>
  );
};

export default RecommendationsPage;