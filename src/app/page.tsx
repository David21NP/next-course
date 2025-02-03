import { db } from "@/db";
import { snippets } from "@/db/schema";
import Link from "next/link";

export default async function Home() {
  const codes = await db.select().from(snippets);
  return (
    <main className="container p-4">
      <h1 className="text-3xl">Home page</h1>
      <hr className="my-4" />
      <h2 className="text-xl">Code list</h2>
      <br />
      <Link href={"/snippets/new"} className="px-4 py-2 rounded-md bg-blue-600">
        Nuevo snippet
      </Link>
      <br />
      <br />
      <ul className="flex flex-col gap-4">
        {codes.map(({ id, title }) => (
          <li key={id}>
            <Link href={`/snippets/${id}`}>
              <div className="flex flex-row gap-2 text-xl">
                <span>{id}</span>
                &ndash;
                <p>{title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
