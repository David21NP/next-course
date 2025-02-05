"use server";

import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const createSnippet = async (
  formState: { msgs: string[]; type: string },
  formData: FormData,
) => {
  // NOTE: This needs to be a server action
  "use server";

  let error_type = "server";
  try {
    // NOTE: Check user's input
    const title = formData.get("title");
    const code = formData.get("code");
    const language = (formData.get("language") as string).toLowerCase();

    const msgs = [];

    if (typeof title !== "string") {
      msgs.push("Title must be a string.");
      return { msgs, type: error_type };
    }
    if (typeof code !== "string") {
      msgs.push("Code must be a string.");
      return { msgs, type: error_type };
    }

    error_type = "user";
    if (/^\d+$/.test(title)) {
      msgs.push("Title must not be only numbers.");
    }
    if ((code.match(/\r\n/g) || []).length <= 1) {
      msgs.push("Code must have at least 3 lines.");
    }

    if (msgs.length > 0) {
      return { msgs, type: error_type };
    }

    // NOTE: Create a new record in the db
    await db.insert(snippets).values({ title, code, language });
  } catch (err: unknown) {
    error_type = "server";
    return {
      msgs: [err instanceof Error ? err.message : "Something went wrong ..."],
      type: error_type,
    };
  }

  // NOTE: Revalidate cache
  revalidatePath("/");

  // NOTE: Redirect to root
  redirect("/");
};

export const editSnippet = async (
  id: number,
  language: string,
  code: string,
) => {
  // NOTE: Create a new record in the db
  await db.update(snippets).set({ code, language }).where(eq(snippets.id, id));

  // NOTE: Revalidate cache
  revalidatePath(`/snippets/${id}`);

  // NOTE: Redirect to updated snippet
  redirect(`/snippets/${id}`);
};

export const deleteSnippet = async (id: number) => {
  // NOTE: Create a new record in the db
  await db.delete(snippets).where(eq(snippets.id, id));

  // NOTE: Revalidate cache
  revalidatePath("/");

  // NOTE: Redirect to updated snippet
  redirect("/");
};
