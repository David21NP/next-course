export default async function SnippetNotFound() {
  return (
    <main className="container p-4">
      <div>
        <h1 className="text-xl font-bold">Sorry, couldn&apos;t find snippet</h1>
        <p>Note: id must be a number</p>
      </div>
    </main>
  );
}
