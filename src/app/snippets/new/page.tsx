import { db } from "@/db";
import { snippets } from "@/db/schema";
import { redirect } from "next/navigation";

export default function SnippetCreate() {
  const createSnippet = async (formData: FormData) => {
    // NOTE: This needs to be a server action
    "use server";

    // NOTE: Check user's input
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    // NOTE: Create a new record in the db
    const snippets_results = await db
      .insert(snippets)
      .values({ title, code })
      .returning();
    console.log(snippets_results);

    // NOTE: Redirect to root
    redirect("/");
  };

  return (
    <main>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Create snippet
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={createSnippet}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm/6 font-medium text-white"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  autoComplete="off"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="code"
                  className="block text-sm/6 font-medium text-white"
                >
                  Code
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  name="code"
                  id="code"
                  autoComplete="off"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
