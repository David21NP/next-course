"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
  { path: "/", label: "Home", icon: "house-fill" },
  { path: "/performance", label: "Performance", icon: "pc-display" },
  { path: "/reliability", label: "Reliability", icon: "person-fill" },
  { path: "/scale", label: "Scale", icon: "zoom-in" },
];

const linkClassNames = [
  {
    true: "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white",
    false:
      "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
  },
  {
    true: "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white",
    false:
      "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
  },
];

export default function Header() {
  const pathname = usePathname();

  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);

  return (
    <header className="w-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {routes.map(({ path, label }) => (
                    <Link
                      key={path}
                      href={path}
                      className={linkClassNames[0][`${pathname === path}`]}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex sm:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setOpenBurgerMenu((old) => !old)}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                {/*
                  Icon when menu is closed.

                  Menu open: "hidden", Menu closed: "block"
                */}
                <svg
                  className="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                {/*
                  Icon when menu is open.

                  Menu open: "block", Menu closed: "hidden"
                */}
                <svg
                  className="hidden size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={openBurgerMenu ? "hidden" : "sm:hidden"}
          id="mobile-menu"
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
            {routes.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={linkClassNames[1][`${pathname === path}`]}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
