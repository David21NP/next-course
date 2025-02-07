export default async function PostView({
  params,
}: {
  params: Promise<{ topic: string, post_id: string }>;
}) {
  const topic = (await params).topic;
  const post_id = parseInt((await params).post_id);
  return <div>Post id: {post_id} in topic {topic} page</div>;
}

