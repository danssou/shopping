import { pgTable, serial, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }).notNull(),
  price: integer('price').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull().default('Nike'),
  category: varchar('category', { length: 100 }).notNull().default('Shoes'),
  stock: integer('stock').notNull().default(100),
  color: varchar('color', { length: 50 }).notNull().default('Black'),
  size: varchar('size', { length: 20 }).notNull().default('M'),
  isFeatured: boolean('is_featured').notNull().default(false),
  rating: integer('rating').notNull().default(5),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});
