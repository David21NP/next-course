import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("snippets", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text(),
  code: text(),
});
