import { db } from '../lib/db';
import { products } from '../lib/schema';

const sampleNikeProducts = [
  {
    name: 'Nike Air Max 90',
    description: 'Classic Nike Air Max sneakers with iconic visible air cushioning',
    price: '120.00',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
    category: 'Shoes',
    brand: 'Nike',
    stock: 50,
  },
  {
    name: 'Nike Air Force 1',
    description: 'The legendary basketball shoe that changed everything',
    price: '110.00',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    category: 'Shoes',
    brand: 'Nike',
    stock: 75,
  },
  {
    name: 'Nike Dri-FIT T-Shirt',
    description: 'Lightweight and breathable performance t-shirt',
    price: '25.00',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    category: 'Clothing',
    brand: 'Nike',
    stock: 100,
  },
  {
    name: 'Nike Swoosh Hoodie',
    description: 'Comfortable fleece hoodie with classic Nike Swoosh',
    price: '55.00',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    category: 'Clothing',
    brand: 'Nike',
    stock: 30,
  },
  {
    name: 'Nike React Infinity Run',
    description: 'Revolutionary running shoes designed to help reduce injury',
    price: '160.00',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center',
    category: 'Shoes',
    brand: 'Nike',
    stock: 40,
  },
  {
    name: 'Nike Basketball Shorts',
    description: 'High-performance shorts for basketball and training',
    price: '40.00',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center',
    category: 'Clothing',
    brand: 'Nike',
    stock: 60,
  },
  {
    name: 'Nike Air Zoom Pegasus 40',
    description: 'Responsive running shoes for daily training',
    price: '130.00',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&crop=center',
    category: 'Shoes',
    brand: 'Nike',
    stock: 35,
  },
  {
    name: 'Nike Pro Compression Shirt',
    description: 'Tight-fitting performance shirt for training and sports',
    price: '35.00',
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&crop=center',
    category: 'Clothing',
    brand: 'Nike',
    stock: 80,
  }
];

const seedDatabase = async () => {
  try {
    console.log('Seeding database with Nike products...');
    
    // Insert sample products
    await db.insert(products).values(sampleNikeProducts);
    
    console.log('Successfully seeded database with', sampleNikeProducts.length, 'Nike products');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
