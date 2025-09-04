export interface ProductConstant {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  colors: number;
  isBestSeller?: boolean;
}

export const FEATURED_PRODUCTS: ProductConstant[] = [
  {
    id: "1",
    title: "Air Force 1 Mid '07",
    category: "Men's Shoes",
    price: "$98.30",
    image: "/shoes/shoe-1.jpg",
    colors: 6,
    isBestSeller: true,
  },
  {
    id: "2",
    title: "Classic Runner Pro",
    category: "Running Shoes",
    price: "$129.99",
    originalPrice: "$159.99",
    image: "/shoes/shoe-2.webp",
    colors: 4,
  },
  {
    id: "3",
    title: "Urban Street Style",
    category: "Lifestyle Shoes",
    price: "$89.99",
    image: "/shoes/shoe-3.webp",
    colors: 3,
  },
  {
    id: "4",
    title: "Sport Elite Max",
    category: "Training Shoes",
    price: "$149.99",
    image: "/shoes/shoe-4.webp",
    colors: 5,
    isBestSeller: true,
  },
  {
    id: "5",
    title: "Premium Comfort",
    category: "Walking Shoes",
    price: "$119.99",
    originalPrice: "$139.99",
    image: "/shoes/shoe-5.avif",
    colors: 4,
  },
  {
    id: "6",
    title: "Athletic Performance",
    category: "Sports Shoes",
    price: "$169.99",
    image: "/shoes/shoe-6.avif",
    colors: 6,
  },
  {
    id: "7",
    title: "Casual Comfort Plus",
    category: "Casual Shoes",
    price: "$99.99",
    image: "/shoes/shoe-7.avif",
    colors: 3,
  },
  {
    id: "8",
    title: "High Performance",
    category: "Athletic Shoes",
    price: "$189.99",
    originalPrice: "$219.99",
    image: "/shoes/shoe-8.avif",
    colors: 4,
    isBestSeller: true,
  },
  {
    id: "9",
    title: "Retro Classic",
    category: "Heritage Shoes",
    price: "$109.99",
    image: "/shoes/shoe-9.avif",
    colors: 5,
  },
  {
    id: "10",
    title: "Modern Runner",
    category: "Running Shoes",
    price: "$139.99",
    image: "/shoes/shoe-10.avif",
    colors: 4,
  },
  {
    id: "11",
    title: "Street Culture",
    category: "Lifestyle Shoes",
    price: "$94.99",
    originalPrice: "$124.99",
    image: "/shoes/shoe-11.avif",
    colors: 3,
  },
  {
    id: "12",
    title: "Ultimate Comfort",
    category: "Comfort Shoes",
    price: "$159.99",
    image: "/shoes/shoe-12.avif",
    colors: 6,
    isBestSeller: true,
  },
];
