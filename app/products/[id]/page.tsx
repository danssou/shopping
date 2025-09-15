"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { HeartIcon, TruckIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { NavigationHelper } from '@/components/navigation';
import Gallery from '@/components/product/Gallery';
import ProductInfo from '@/components/product/ProductInfo';
import { useCart, useWishlist, convertConstantToCartProduct, convertConstantToWishlistItem } from '@/hooks/useStore';
import { FEATURED_PRODUCTS } from '@/constants/products';
import { getProductById as mockGetProductById } from '@/constants/productMocks';
import { useNotifications } from '@/components/notifications';
// Page-local product types (shape used by this page)
interface PageVariant {
  id: string;
  color: string;
  sizes: string[];
  stock: number;
  images: string[];
}

interface PageProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  variants: PageVariant[];
  inStock: boolean;
  tags: string[];
}

// during dev use the central mock helper
const getProductById = mockGetProductById;

// NOTE: core Product types live in `types/index.ts`; prefer using shared types there.



export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<PageProduct | null>(null);
  const [loading, setLoading] = useState(true);
  // image index now handled by Gallery component
  const [selectedVariant, setSelectedVariant] = useState<PageVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success, error } = useNotifications();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
        setSelectedVariant(productData.variants[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      error('Please select a size', 'Size selection is required to add to cart.');
      return;
    }

    if (!product || !selectedVariant) return;

    addToCart({
      id: `${product.id}-${selectedVariant.id}-${selectedSize}`,
      name: product.name,
      price: product.price.toString(),
      imageUrl: selectedVariant.images[0],
      brand: product.brand,
      category: product.category,
      stock: selectedVariant.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: product.description
    });

    success(
      'Added to Cart!',
      `${product.name} (${selectedVariant.color}, Size ${selectedSize}) has been added to your cart.`
    );
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: `$${product.price}`,
      imageUrl: product.images[0],
      category: product.category
    });

    setIsWishlisted(!isWishlisted);
    
    if (!isWishlisted) {
      success('Added to Wishlist!', `${product.name} has been saved to your wishlist.`);
    } else {
      success('Removed from Wishlist', `${product.name} has been removed from your wishlist.`);
    }
  };

  // variant selection is handled by ProductInfo via onSelectVariant

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-full">
          <NavigationHelper />
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800 border-t-yellow-500 mx-auto mb-4 shadow-lg"></div>
            <p className="text-slate-300">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full">
          <NavigationHelper />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200">
      <NavigationHelper />
      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Product Images (delegated to Gallery component) */}
          <div>
            <Gallery
              images={selectedVariant?.images?.length ? selectedVariant.images : product.images}
              onOpenModal={() => setShowImageModal(true)}
            />
            {discount > 0 && (
              <div className="mt-2 text-sm text-red-400 font-semibold">Save {discount}%</div>
            )}
          </div>

            {/* Product Information (modular) */}
            <div className="mt-4">
              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                selectedSize={selectedSize || ''}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlistToggle}
                onSelectSize={(s: string) => setSelectedSize(s)}
                onChangeQuantity={(q: number) => setQuantity(q)}
                onSelectVariant={(v: PageVariant) => { setSelectedVariant(v); setSelectedSize(''); }}
              />
            </div>

          {/* Recommendations - compact horizontal with actions (moved down) */}
          <div className="space-y-8">
            {/* Features (kept above recommendations) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-slate-700">
              <div className="text-center">
                <TruckIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-100">Free Shipping</p>
                <p className="text-xs text-slate-300">On orders over $75</p>
              </div>
              <div className="text-center">
                <ArrowPathIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-100">Easy Returns</p>
                <p className="text-xs text-slate-300">30-day return policy</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-100">Warranty</p>
                <p className="text-xs text-slate-300">1-year manufacturer</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">You may also like</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {FEATURED_PRODUCTS.slice(0, 6).map((rec) => (
                  <div key={rec.id} className="flex-shrink-0 w-52 bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <Link href={`/products/${rec.id}`} className="block">
                      <div className="w-full h-28 rounded-md overflow-hidden bg-slate-700 mb-2">
                        <Image src={rec.image} alt={rec.title} width={208} height={120} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm text-slate-200 font-medium">{rec.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{rec.price}{rec.originalPrice ? ` • ${rec.category}` : ` • ${rec.category}`}</div>
                    </Link>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => addToCart(convertConstantToCartProduct(rec))}
                        className="flex-1 bg-yellow-500 text-slate-900 text-sm py-2 rounded-md font-medium hover:bg-yellow-600 transition-colors"
                        aria-label={`Add ${rec.title} to cart`}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => toggleWishlist(convertConstantToWishlistItem(rec))}
                        className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
                        aria-label={`${isInWishlist(rec.id) ? 'Remove' : 'Add'} ${rec.title} to wishlist`}
                      >
                        {isInWishlist(rec.id) ? (
                          <HeartSolidIcon className="w-5 h-5 text-red-400" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-slate-200" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 scroll-smooth">
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Product Details</h2>

              <div className="mb-6 block lg:hidden">
                {/* Mobile quick nav */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <a href="#description" className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-sm hover:bg-yellow-500/10">Description</a>
                  <a href="#features" className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-sm hover:bg-yellow-500/10">Features</a>
                  <a href="#specs" className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-sm hover:bg-yellow-500/10">Specs</a>
                  <a href="#tags" className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-sm hover:bg-yellow-500/10">Tags</a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <section id="description" className="prose prose-invert max-w-none">
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Overview</h3>
                    <p className="text-slate-300 leading-relaxed mb-4">{product.description}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full">
                        <strong className="text-slate-100">Brand:</strong> {product.brand}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full">
                        <strong className="text-slate-100">Category:</strong> {product.category}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full">
                        <strong className="text-slate-100">Rating:</strong> {product.rating}
                      </span>
                    </div>
                  </section>

                  <section id="features" className="pt-4">
                    <h4 className="text-md font-semibold text-slate-100 mb-3">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0">
                      {product.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section id="specs" className="pt-4">
                    <h4 className="text-md font-semibold text-slate-100 mb-3">Specifications</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <div key={key} className={`flex justify-between items-center py-2 px-3 rounded-lg ${idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/30'}`}>
                          <span className="font-medium text-slate-200">{key}</span>
                          <span className="text-slate-300">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section id="tags" className="pt-4">
                    <h4 className="text-md font-semibold text-slate-100 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm hover:bg-yellow-500/10 transition-colors cursor-pointer">{tag}</span>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="hidden lg:block lg:col-span-1 sticky top-28 self-start">
                  <nav className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 w-56">
                    <ul className="space-y-2">
                      <li><a href="#description" className="block text-slate-200 hover:text-yellow-400">Overview</a></li>
                      <li><a href="#features" className="block text-slate-200 hover:text-yellow-400">Key Features</a></li>
                      <li><a href="#specs" className="block text-slate-200 hover:text-yellow-400">Specifications</a></li>
                      <li><a href="#tags" className="block text-slate-200 hover:text-yellow-400">Tags</a></li>
                      <li><a href="#top" className="block text-slate-400 text-sm mt-3">Back to top ↑</a></li>
                    </ul>
                  </nav>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ×
          </button>
          <div className="max-w-4xl max-h-full">
            <Image
              src={selectedVariant?.images[0] || product.images[0]}
              alt={product.name}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}