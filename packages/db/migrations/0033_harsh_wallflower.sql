CREATE TYPE "public"."program_type" AS ENUM('stock_game', 'finance_sim');--> statement-breakpoint
CREATE TABLE "finance_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"current_status" text NOT NULL,
	"monthly_income" numeric NOT NULL,
	"monthly_fixed_expenses" numeric NOT NULL,
	"cash_assets" numeric NOT NULL,
	"investment_assets" numeric,
	"has_debt" boolean DEFAULT false NOT NULL,
	"total_debt_amount" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"current_step" integer DEFAULT 1 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_tendencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"tendency_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pension_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"current_age" integer NOT NULL,
	"start_timing" text NOT NULL,
	"monthly_contribution" numeric NOT NULL,
	"retirement_age" integer NOT NULL,
	"total_contributed" numeric NOT NULL,
	"estimated_asset_at_retirement" numeric NOT NULL,
	"estimated_monthly_pension" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_investment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"monthly_amount" numeric NOT NULL,
	"period_years" integer NOT NULL,
	"savings_ratio" integer NOT NULL,
	"investment_ratio" integer NOT NULL,
	"investment_return_rate" numeric NOT NULL,
	"total_deposited" numeric NOT NULL,
	"final_savings_amount" numeric NOT NULL,
	"final_investment_amount" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "program_type" "program_type" DEFAULT 'stock_game' NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_profiles" ADD CONSTRAINT "finance_profiles_simulation_id_finance_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."finance_simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_simulations" ADD CONSTRAINT "finance_simulations_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_simulations" ADD CONSTRAINT "finance_simulations_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_tendencies" ADD CONSTRAINT "investment_tendencies_simulation_id_finance_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."finance_simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pension_results" ADD CONSTRAINT "pension_results_simulation_id_finance_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."finance_simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_investment_results" ADD CONSTRAINT "savings_investment_results_simulation_id_finance_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."finance_simulations"("id") ON DELETE cascade ON UPDATE no action;