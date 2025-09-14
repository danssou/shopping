import { pgTable, varchar, boolean, timestamp, text, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(), // Use varchar to match Better Auth's ID format
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: varchar('image', { length: 500 }),
  // Profile fields
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  bio: text('bio'),
  dateOfBirth: timestamp('date_of_birth'),
  // Address fields
  address: jsonb('address').$type<{
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>(),
  // Device tracking
  devices: jsonb('devices').$type<Array<{
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    lastSeen: string;
    ipAddress: string;
    location?: {
      city?: string;
      country?: string;
    };
  }>>().default([]),
  // Settings
  preferences: jsonb('preferences').$type<{
    theme?: 'light' | 'dark' | 'auto';
    notifications?: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy?: {
      profileVisibility: 'public' | 'private';
      showEmail: boolean;
    };
    activeCoupon?: {
      code: string;
      discount: number;
      type: 'percentage' | 'fixed' | 'free_shipping';
      description: string;
      appliedAt: string;
    };
  }>().default({}),
  // Shopping cart
  cart: jsonb('cart').$type<Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    size?: string;
    color?: string;
  }>>().default([]),
  // Wishlist
  wishlist: jsonb('wishlist').$type<Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    imageUrl?: string;
    addedAt: string;
  }>>().default([]),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
