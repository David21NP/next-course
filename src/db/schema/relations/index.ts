import { relations } from "drizzle-orm/relations";
import { user, account, session } from "../user";
import { topic, post, comment } from "../post";

export const account_relations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.user_id],
    references: [user.id],
  }),
}));

export const user_relations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  posts: many(post),
  comments: many(comment),
}));

export const session_relations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.user_id],
    references: [user.id],
  }),
}));

export const post_relations = relations(post, ({ one, many }) => ({
  topic: one(topic, {
    fields: [post.topic_id],
    references: [topic.id],
  }),
  user: one(user, {
    fields: [post.user_id],
    references: [user.id],
  }),
  comments: many(comment),
}));

export const topic_relations = relations(topic, ({ many }) => ({
  posts: many(post),
}));

export const comment_relations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.user_id],
    references: [user.id],
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
