import { pgTable, uuid, varchar, text, decimal, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Import auth schemas
export * from './db/schema';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  brand: varchar('brand', { length: 100 }),
  stock: integer('stock').default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, confirmed, processing, shipped, delivered, cancelled
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  // Order items stored as JSON for simplicity
  items: jsonb('items').$type<Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    size?: string;
    color?: string;
  }>>().notNull(),
  // Shipping address
  shippingAddress: jsonb('shipping_address').$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    name?: string;
    phone?: string;
  }>().notNull(),
  // Payment info (sensitive data should be stored securely)
  paymentMethod: varchar('payment_method', { length: 50 }), // card, paypal, etc.
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // pending, paid, failed, refunded
  // Tracking and notes
  trackingNumber: varchar('tracking_number', { length: 100 }),
  notes: text('notes'),
  // Applied coupon
  coupon: jsonb('coupon').$type<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed' | 'free_shipping';
    description: string;
  }>(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});
