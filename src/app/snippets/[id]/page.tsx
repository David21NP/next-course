import { db } from "@/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as actions from "@/actions";

export default async function ShowSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return notFound();
  }

  const snippet = await db.query.snippets.findFirst({
    where: (snippets, { eq }) => eq(snippets.id, id),
  });

  if (!snippet) {
    return notFound();
  }
  const deleteSnippet = actions.deleteSnippet.bind(null, snippet.id);

  return (
    <main className="container m-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-row gap-2 text-3xl">
            <span>{snippet.id}</span>
            &ndash;
            <p>{snippet.title}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={"/"}
              className="px-4 py-2 border border-white rounded-md"
            >
              Go back
            </Link>
            <Link
              href={`/snippets/${snippet.id}/edit`}
              className="px-4 py-2 border border-white rounded-md"
            >
              Edit
            </Link>
            <button
              onClick={deleteSnippet}
              className="px-4 py-2 border border-white rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
        <pre className="p-4 border border-white rounded-md bg-slate-800">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return (await db.query.snippets.findMany()).map(({ id }) => ({
    id: id.toString(),
  }));
}
