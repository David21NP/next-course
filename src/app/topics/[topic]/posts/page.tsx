import CreatePostForm from "@/components/posts/create-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

const posts = [
  {
    id: 1,
    username: "Jane Cooper",
    title: "Post 1",
    topic: "Topic 1",
    comment_count: 3,
    image_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    id: 2,
    username: "Jane Cooper",
    title: "Post 2",
    topic: "Topic 1",
    comment_count: 3,
    image_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];

export default async function PostCreate({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic_slug = (await params).topic;
  const topic = await db.query.topic.findFirst({
    where: (topic, { eq }) => eq(topic.slug, topic_slug),
    with: { posts: { limit: 10 } },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Top Posts
        </h1>
        <div className="flex gap-4 text-white">
          <ul role="list" className="grid grid-cols-1 gap-6 flex-1 p-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-slate-600 shadow"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-3xl font-medium text-gray-100">
                        {post.title}
                      </h3>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {post.topic}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <p className="mt-1 truncate text-md text-gray-300">
                        By {post.username}
                      </p>
                      <p className="mt-1 truncate text-md text-gray-300">
                        {post.comment_count} comments
                      </p>
                    </div>
                  </div>
                  <img
                    alt=""
                    src={post.image_url}
                    className="size-10 shrink-0 rounded-full bg-gray-300"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 p-4 min-w-52">
            <CreatePostForm />
            <div className="p-4">
              <p>{topic.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
