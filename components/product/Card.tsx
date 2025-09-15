'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// ========================================
// TYPES & INTERFACES
// ========================================

interface CardProps {
  id: string;
  title: string;
  category?: string;
  price: string;
  originalPrice?: string;
  image: string;
  colors?: number;
  isBestSeller?: boolean;
  isWishlisted?: boolean;
  onAddToCart?: (...args: unknown[]) => void;
  onToggleWishlist?: (...args: unknown[]) => void;
  className?: string;
}



export const Card = ({
  id,
  title,
  category = "Men's Shoes",
  price,
  originalPrice,
  image,
  colors,
  isBestSeller = false,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  className = '',
}: CardProps) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistState, setWishlistState] = useState(isWishlisted);

  // Keep internal state in sync with external prop (store-driven updates)
  useEffect(() => {
    setWishlistState(isWishlisted);
  }, [isWishlisted]);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleWishlistToggle = () => {
    setWishlistState(!wishlistState);
    // Provide a normalized item object so parent handlers that expect the item shape work
    onToggleWishlist?.({
      id,
      name: title,
      price,
      imageUrl: image,
      category,
    });
  };

  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderBestSellerBadge = () => {
    if (!isBestSeller) return null;
    
    return (
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          ⭐ Best Seller
        </span>
      </div>
    );
  };

  const renderWishlistButton = () => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWishlistToggle();
      }}
      className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl"
      aria-label="Add to wishlist"
    >
      {wishlistState ? (
        <HeartSolidIcon className="h-5 w-5 text-red-500 drop-shadow-sm" />
      ) : (
        <HeartIcon className="h-5 w-5 text-slate-700 drop-shadow-sm" />
      )}
    </button>
  );

  const renderQuickAddButton = () => (
    <div 
      className={`transition-all duration-500 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
      >
        <ShoppingBagIcon className="h-5 w-5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );

  const renderProductImage = () => (
    <div className="relative aspect-square overflow-hidden bg-light-200">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
  );

  const renderColorsInfo = () => {
    if (!colors) return null;
    
    return (
      <div className="text-slate-400 text-caption mb-3 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
        </div>
        <span>{colors} Color{colors > 1 ? 's' : ''}</span>
      </div>
    );
  };

  const renderPricing = () => (
    <div className="flex items-center space-x-2">
      <span className="text-white text-body-medium font-bold">
        {price}
      </span>
      {originalPrice && (
        <span className="text-slate-400 text-body line-through">
          {originalPrice}
        </span>
      )}
    </div>
  );

  const renderProductInfo = () => (
    <div className="p-4 pb-16">
      {/* Title & Category */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1 group-hover:text-yellow-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-body">
          {category}
        </p>
      </div>

      {/* Colors Available */}
      {renderColorsInfo()}

      {/* Pricing */}
      {renderPricing()}
    </div>
  );

  // ========================================
  // MAIN RENDER
  // ========================================

  return (
    <div className="group p-[1px] bg-gradient-to-br from-yellow-500/50 via-blue-500/30 to-yellow-600/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      <div
        className={`relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm overflow-hidden transition-all duration-500 rounded-2xl border border-slate-700/50 hover:border-yellow-500/50 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced Overlay Elements */}
        {renderBestSellerBadge()}
        {renderWishlistButton()}

        {/* Clickable Link to Product Details */}
        <Link href={`/products/${id}`} className="block">
          {/* Main Content */}
          {renderProductImage()}
          {renderProductInfo()}
        </Link>
        
        {/* Quick Add Button (outside link to remain functional) */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          {renderQuickAddButton()}
        </div>
      </div>
    </div>
  );
};

export default Card;
