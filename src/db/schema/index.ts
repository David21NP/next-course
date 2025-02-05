import { editorLanguages } from "@/common";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const snippets = sqliteTable("snippets", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text(),
  language: text({ enum: editorLanguages as [string, ...string[]] }),
  code: text(),
});
