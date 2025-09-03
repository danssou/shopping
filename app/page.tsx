import React from "react";
import Image from "next/image";
import { getProducts } from "./lib/getProducts";
import type { Product } from "./lib/store";

export default async function Home() {
  const products: Product[] = await getProducts();
  
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold mb-2">Nike Store</h1>
        <p className="text-gray-600 mb-8">Premium Nike products from our database</p>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-7xl">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-6 flex flex-col items-center bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative w-32 h-32 mb-4">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover rounded-md" 
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-center">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2 text-center line-clamp-2">{product.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">{product.brand}</span>
                <span className="px-2 py-1 bg-blue-100 text-xs rounded">{product.category}</span>
                <span className="px-2 py-1 bg-green-100 text-xs rounded">Size {product.size}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400">★</span>
                <span className="text-sm">{product.rating}/5</span>
                <span className="text-sm text-gray-500">({product.stock} in stock)</span>
              </div>
              <span className="font-bold text-xl text-green-700">${(product.price / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
