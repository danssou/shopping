import { create } from 'zustand';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  stock: number;
  color: string;
  size: string;
  isFeatured: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
