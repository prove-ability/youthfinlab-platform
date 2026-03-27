import { type InferSelectModel } from "drizzle-orm";
import { type classes } from "@repo/db/schema";

export type Class = InferSelectModel<typeof classes>;

export type ClassWithRelations = Class & {
  client: { id: string; name: string } | null;
  manager: { id: string; name: string } | null;
};
