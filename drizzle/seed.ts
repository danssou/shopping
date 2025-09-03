import 'dotenv/config';
import { db } from './db';
import { products } from './schema';

const nikeProducts = [
  {
    name: 'Nike Air Max 90',
    description: 'Classic running shoe with iconic design and superior comfort.',
    price: 12000, // $120.00
    image: 'https://via.placeholder.com/200x200/0066CC/FFFFFF?text=Nike+Air+Max+90',
    brand: 'Nike',
    category: 'Running Shoes',
    stock: 50,
    color: 'White/Black',
    size: '10',
    isFeatured: true,
    rating: 5,
  },
  {
    name: 'Nike Air Force 1',
    description: 'Legendary basketball shoe with timeless style and comfort.',
    price: 11000, // $110.00
    image: 'https://via.placeholder.com/200x200/FF6600/FFFFFF?text=Nike+Air+Force+1',
    brand: 'Nike',
    category: 'Basketball Shoes',
    stock: 75,
    color: 'White',
    size: '9',
    isFeatured: true,
    rating: 5,
  },
  {
    name: 'Nike Dunk Low',
    description: 'Retro basketball shoe perfect for everyday casual wear.',
    price: 10000, // $100.00
    image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=Nike+Dunk+Low',
    brand: 'Nike',
    category: 'Lifestyle Shoes',
    stock: 30,
    color: 'Black/White',
    size: '11',
    isFeatured: false,
    rating: 4,
  },
  {
    name: 'Nike React Element 55',
    description: 'Modern running shoe with Nike React technology.',
    price: 13000, // $130.00
    image: 'https://via.placeholder.com/200x200/666666/FFFFFF?text=Nike+React+Element+55',
    brand: 'Nike',
    category: 'Running Shoes',
    stock: 25,
    color: 'Grey',
    size: '10.5',
    isFeatured: false,
    rating: 4,
  },
  {
    name: 'Nike Air Jordan 1',
    description: 'Iconic basketball shoe that changed sneaker culture forever.',
    price: 17000, // $170.00
    image: 'https://via.placeholder.com/200x200/CC0000/FFFFFF?text=Nike+Air+Jordan+1',
    brand: 'Nike',
    category: 'Basketball Shoes',
    stock: 15,
    color: 'Red/Black',
    size: '9.5',
    isFeatured: true,
    rating: 5,
  },
  {
    name: 'Nike Zoom Pegasus 40',
    description: 'Reliable daily running shoe with responsive cushioning.',
    price: 13500, // $135.00
    image: 'https://via.placeholder.com/200x200/0099FF/FFFFFF?text=Nike+Zoom+Pegasus+40',
    brand: 'Nike',
    category: 'Running Shoes',
    stock: 40,
    color: 'Blue',
    size: '8.5',
    isFeatured: false,
    rating: 4,
  },
];

async function seed() {
  try {
    // Clear existing products first
    await db.delete(products);
    console.log('Cleared existing products');
    
    // Insert new products
    await db.insert(products).values(nikeProducts);
    console.log(`Successfully seeded ${nikeProducts.length} Nike products`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

seed();

seed();
