import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const guest = pgTable('guest', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type Guest = typeof guest.$inferSelect;
export type InsertGuest = typeof guest.$inferInsert;
