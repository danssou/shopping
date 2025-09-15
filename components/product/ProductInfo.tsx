'use client';

import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { ShoppingBagIcon, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface VariantLike {
  id: string;
  color: string;
  sizes: string[];
  stock: number;
  images: string[];
}

interface ProductLike {
  id: string;
  name: string;
  brand?: string | null;
  category?: string | null;
  price: number | string;
  rating?: number;
  reviewCount?: number;
  variants: VariantLike[];
}

interface ProductInfoProps {
  product: ProductLike;
  selectedVariant: VariantLike | null;
  selectedSize: string | null | '';
  quantity: number;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onSelectSize: (s: string) => void;
  onChangeQuantity: (q: number) => void;
  onSelectVariant: (v: VariantLike) => void;
}

export default function ProductInfo({ product, selectedVariant, selectedSize, quantity, onAddToCart, onToggleWishlist, onSelectSize, onChangeQuantity, onSelectVariant }: ProductInfoProps) {

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
          <span className="font-medium">{String(product.brand ?? '')}</span>
          <span>•</span>
          <span>{String(product.category ?? '')}</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-4 leading-tight">{String(product.name ?? '')}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarSolid key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.rating) || 0) ? 'text-yellow-400' : 'text-slate-700'}`} />
            ))}
          </div>
          <span className="text-sm text-slate-300">{String(product.rating ?? '0')} ({Number(product.reviewCount ?? 0).toLocaleString()} reviews)</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-slate-100">${String(product.price ?? '')}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Color: {String(selectedVariant?.color ?? '')}</h3>
        <div className="flex gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelectVariant(variant)}
              className={`relative group p-1 rounded-lg border-2 ${selectedVariant?.id === variant.id ? 'border-yellow-500 shadow-lg' : 'border-slate-700 hover:border-slate-500'}`}>
              <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                {variant.images[0] ? (
                  <Image src={variant.images[0]} alt={variant.color || 'variant'} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full bg-slate-700" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Size {selectedSize && `(US ${selectedSize})`}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {((selectedVariant?.sizes as string[]) || []).map((size: string) => (
            <button key={size} onClick={() => onSelectSize(size)} disabled={Number(selectedVariant?.stock ?? 0) === 0} className={`py-3 px-4 text-center border-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${selectedSize === size ? 'border-yellow-500 bg-yellow-500 text-slate-900' : 'border-slate-700 hover:border-slate-500 text-slate-200'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50">
            <button onClick={() => onChangeQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-slate-700/40 transition-colors text-slate-200">-</button>
            <span className="px-4 py-3 font-medium text-slate-100">{quantity}</span>
            <button onClick={() => onChangeQuantity(quantity + 1)} className="p-3 hover:bg-slate-700/40 transition-colors text-slate-200">+</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button onClick={onAddToCart} className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 text-slate-900 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-yellow-600 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
          <ShoppingBagIcon className="w-6 h-6" />
          Add to Cart
        </button>

        <button onClick={onToggleWishlist} className="w-full border-2 border-slate-700 text-slate-200 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/60 flex items-center justify-center gap-3">
          <HeartOutline className="w-6 h-6 text-red-500" />
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
