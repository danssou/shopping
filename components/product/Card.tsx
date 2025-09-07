'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
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

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleWishlistToggle = () => {
    setWishlistState(!wishlistState);
    onToggleWishlist?.(id);
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
        <span className="bg-orange text-light-100 text-caption font-medium px-3 py-1 rounded-full">
          Best Seller
        </span>
      </div>
    );
  };

  const renderWishlistButton = () => (
    <button
      onClick={handleWishlistToggle}
      className="absolute top-4 right-4 z-10 p-2 bg-light-100 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-light-200"
      aria-label="Add to wishlist"
    >
      {wishlistState ? (
        <HeartSolidIcon className="h-5 w-5 text-red" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-300" />
      )}
    </button>
  );

  const renderQuickAddButton = () => (
    <div 
      className={`absolute inset-x-4 bottom-4 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <button
        onClick={handleAddToCart}
        className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-full font-medium hover:bg-dark-700 transition-colors duration-200 flex items-center justify-center space-x-2"
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
      {renderQuickAddButton()}
    </div>
  );

  const renderColorsInfo = () => {
    if (!colors) return null;
    
    return (
      <p className="text-gray-400 text-caption mb-3">
        {colors} Colour{colors > 1 ? 's' : ''}
      </p>
    );
  };

  const renderPricing = () => (
    <div className="flex items-center space-x-2">
      <span className="text-white text-body-medium font-medium">
        {price}
      </span>
      {originalPrice && (
        <span className="text-gray-400 text-body line-through">
          {originalPrice}
        </span>
      )}
    </div>
  );

  const renderProductInfo = () => (
    <div className="p-4">
      {/* Title & Category */}
      <div className="mb-2">
        <h3 className="text-heading-3 font-medium text-white line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-gray-400 text-body">
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
    <div className="p-[2px] bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent rounded-xl shadow-lg">
      <div 
        className={`group relative bg-slate-800 overflow-hidden transition-all duration-300 rounded-[10px] ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Overlay Elements */}
        {renderBestSellerBadge()}
        {renderWishlistButton()}

        {/* Main Content */}
        {renderProductImage()}
        {renderProductInfo()}
      </div>
    </div>
  );
};

export default Card;
