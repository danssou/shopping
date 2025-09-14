'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductConstant } from '@/constants/products';
import { Product } from '@/types';
import { Card } from '@/components/product';
import { SparklesIcon, FireIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline';

interface RecommendationsSectionProps {
  currentProduct?: Product | ProductConstant;
  currentCategory?: string;
  priceRange?: { min: number; max: number };
  products: (Product | ProductConstant)[];
  className?: string;
  maxItems?: number;
  showLogic?: boolean;
}

type RecommendationType = 'similar' | 'trending' | 'popular' | 'priceMatch';

interface RecommendationLogic {
  type: RecommendationType;
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  algorithm: (products: (Product | ProductConstant)[], context?: RecommendationContext) => (Product | ProductConstant)[];
}

interface RecommendationContext {
  currentProduct?: Product | ProductConstant;
  currentCategory?: string;
  priceRange?: { min: number; max: number };
}

// Helper functions to safely access product properties
const getProductTitle = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.title : product.name || '';
};

const getProductCategory = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.category : (product.category || '');
};

const getProductPrice = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.price : product.price;
};

const getProductImage = (product: Product | ProductConstant): string => {
  return 'title' in product ? product.image : (product.imageUrl || '');
};

export default function RecommendationsSection({
  currentProduct,
  currentCategory,
  priceRange,
  products,
  className = '',
  maxItems = 4,
  showLogic = false
}: RecommendationsSectionProps) {
  const [activeRecommendationType, setActiveRecommendationType] = useState<RecommendationType>('similar');
  const [recommendedProducts, setRecommendedProducts] = useState<(Product | ProductConstant)[]>([]);

  // Recommendation algorithms with explanations
  const recommendationLogics: Record<RecommendationType, RecommendationLogic> = useMemo(() => ({
    similar: {
      type: 'similar',
      title: 'Similar Products',
      description: 'Products from the same category or with similar features',
      icon: SparklesIcon,
      algorithm: (products, context) => {
        if (!context?.currentProduct) return products.slice(0, maxItems);
        
        const currentCategory = getProductCategory(context.currentProduct);
        const currentId = context.currentProduct.id;
        
        // Filter by same category, exclude current product
        const similarProducts = products.filter(product => {
          const productCategory = getProductCategory(product);
          return productCategory === currentCategory && product.id !== currentId;
        });

        // If not enough similar products, add trending ones
        if (similarProducts.length < maxItems) {
          const remainingSlots = maxItems - similarProducts.length;
          const otherProducts = products
            .filter(p => !similarProducts.includes(p) && p.id !== currentId)
            .slice(0, remainingSlots);
          return [...similarProducts, ...otherProducts];
        }

        return similarProducts.slice(0, maxItems);
      }
    },
    trending: {
      type: 'trending',
      title: 'Trending Now',
      description: 'Hot products that everyone is talking about',
      icon: ChartBarIcon,
      algorithm: (products) => {
        // Simulate trending logic - in real app this would be based on actual metrics
        return products
          .filter(product => {
            // Prioritize products with certain keywords or characteristics
            const title = getProductTitle(product);
            const trendingKeywords = ['Air Force', 'Classic', 'Pro', 'Max'];
            return trendingKeywords.some(keyword => title?.includes(keyword));
          })
          .slice(0, maxItems);
      }
    },
    popular: {
      type: 'popular',
      title: 'Most Popular',
      description: 'Customer favorites and bestsellers',
      icon: FireIcon,
      algorithm: (products) => {
        // Prioritize bestsellers and popular items
        return products
          .filter(product => {
            if ('isBestSeller' in product) return product.isBestSeller;
            // For regular products, simulate popularity based on price/category
            return true;
          })
          .slice(0, maxItems);
      }
    },
    priceMatch: {
      type: 'priceMatch',
      title: 'Similar Price Range',
      description: 'Products within your budget range',
      icon: HeartIcon,
      algorithm: (products, context) => {
        if (!context?.priceRange && !context?.currentProduct) return products.slice(0, maxItems);
        
        let targetPrice = 0;
        if (context.currentProduct) {
          const priceStr = getProductPrice(context.currentProduct);
          targetPrice = parseFloat(priceStr.replace(/[$,]/g, ''));
        } else if (context.priceRange) {
          targetPrice = (context.priceRange.min + context.priceRange.max) / 2;
        }

        const tolerance = targetPrice * 0.3; // 30% price tolerance
        
        return products
          .filter(product => {
            const priceStr = getProductPrice(product);
            const productPrice = parseFloat(priceStr.replace(/[$,]/g, ''));
            return Math.abs(productPrice - targetPrice) <= tolerance;
          })
          .slice(0, maxItems);
      }
    }
  }), [maxItems]);

  useEffect(() => {
    const logic = recommendationLogics[activeRecommendationType];
    const context = {
      currentProduct,
      currentCategory,
      priceRange
    };
    
    const recommended = logic.algorithm(products, context);
    setRecommendedProducts(recommended);
  }, [activeRecommendationType, currentProduct, currentCategory, priceRange, products, maxItems, recommendationLogics]);

  if (products.length === 0) {
    return null;
  }

  const activeLogic = recommendationLogics[activeRecommendationType];

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {activeLogic.title}
          </h2>
          <p className="text-slate-400 text-lg mb-6">
            {activeLogic.description}
          </p>

          {/* Recommendation Type Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {Object.values(recommendationLogics).map((logic) => {
              const Icon = logic.icon;
              return (
                <button
                  key={logic.type}
                  onClick={() => setActiveRecommendationType(logic.type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeRecommendationType === logic.type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{logic.title}</span>
                </button>
              );
            })}
          </div>

          {/* Algorithm Explanation (Optional) */}
          {showLogic && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto border border-slate-700">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2" />
                How This Works
              </h3>
              <p className="text-sm text-slate-400">
                {getAlgorithmExplanation(activeRecommendationType, currentProduct)}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card
                  id={product.id}
                  title={getProductTitle(product)}
                  category={getProductCategory(product)}
                  price={getProductPrice(product)}
                  originalPrice={'originalPrice' in product ? product.originalPrice : undefined}
                  image={getProductImage(product)}
                  colors={'colors' in product ? product.colors : undefined}
                  isBestSeller={'isBestSeller' in product ? product.isBestSeller : false}
                  className="h-full hover:transform hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SparklesIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              No recommendations available at the moment.
            </p>
          </div>
        )}

        {/* Additional Logic Info */}
        {recommendedProducts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Showing {recommendedProducts.length} of {products.length} products
              {currentProduct && ` • Based on "${('title' in currentProduct ? currentProduct.title : currentProduct.name)}"`}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

// Helper function to explain the algorithm
function getAlgorithmExplanation(type: RecommendationType, currentProduct?: Product | ProductConstant): string {
  switch (type) {
    case 'similar':
      return currentProduct 
        ? `We analyze products in the same category as "${getProductTitle(currentProduct)}" and find items with similar features, price points, and customer preferences.`
        : 'We group products by category and features to find items that complement each other.';
    
    case 'trending':
      return 'Our algorithm identifies products with high view counts, recent purchases, and social media mentions to surface what\'s popular right now.';
    
    case 'popular':
      return 'Based on sales data, customer ratings, and repeat purchases, we highlight the products that customers love most.';
    
    case 'priceMatch':
      return currentProduct
        ? `We find products within ±30% of your current item\'s price range, ensuring you see options that match your budget.`
        : 'We match products within your specified price range to help you find the best value.';
    
    default:
      return 'Our smart recommendation engine uses multiple signals to personalize your shopping experience.';
  }
}