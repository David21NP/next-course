"use client";

interface Props {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({error}: Props) {
  return <div>{error.name}: {error.message}</div>
}
