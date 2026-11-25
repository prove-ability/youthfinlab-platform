import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../packages/db/src/schema";
export * from "../packages/db/src/schema";
export const engine = new PGlite();
export const db = drizzle(engine, { schema });
export const dbWithTransaction = db;
