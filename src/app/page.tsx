import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

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

export default function Home() {
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
                      <h3 className="truncate text-sm font-medium text-gray-100">
                        {post.title}
                      </h3>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {post.topic}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <p className="mt-1 truncate text-sm text-gray-300">
                        By {post.username}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-300">
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
            <button className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              New Topic
            </button>
            <div className="p-4">
              <ul role="list" className="list-disc space-y-1 pl-5">
                <li>Topic 1</li>
                <li>Topic 2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
