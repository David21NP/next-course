export default async function TopicView({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = (await params).topic;
  return <div>Topic &apos;{topic}&apos; page</div>;
}
