import {
  sqliteTable,
  text,
  numeric,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const account = sqliteTable(
  "account",
  {
    id: text().primaryKey().notNull().$defaultFn(() => createId()),
    user_id: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text().notNull(),
    provider: text().notNull(),
    provider_account_id: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (table) => [
    uniqueIndex("Account_provider_providerAccountId_key").on(
      table.provider,
      table.provider_account_id,
    ),
  ],
);

export const session = sqliteTable(
  "session",
  {
    id: text().primaryKey().notNull().$defaultFn(() => createId()),
    session_token: text().notNull(),
    user_id: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: numeric().notNull(),
  },
  (table) => [uniqueIndex("Session_sessionToken_key").on(table.session_token)],
);

export const user = sqliteTable(
  "user",
  {
    id: text().primaryKey().notNull().$defaultFn(() => createId()),
    name: text(),
    email: text(),
    email_verified: numeric(),
    image: text(),
  },
  (table) => [uniqueIndex("User_email_key").on(table.email)],
);

export const verification_token = sqliteTable(
  "verification_token",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: numeric().notNull(),
  },
  (table) => [
    uniqueIndex("VerificationToken_identifier_token_key").on(
      table.identifier,
      table.token,
    ),
    uniqueIndex("VerificationToken_token_key").on(table.token),
  ],
);
