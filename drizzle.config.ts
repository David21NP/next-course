import { defineConfig } from "drizzle-kit";
import process from "node:process";

// Load the environment variables from the .env file
process.loadEnvFile(".env.local");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
