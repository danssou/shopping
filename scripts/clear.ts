import { db } from '../lib/db';
import { products } from '../lib/schema';

async function clearProducts() {
  try {
    console.log('Clearing existing products...');
    await db.delete(products);
    console.log('Successfully cleared all products from database');
  } catch (error) {
    console.error('Error clearing products:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

clearProducts();
