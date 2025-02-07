"use client";

import { useSession } from "next-auth/react";
import { useActionState, startTransition, useCallback, useMemo } from "react";
import { DisclosureButton } from "@headlessui/react";
import * as actions from "@/actions";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
];

export default function ProfilePanel() {
  const sessionData = useSession();
  const session = useMemo(() => sessionData.data, [sessionData.data]);
  const user = useMemo(() => session?.user, [session?.user]);

  const [, formActionSignIn, pendingSignIn] = useActionState(
    actions.signIn,
    {},
  );
  const [, formActionSignOut, pendingSignOut] = useActionState(
    actions.signOut,
    {},
  );

  const handleSignIn = useCallback(
    () =>
      startTransition(() => {
        formActionSignIn();
      }),
    [formActionSignIn],
  );

  const handleSignOut = useCallback(
    () =>
      startTransition(() => {
        formActionSignOut();
      }),
    [formActionSignOut],
  );

  if (sessionData.status === "loading") {
    return (
      <div className="border-t border-gray-700 pb-3 pt-4 px-5">
        <div className="animate-spin border-8 border-gray-400 border-t-sky-500 size-10 mr-auto rounded-full"></div>
      </div>
    );
  }

  if (user != null) {
    return (
      <div className="border-t border-gray-700 pb-3 pt-4">
        <div className="flex items-center px-5">
          <div className="shrink-0">
            {user.image ? (
              <img
                alt="User avatar"
                src={user.image}
                className="size-10 rounded-full"
              />
            ) : (
              <span className="inline-block size-10 overflow-hidden rounded-full bg-gray-100">
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
          <div className="ml-3">
            <div className="text-base/5 font-medium text-white">
              {user.name}
            </div>
            <div className="text-sm font-medium text-gray-400">
              {user.email}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1 px-2">
          {userNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              {item.name}
            </DisclosureButton>
          ))}
          <button
            onClick={handleSignOut}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white w-full text-left"
            disabled={pendingSignIn || pendingSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-700 pb-3 pt-4 px-5">
      <button
        onClick={handleSignIn}
        className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        disabled={pendingSignIn || pendingSignOut}
      >
        Sign in
      </button>
    </div>
  );
}
