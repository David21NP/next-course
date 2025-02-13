"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { topic } from "@/db/schema";
import { redirect } from "next/navigation";

import paths from "@/paths";
import { revalidatePath } from "next/cache";

export async function createTopic(
  formState: { name: string[]; description: string[]; server: string[] },
  formData: FormData,
) {
  const session = await auth();
  if (!session || !session?.user) {
    return {
      name: [],
      description: [],
      server: ["You must be signed in to do this."],
    };
  }

  await new Promise((r) => setTimeout(r, 4000));

  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string") {
    return {
      name: ["Name must be a string."],
      description: [],
      server: [],
    };
  }
  if (typeof description !== "string") {
    return {
      name: [],
      description: ["Name must be a string."],
      server: [],
    };
  }

  if (/^[0-9]/.test(name)) {
    return {
      name: ["The name can't begin with a number."],
      description: [],
      server: [],
    };
  }

  const name_as_slug = name.replace(/\s/g, "-").toLowerCase();

  try {
    // throw new Error("No dejar pasar");
    await db.insert(topic).values({ slug: name_as_slug, description });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        name: [],
        description: [],
        server: [err.message],
      };
    } else {
      return {
        name: [],
        description: [],
        server: ["Something went wrong"],
      };
    }
  }

  revalidatePath(paths.home());

  redirect(paths.topicView(name_as_slug));
}
