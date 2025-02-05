import Link from "next/link";

export default async function SnippetNotFound() {
  return (
    <main className="container m-auto p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Sorry, couldn&apos;t find snippet</h1>
        <p>Note: id must be a number</p>
      </div>
      <div>
        <Link href="/" className="px-4 py-2 rounded-md bg-blue-600">
          Go home
        </Link>
      </div>
    </main>
  );
}
