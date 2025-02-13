"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { comment } from "@/db/schema";

import paths from "@/paths";
import { revalidatePath } from "next/cache";

export async function createComment(
  formState: { comment: string[]; server: string[] },
  formData: FormData,
) {
  const session = await auth();
  if (!session || !session?.user || !session.user.email) {
    return {
      comment: [],
      server: ["You must be signed in to do this."],
    };
  }

  const comment_content = formData.get("comment");
  const post_id = formData.get("post_id");
  let parent_id: FormDataEntryValue | null | undefined =
    formData.get("parent_id");

  if (typeof post_id !== "string") {
    return {
      comment: [],
      server: ["Post id must be a string."],
    };
  }
  if (typeof parent_id !== "string") {
    return {
      comment: [],
      server: ["Parent id must be a string."],
    };
  }
  if (typeof comment_content !== "string") {
    return {
      comment: ["Comment must be a string."],
      server: [],
    };
  }

  if (/^[0-9]/.test(comment_content)) {
    return {
      comment: ["The comment can't begin with a number."],
      server: [],
    };
  }
  if (["null", "undefined"].includes(post_id)) {
    return {
      comment: [],
      server: ["Post id can't be null or undefined."],
    };
  }
  if (["null", "undefined", ""].includes(parent_id)) {
    parent_id = undefined;
  }

  let slug = "";
  try {
    const post = await db.query.post.findFirst({
      columns: { id: true, topic_id: true },
      where: (post, { eq }) => eq(post.id, post_id),
    });
    if (!post) {
      throw new Error("Post not found in db.");
    }
    const topic = await db.query.topic.findFirst({
      columns: { slug: true },
      where: (topic, { eq }) => eq(topic.id, post.topic_id),
    });
    if (!topic) {
      throw new Error("Topic not found in db.");
    }
    slug = topic.slug;
    const user = await db.query.users.findFirst({
      columns: { id: true },
      where: (user, { eq }) => eq(user.email, session.user?.email ?? ""),
    });
    if (!user) {
      throw new Error("User not found in db.");
    }
    await db.insert(comment).values({
      content: comment_content,
      user_id: user.id,
      post_id: post.id,
      parent_id,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        comment: [],
        server: [err.message],
      };
    } else {
      return {
        comment: [],
        server: ["Something went wrong"],
      };
    }
  }

  revalidatePath(paths.postView(slug, post_id));

  return {
    comment: [],
    server: [],
  };
}
