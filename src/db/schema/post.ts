import {
  sqliteTable,
  text,
  numeric,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { users } from "./user";

export const topic = sqliteTable(
  "topic",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    slug: text().notNull(),
    description: text().notNull(),
    created_at: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updated_at: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [uniqueIndex("Topic_slug_key").on(table.slug)],
);

export const post = sqliteTable("post", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: text().notNull(),
  content: text().notNull(),
  user_id: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  topic_id: text()
    .notNull()
    .references(() => topic.id, { onDelete: "restrict", onUpdate: "cascade" }),
  created_at: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const comment = sqliteTable(
  "comment",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    content: text().notNull(),
    post_id: text()
      .notNull()
      .references(() => post.id, { onDelete: "cascade", onUpdate: "cascade" }),
    user_id: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    parent_id: text(),
    created_at: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updated_at: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
      name: "Comment_parentId_Comment_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);
