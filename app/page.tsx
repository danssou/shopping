import React from "react";
import Image from "next/image";
import { getProducts } from "./lib/getProducts";
import { Product } from "./lib/store";

interface RawProduct {
  id: string | number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  image?: string | null;
}

function normalizeProduct(product: RawProduct): Product {
  return {
    id: typeof product.id === 'string' ? parseInt(product.id) : product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    price: product.price ?? 0,
    image: product.image ?? "",
  };
}

export default async function Home() {
  const rawProducts = await getProducts();
  const products: Product[] = rawProducts.map(normalizeProduct);
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
        <h2 className="text-2xl font-bold mb-4">Nike Products</h2>
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="border rounded-lg p-4 flex flex-col items-center">
              <Image src={product.image} alt={product.name} width={120} height={80} className="mb-2" />
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <span className="font-bold text-green-700">${(product.price / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
