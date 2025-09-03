import Image from 'next/image';
import { useStore } from '@/lib/store';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 border border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
      itemScope 
      itemType="https://schema.org/Product"
    >
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} - ${product.brand} ${product.category}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
            itemProp="image"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-2"
            itemProp="name"
          >
            {product.name}
          </h3>
          <span 
            className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded whitespace-nowrap"
            itemProp="brand"
            itemScope
            itemType="https://schema.org/Brand"
          >
            <span itemProp="name">{product.brand}</span>
          </span>
        </div>
        
        {product.description && (
          <p 
            className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2"
            itemProp="description"
          >
            {product.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <span 
            className="text-2xl font-bold text-gray-900 dark:text-white"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <span itemProp="priceCurrency" content="USD">$</span>
            <span itemProp="price" content={product.price}>{product.price}</span>
            <meta 
              itemProp="availability" 
              content={product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} 
            />
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.stock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock <= 0}
          className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800 font-medium"
          aria-label={`Add ${product.name} to cart for $${product.price}`}
          type="button"
        >
          {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
}
