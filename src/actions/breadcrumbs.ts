"use server";

import { auth } from "@/auth";
import { db } from "@/db";

import paths from "@/paths";

interface Results {
  name: string;
  href: string;
}

export async function getBradcrumbsNames(
  formState: { server: string[]; results: Results[] },
  formData: FormData,
) {
  const session = await auth();
  if (!session || !session?.user) {
    return {
      server: ["You must be signed in to do this."],
      results: [],
    };
  }

  const routes: string[] = JSON.parse(formData.get("routes") as string);
  const pages: Results[] = [];

  try {
    // throw new Error("No dejar pasar");
    let route = routes.shift();
    if (route) {
      pages.push({ name: route, href: paths.topicView(route) });
    }
    route = routes.shift();
    if (route) {
      const post = await db.query.post.findFirst({
        where: (post, { eq }) => eq(post.id, route),
      });
      if (!post) {
        throw new Error("The post does not exists.");
      }
      pages.push({ name: post.title, href: "#" });
    }
    return {
      results: pages,
      server: [],
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        results: [],
        server: [err.message],
      };
    } else {
      return {
        results: [],
        server: ["Something went wrong"],
      };
    }
  }
}
