import { db } from "@/db";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return notFound();
  }

  const code = await db.query.snippets.findFirst({
    where: (snippets, { eq }) => eq(snippets.id, id),
  });

  if (!code) {
    return notFound();
  }

  return (
    <main className="container p-4">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-row gap-2 text-3xl">
            <span>{code.id}</span>
            &ndash;
            <p>{code.title}</p>
          </div>
          <pre className="p-4 border border-white rounded-md">
            <code>{code.code}</code>
          </pre>
        </div>
      </div>
    </main>
  );
}
