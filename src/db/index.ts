import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({ client, schema });

migrate(db, { migrationsFolder: "drizzle" });
