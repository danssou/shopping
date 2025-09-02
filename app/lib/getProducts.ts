import { db } from '../../drizzle/db';
import { products } from '../../drizzle/schema';

export async function getProducts() {
  return await db.select().from(products);
}
