"use client";

import { useSession } from "next-auth/react";
import { useActionState, startTransition, useCallback, useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import * as actions from "@/actions";
import Link from "next/link";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
];

export default function ProfileDropdown() {
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
      <div className="w-full h-full">
        <div className="animate-spin border-8 border-gray-400 border-t-sky-500 size-8 m-auto rounded-full"></div>
      </div>
    );
  }

  if (user != null) {
    return (
      <Menu as="div" className="relative ml-3">
        <div>
          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            {user.image ? (
              <img
                alt="User avatar"
                src={user.image}
                className="size-8 rounded-full"
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
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          {userNavigation.map((item) => (
            <MenuItem key={item.name}>
              <Link
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                {item.name}
              </Link>
            </MenuItem>
          ))}
          <MenuItem>
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none w-full text-left"
              disabled={pendingSignIn || pendingSignOut}
            >
              Sign out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      disabled={pendingSignIn || pendingSignOut}
    >
      Sign in
    </button>
  );
}
