ALTER TABLE "user" ADD COLUMN "cart" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wishlist" jsonb DEFAULT '[]'::jsonb;