"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const routes = [
  { path: "/", label: "Home", icon: "house-fill" },
  { path: "/performance", label: "Performance", icon: "pc-display" },
  { path: "/reliability", label: "Reliability", icon: "person-fill" },
  { path: "/scale", label: "Scale", icon: "zoom-in" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex gap-2 justify-around">
      <div className="grid grid-cols-1 sm:hidden">
        <select
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          onChange={(ev) => router.push(ev.target.value)}
        >
          {routes.map(({ path, label }) => (
            <option key={path} value={path}>
              {label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fill-rule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {routes.map(({ path, label, icon }) => (
              <Link
                key={path}
                href={path}
                className={`group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium gap-2 ${pathname === path ? "border-indigo-500 text-indigo-600 dark:border-indigo-300 dark:text-indigo-400" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-200 dark:hover:text-gray-300"}`}
              >
                <span
                  className={`bi bi-${icon} text-lg ${pathname === path ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`}
                />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
