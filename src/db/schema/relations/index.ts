import { relations } from "drizzle-orm/relations";
import { users, accounts, sessions } from "../user";
import { topic, post, comment } from "../post";

export const account_relations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const user_relations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  posts: many(post),
  comments: many(comment),
}));

export const session_relations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const post_relations = relations(post, ({ one, many }) => ({
  topic: one(topic, {
    fields: [post.topic_id],
    references: [topic.id],
  }),
  user: one(users, {
    fields: [post.user_id],
    references: [users.id],
  }),
  comments: many(comment),
}));

export const topic_relations = relations(topic, ({ many }) => ({
  posts: many(post),
}));

export const comment_relations = relations(comment, ({ one, many }) => ({
  user: one(users, {
    fields: [comment.user_id],
    references: [users.id],
  }),
  post: one(post, {
    fields: [comment.post_id],
    references: [post.id],
  }),
  comment: one(comment, {
    fields: [comment.parent_id],
    references: [comment.id],
    relationName: "comment_parentId_comment_id",
  }),
  comments: many(comment, {
    relationName: "comment_parentId_comment_id",
  }),
}));
