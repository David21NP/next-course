"use client";

import paths from "@/paths";
import { HomeIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { startTransition, useActionState, useCallback, useEffect } from "react";
import * as actions from "@/actions";
import Link from "next/link";

const initialActionState = { server: [], results: [] };

export default function Breadcrumbs() {
  const path = usePathname();

  const [formState, formAction] = useActionState(
    actions.getBradcrumbsNames,
    initialActionState,
  );

  const handleSubmit = useCallback(
    (routes: string[]) => {
      const formData = new FormData();
      formData.set("routes", JSON.stringify(routes));
      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction],
  );

  useEffect(() => {
    handleSubmit(
      path.split("/").filter((val) => !["", "topics", "posts"].includes(val)),
    );
  }, [path, handleSubmit]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex bg-gray-800 max-w-7xl sm:px-6 lg:px-8 mx-auto"
    >
      <ol
        role="list"
        className="mx-auto flex w-full max-w-screen-xl border-b border-gray-700 space-x-4 min-h-12 px-4 sm:px-0"
      >
        <li className="flex">
          <div className="flex items-center">
            {path === "/" ? (
              <p
                aria-current="page"
                className="text-gray-200"
              >
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </p>
            ) : (
              <Link
                href={paths.home()}
                className="text-gray-200 hover:text-gray-400"
              >
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </Link>
            )}
          </div>
        </li>
        {formState.results.map((page, pageIndex, pageArr) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                fill="currentColor"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-full w-6 shrink-0 text-gray-200"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              {pageArr.length - 1 !== pageIndex ? (
                <Link
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-300"
                >
                  {page.name}
                </Link>
              ) : (
                <p
                  aria-current="page"
                  className="ml-4 text-sm font-medium text-gray-100"
                >
                  {page.name}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
