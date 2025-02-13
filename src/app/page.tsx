import CreateTopicForm from "@/components/topics/create-form";
import { db } from "@/db";
import paths from "@/paths";
import Link from "next/link";

export default async function Home() {
  const posts = await db.query.post.findMany({
    with: {
      comments: { orderBy: (comment, { desc }) => [desc(comment.id)] },
      user: true,
      topic: true,
    },
    limit: 10,
    // orderBy: (posts, { desc }) => [
    //   desc(db.$count(comment, eq(comment.post_id, posts.id))),
    // ],
  });
  const topic = await db.query.topic.findMany({
    columns: {
      slug: true,
    },
    limit: 10,
  });

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Top Posts
        </h1>
        <div className="flex flex-col-reverse sm:flex-row gap-4 text-white">
          <ul role="list" className="grid grid-cols-1 gap-6 flex-1 p-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-slate-600 shadow max-h-min"
              >
                <Link href={paths.postView(post.topic.slug, post.id)}>
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-xl md:text-3xl font-medium text-gray-100">
                          {post.title}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {post.topic.slug}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <p className="mt-1 truncate text-md text-gray-300">
                          By {post.user.name}
                        </p>
                        <p className="mt-1 truncate text-md text-gray-300">
                          {post.comments.length} comments
                        </p>
                      </div>
                    </div>
                    {post.user.image && (
                      <img
                        alt={`Profile image of user ${post.user.name}`}
                        src={post.user.image}
                        className="size-10 shrink-0 rounded-full bg-gray-300"
                      />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 p-4 min-w-52 max-w-full sm:max-w-52">
            <CreateTopicForm />
            <div className="p-4 border rounded-md bg-gray-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {topic.map(({ slug }, index) => (
                  <li key={index}>
                    <Link
                      href={paths.topicView(slug)}
                      className="text-indigo-300"
                    >
                      {slug}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
