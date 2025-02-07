export default async function PostCreate({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = (await params).topic;
  return <div>Create post in topic &apos;{topic}&apos; page</div>;
}

