"use server";

// import paths from "@/paths";
// import { revalidatePath } from "next/cache";

export async function createTopic(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string") {
    return {
      name: ["Name must be a string"],
      description: [],
    };
  }
  // revalidatePath(paths.home())

  return {
    name: [],
    description: [],
  };
}
