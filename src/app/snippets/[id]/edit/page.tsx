import SnippetEditForm from "@/components/snippet-edit-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

export default async function EditSnippet({
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

  return (
    <main className="container m-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-row gap-2 text-3xl">
            <span>{snippet.id}</span>
            &ndash;
            <p>{snippet.title}</p>
          </div>
        </div>
        <SnippetEditForm snippet={snippet} />
      </div>
    </main>
  );
}
