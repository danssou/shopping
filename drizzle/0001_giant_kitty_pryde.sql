ALTER TABLE "user" ADD COLUMN "first_name" varchar(100);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" varchar(100);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "devices" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb;