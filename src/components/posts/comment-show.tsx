import { db } from "@/db";
import CommentForm from "@/components/posts/comment-form";

interface Props {
  post_id: string;
  parent_id?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function CommentShow({ post_id, parent_id }: Props) {
  const comments = await db.query.comment.findMany({
    with: { post: { with: { user: true } } },
    limit: 10,
    where: (comment, { eq, and, isNull }) =>
      and(
        eq(comment.post_id, post_id),
        parent_id
          ? eq(comment.parent_id, parent_id)
          : isNull(comment.parent_id),
      ),
  });

  return (
    <div className="space-y-3">
      {!parent_id && (
        <h1 className="text-lg font-bold text-gray-100">
          All {comments.length} comments
        </h1>
      )}
      {comments.map((comment, reviewIdx) => (
        <div key={comment.id} className="flex space-x-4 text-sm text-gray-500">
          <div className="flex-none pt-4">
            {comment.post.user?.image ? (
              <img
                alt={`Profile image of user ${comment.post.user.name}`}
                src={comment.post.user.image}
                className="size-10 rounded-full bg-gray-100"
              />
            ) : (
              <span className="inline-block size-8 overflow-hidden rounded-full bg-gray-100">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="size-full text-gray-300"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}
          </div>
          <div
            className={classNames(
              reviewIdx === 0 ? "" : "border-t border-gray-200",
              "pt-4 flex-1",
            )}
          >
            <h3 className="font-medium text-gray-200">
              {comment.post.user.name}
            </h3>
            <p className="text-gray-400">
              <time dateTime={comment.updated_at}>{comment.updated_at}</time>
            </p>

            <p className="mt-4 text-sm/6 text-gray-200 whitespace-break-spaces">{comment.content}</p>
            <div className="pt-2">
              <CommentForm post_id={post_id} parent_id={comment.id} />
            </div>
            <div className="">
              <CommentShow post_id={post_id} parent_id={comment.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
