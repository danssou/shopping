CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"price" integer NOT NULL,
	"image" varchar(255) NOT NULL,
	"brand" varchar(100) DEFAULT 'Nike' NOT NULL,
	"category" varchar(100) DEFAULT 'Shoes' NOT NULL,
	"stock" integer DEFAULT 100 NOT NULL,
	"color" varchar(50) DEFAULT 'Black' NOT NULL,
	"size" varchar(20) DEFAULT 'M' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
