'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useCart, useWishlist, convertToCartProduct, convertToWishlistItem, convertConstantToCartProduct, convertConstantToWishlistItem } from '@/hooks/useStore';
import { useSession } from '@/lib/auth-client';
import { Loading, ErrorCard } from '@/components/ui';
import { Card } from '@/components';
import { FEATURED_PRODUCTS } from '@/constants';
import SignInModal from '@/components/auth/SignInModal';
import { useNotifications } from '@/components/notifications';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

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

const Home = () => {
  const { products, loading, error: storeError, setProducts, setLoading, setError } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { data: session } = useSession();
  const { success, error, warning, info } = useNotifications();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingWishlistAction, setPendingWishlistAction] = useState<{ id: string; type: 'featured' | 'product' } | null>(null);

  // Test functions for all notification types
  const testSuccessNotification = () => {
    success(
      'Success!',
      'This is a successful operation notification with beautiful green styling.',
      {
        icon: ShoppingBagIcon,
        duration: 4000
      }
    );
  };

  const testErrorNotification = () => {
    error(
      'Error Occurred',
      'This is an error notification with attention-grabbing red styling.',
      {
        duration: 5000
      }
    );
  };

  const testWarningNotification = () => {
    warning(
      'Warning',
      'This is a warning notification with noticeable amber styling.',
      {
        duration: 4500
      }
    );
  };

  const testInfoNotification = () => {
    info(
      'Information',
      'This is an informational notification with calming blue styling.',
      {
        duration: 4000
      }
    );
  };

  // Test function to simulate cart restoration
  const testCartRestoration = () => {
    // Simulate having items in localStorage for a user
    const testUserId = 'test-user-123';
    const testCartItems = [
      { id: '1', name: 'Test Product 1', price: '29.99', quantity: 2 },
      { id: '2', name: 'Test Product 2', price: '49.99', quantity: 1 }
    ];
    
    // Save test cart to localStorage
    localStorage.setItem(`user-cart-${testUserId}`, JSON.stringify(testCartItems));
    localStorage.setItem('auth-state', 'guest');
    
    success(
      'Test Cart Simulation Setup',
      'Cart data saved to localStorage. Now sign in to test restoration!',
      {
        duration: 4000
      }
    );
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products from database');
      }
      
      const data: Product[] = await response.json();
      
      // If no products in database, use featured products as fallback
      if (!data || data.length === 0) {
        console.log('No products in database, using featured products as fallback');
        const fallbackProducts: Product[] = FEATURED_PRODUCTS.map(product => ({
          id: product.id,
          name: product.title,
          description: `${product.category} - Available in ${product.colors} colors`,
          price: product.price,
          imageUrl: product.image || null,
          category: product.category || null,
          brand: 'CODALWARE',
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        setProducts(fallbackProducts);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      console.log('Using featured products as fallback due to API error');
      
      // Use featured products as fallback when API fails
      const fallbackProducts: Product[] = FEATURED_PRODUCTS.map(product => ({
        id: product.id,
        name: product.title,
        description: `${product.category} - Available in ${product.colors} colors`,
        price: product.price,
        imageUrl: product.image || null,
        category: product.category || null,
        brand: 'CODALWARE',
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setProducts(fallbackProducts);
      
      // Show a warning instead of an error since we have fallback data
      warning(
        'Database Connection Issue',
        'Using cached product data. Some features may be limited.',
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  }, [setProducts, setLoading, setError, warning]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSignInSuccess = () => {
    if (pendingWishlistAction) {
      if (pendingWishlistAction.type === 'featured') {
        const productData = FEATURED_PRODUCTS.find(p => p.id === pendingWishlistAction.id);
        if (productData) {
          const wishlistItem = convertConstantToWishlistItem(productData);
          toggleWishlist(wishlistItem);
        }
      } else {
        const productData = products.find(p => p.id === pendingWishlistAction.id);
        if (productData) {
          const wishlistItem = convertToWishlistItem(productData as unknown as Record<string, unknown>);
          toggleWishlist(wishlistItem);
        }
      }
      setPendingWishlistAction(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (storeError) {
    return <ErrorCard error={storeError} onRetry={fetchProducts} fullScreen={true} />;
  }

  return (
    <div className="font-jost min-h-screen bg-slate-900">
      
      {/* Modern Hero Section with Industry Standards */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.4)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.4)_0%,transparent_50%)]"></div>
        </div>

        {/* Background Image with Modern Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="CODALWARE Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60"></div>
        </div>

        {/* Modern Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full min-h-[inherit]">
            
            {/* Content Column */}
            <div className="text-center lg:text-left space-y-8 lg:space-y-10">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white/90">New Collection 2024</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="block text-white">Step Into</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Tomorrow
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover our premium collection of athletic footwear designed for performance, 
                  comfort, and style. Every step counts.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  <span>Shop Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 001.5-1.5V7a3 3 0 113 3v1.5a1.5 1.5 0 001.5 1.5H18m-3-7a3 3 0 11-6 0m6 0a3 3 0 11-6 0m6 0a3 3 0 11-6 0" />
                  </svg>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-white/10">
                <div className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>

              {/* Hidden Development Test Buttons */}
              <div className="hidden xl:flex flex-wrap gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity justify-center lg:justify-start">
                <button 
                  onClick={testSuccessNotification}
                  className="bg-emerald-500/80 text-white px-3 py-1 rounded-lg font-medium text-xs hover:bg-emerald-600 transition-colors duration-200 shadow-lg backdrop-blur-sm"
                >
                  ✅ Success
                </button>
                <button 
                  onClick={testErrorNotification}
                  className="bg-red-500/80 text-white px-3 py-1 rounded-lg font-medium text-xs hover:bg-red-600 transition-colors duration-200 shadow-lg backdrop-blur-sm"
                >
                  ❌ Error
                </button>
                <button 
                  onClick={testWarningNotification}
                  className="bg-amber-500/80 text-white px-3 py-1 rounded-lg font-medium text-xs hover:bg-amber-600 transition-colors duration-200 shadow-lg backdrop-blur-sm"
                >
                  ⚠️ Warning
                </button>
                <button 
                  onClick={testInfoNotification}
                  className="bg-blue-500/80 text-white px-3 py-1 rounded-lg font-medium text-xs hover:bg-blue-600 transition-colors duration-200 shadow-lg backdrop-blur-sm"
                >
                  ℹ️ Info
                </button>
                <button 
                  onClick={testCartRestoration}
                  className="bg-purple-500/80 text-white px-3 py-1 rounded-lg font-medium text-xs hover:bg-purple-600 transition-colors duration-200 shadow-lg backdrop-blur-sm"
                >
                  🛒 Cart
                </button>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* Hero Shoe with Modern Animation */}
                <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                  <Image
                    src="/hero-shoe.png"
                    alt="Premium Athletic Shoe"
                    width={600}
                    height={400}
                    className="w-full max-w-lg h-auto drop-shadow-2xl"
                    priority
                  />
                </div>
                
                {/* Floating Elements - Responsive positioning */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse z-20"></div>
                <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 lg:-bottom-12 lg:-left-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000 z-20"></div>
                
                {/* Product Highlight Cards - Responsive positioning */}
                <div className="absolute top-4 -left-4 sm:top-6 sm:-left-6 lg:top-8 lg:-left-8 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 animate-float z-30">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full"></div>
                    <span className="text-white font-medium text-xs lg:text-sm">Premium Quality</span>
                  </div>
                </div>
                
                <div className="absolute top-8 -right-8 sm:top-12 sm:-right-10 lg:top-16 lg:-right-12 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 animate-float delay-500 z-30">
                  <div className="text-center">
                    <div className="text-white font-bold text-base lg:text-lg">$149</div>
                    <div className="text-gray-300 text-xs lg:text-sm">Limited Offer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section using new Card component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 
            className="text-white font-bold mb-4 text-center text-heading-1"
          >
            Featured Products
          </h2>
          <p 
            className="text-gray-300 text-center max-w-2xl mx-auto text-body "
          >
            Discover our latest collection of premium products
          </p>
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
              onAddToCart={(id) => {
                const productData = FEATURED_PRODUCTS.find(p => p.id === id);
                if (productData) {
                  const cartProduct = convertConstantToCartProduct(productData);
                  addToCart(cartProduct);
                }
              }}
              onToggleWishlist={(id) => {
                if (!session) {
                  setPendingWishlistAction({ id, type: 'featured' });
                  setShowSignInModal(true);
                  return;
                }
                const productData = FEATURED_PRODUCTS.find(p => p.id === id);
                if (productData) {
                  const wishlistItem = convertConstantToWishlistItem(productData);
                  toggleWishlist(wishlistItem);
                }
              }}
            />
          ))}
        </div>

        {/* Database Products */}
        {loading && <Loading />}
        
        {storeError && (
          <ErrorCard error={storeError} onRetry={fetchProducts} />
        )}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-800 rounded-md p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">No products found</h3>
                  <p className="text-gray-400">Check back later for new arrivals!</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">All Products</h3>
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
                      onAddToCart={(id) => {
                        const productData = products.find(p => p.id === id);
                        if (productData) {
                          const cartProduct = convertToCartProduct(productData as unknown as Record<string, unknown>);
                          addToCart(cartProduct);
                        }
                      }}
                      onToggleWishlist={(id) => {
                        if (!session) {
                          setPendingWishlistAction({ id, type: 'product' });
                          setShowSignInModal(true);
                          return;
                        }
                        const productData = products.find(p => p.id === id);
                        if (productData) {
                          const wishlistItem = convertToWishlistItem(productData as unknown as Record<string, unknown>);
                          toggleWishlist(wishlistItem);
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
      
      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
};

export default Home;
