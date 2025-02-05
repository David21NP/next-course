"use client";

import { editorLanguages } from "@/common";
import * as actions from "@/actions";
import { useActionState, startTransition, useCallback } from "react";
import ErrorIcon from "@/components/error-icon";

const initialState = {
  msgs: [],
  type: "user",
};

export default function SnippetCreate() {
  const [state, formAction, pending] = useActionState(
    actions.createSnippet,
    initialState,
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction],
  );

  return (
    <main>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Create snippet
          </h2>
        </div>

        {state.msgs.length > 0 && (
          <div className="rounded-md bg-red-800 p-4">
            <div className="flex">
              <div className="shrink-0">
                <ErrorIcon className="size-5 text-red-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-100">
                  {state.type === "server"
                    ? "There was an error in the server"
                    : `There ${state.msgs.length > 1 ? "were " : "is "}
                  ${state.msgs.length} error
                  ${state.msgs.length > 1 ? "s" : ""} with your submission`}
                </h3>
                <div className="mt-2 text-sm text-red-50">
                  <ul role="list" className="list-disc space-y-1 pl-5">
                    {state.msgs.map((error, indx) => (
                      <li key={indx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm/6 font-medium text-white"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  autoComplete="off"
                  minLength={3}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="language"
                className="block text-sm/6 font-medium text-white"
              >
                Language
              </label>
              <div className="mt-2">
                <select
                  name="language"
                  id="language"
                  autoComplete="off"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                >
                  <option></option>
                  {editorLanguages.map((lang, indx) => (
                    <option key={indx} className="text-black">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="code"
                  className="block text-sm/6 font-medium text-white"
                >
                  Code
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  name="code"
                  id="code"
                  autoComplete="off"
                  minLength={10}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                disabled={pending}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
