import { db } from './db';
import { products } from './schema';

const nikeProducts = [
  {
    name: 'Nike Air Max 90',
    description: 'Classic running shoe with iconic design.',
    price: 12000,
    image: '/nike-air-max-90.jpg',
  },
  {
    name: 'Nike Air Force 1',
    description: 'Legendary style and comfort.',
    price: 11000,
    image: '/nike-air-force-1.jpg',
  },
  {
    name: 'Nike Dunk Low',
    description: 'Retro basketball shoe for everyday wear.',
    price: 10000,
    image: '/nike-dunk-low.jpg',
  },
];

async function seed() {
  await db.insert(products).values(nikeProducts);
  console.log('Seeded Nike products');
}

seed();
