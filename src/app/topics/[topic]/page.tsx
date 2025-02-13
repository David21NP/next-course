import CreatePostForm from "@/components/posts/create-form";
import { db } from "@/db";
import paths from "@/paths";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TopicView({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic_slug = (await params).topic;
  const topic = await db.query.topic.findFirst({
    where: (topic, { eq }) => eq(topic.slug, topic_slug),
    with: { posts: { with: { user: true, comments: true }, limit: 10 } },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Top Posts in {topic_slug}
        </h1>
        <div className="flex flex-col-reverse sm:flex-row gap-4 text-white">
          <ul role="list" className="grid grid-cols-1 gap-6 flex-1 p-4">
            {topic.posts.map((post) => (
              <li
                key={post.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-slate-600 shadow max-h-min"
              >
                <Link href={paths.postView(topic.slug, post.id)}>
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-xl md:text-3xl font-medium text-gray-100">
                          {post.title}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {topic.slug}
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
                        alt={`Profile img of ${post.user.name}`}
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
            <CreatePostForm slug={topic_slug} />
            <div className="p-4 border rounded-md bg-gray-700">
              <p className="whitespace-break-spaces">{topic.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
