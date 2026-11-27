CREATE TABLE "market_portfolio_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"day" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "market_portfolio_reviews" ADD CONSTRAINT "market_portfolio_reviews_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_portfolio_reviews" ADD CONSTRAINT "market_portfolio_reviews_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "market_portfolio_guest_day" ON "market_portfolio_reviews" USING btree ("class_id","guest_id","day");