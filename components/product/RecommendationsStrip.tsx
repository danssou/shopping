'use client';

import { useCart, useWishlist, convertConstantToCartProduct, convertConstantToWishlistItem } from '@/hooks/useStore';
import { FEATURED_PRODUCTS } from '@/constants/products';
import Card from './Card';

export default function RecommendationsStrip() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="py-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">You might also like</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {FEATURED_PRODUCTS.map((p) => (
          <div key={p.id} className="bg-slate-800 rounded-xl p-3">
            <Card
              id={p.id}
              title={p.title}
              price={p.price}
              image={p.image}
              category={p.category}
              isWishlisted={isInWishlist(p.id)}
              onAddToCart={() => addToCart(convertConstantToCartProduct(p))}
              onToggleWishlist={() => toggleWishlist(convertConstantToWishlistItem(p))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
