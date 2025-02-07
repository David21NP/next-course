import { SessionProvider } from "next-auth/react";

type Props = React.PropsWithChildren;

export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
