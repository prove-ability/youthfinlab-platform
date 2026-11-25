CREATE TABLE "game_data_generations" (
	"class_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_data_generations" ADD CONSTRAINT "game_data_generations_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;