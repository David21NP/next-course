"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { post } from "@/db/schema";
import { redirect } from "next/navigation";

import paths from "@/paths";
import { revalidatePath } from "next/cache";

export async function createPost(
  formState: { title: string[]; content: string[]; server: string[] },
  formData: FormData,
) {
  const session = await auth();
  if (!session || !session?.user || !session.user.email) {
    return {
      title: [],
      content: [],
      server: ["You must be signed in to do this."],
    };
  }

  await new Promise((r) => setTimeout(r, 4000));

  const title = formData.get("title");
  const slug = formData.get("slug");
  const content = formData.get("content");

  if (typeof slug !== "string") {
    return {
      title: [],
      content: [],
      server: ["Slug must be a string."],
    };
  }
  if (typeof title !== "string") {
    return {
      title: ["Title must be a string."],
      content: [],
      server: [],
    };
  }
  if (typeof content !== "string") {
    return {
      title: [],
      content: ["Title must be a string."],
      server: [],
    };
  }

  if (/^[0-9]/.test(title)) {
    return {
      title: ["The title can't begin with a number."],
      content: [],
      server: [],
    };
  }
  if (["null", "undefined"].includes(slug)) {
    return {
      title: [],
      content: [],
      server: ["Slug can't be null or undefined."],
    };
  }

  let postId;
  try {
    // throw new Error("No dejar pasar");
    const topic = await db.query.topic.findFirst({
      columns: { slug: true, id: true },
      where: (topic, { eq }) => eq(topic.slug, slug),
    });
    if (!topic) {
      throw new Error("Topic not found in db.");
    }
    const user = await db.query.users.findFirst({
      columns: { id: true },
      where: (user, { eq }) => eq(user.email, session.user?.email ?? ""),
    });
    if (!user) {
      throw new Error("User not found in db.");
    }
    const postCreated = await db
      .insert(post)
      .values({ title, content, topic_id: topic.id, user_id: user.id }).returning();

    postId = postCreated[0].id;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        title: [],
        content: [],
        server: [err.message],
      };
    } else {
      return {
        title: [],
        content: [],
        server: ["Something went wrong"],
      };
    }
  }

  revalidatePath(paths.topicView(slug));

  redirect(paths.postView(slug, postId));
}
