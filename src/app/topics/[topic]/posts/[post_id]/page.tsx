import CommentForm from "@/components/posts/comment-form";
import CommentShow from "@/components/posts/comment-show";
import { db } from "@/db";
import { notFound } from "next/navigation";

export default async function PostView({
  params,
}: {
  params: Promise<{ topic: string; post_id: string }>;
}) {
  const post_id = (await params).post_id;
  const post = await db.query.post.findFirst({
    where: (posts, { eq }) => eq(posts.id, post_id),
  });
  if (!post) {
    notFound();
  }
  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {post.title}
        </h1>
        <div className="p-4 flex flex-col gap-4">
          <p className="text-white">{post.content}</p>
          <CommentForm post_id={post_id} startOpen />
          <CommentShow post_id={post_id} />
        </div>
      </div>
    </div>
  );
}
