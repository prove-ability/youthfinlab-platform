CREATE TYPE "public"."difficulty" AS ENUM('normal', 'easy');--> statement-breakpoint
ALTER TABLE "class_stock_prices" ALTER COLUMN "class_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_stock_prices" ALTER COLUMN "stock_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_stock_prices" ALTER COLUMN "day" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_stock_prices" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "day" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "class_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "wallet_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "difficulty" "difficulty" DEFAULT 'normal' NOT NULL;