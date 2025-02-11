"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { startTransition, useActionState, useCallback, useState } from "react";
import * as actions from "@/actions";

const initialActionState = {
  title: [],
  content: [],
  server: [],
};

interface Props {
  slug: string;
}

export default function CreatePostForm({ slug }: Props) {
  const [open, setOpen] = useState(false);

  const [formState, formAction, pending] = useActionState(
    actions.createPost,
    initialActionState,
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.set("slug", slug);
      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction],
  );

  return (
    <>
      <button
        className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => setOpen(true)}
      >
        New Post
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <form method="POST" onSubmit={handleSubmit}>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sky-100">
                  {pending ? (
                    <div className="size-6 text-sky-600">
                      <div className="animate-spin border-4 border-sky-400 border-t-sky-600 size-6 m-auto rounded-full" />
                    </div>
                  ) : (
                    <InformationCircleIcon
                      aria-hidden="true"
                      className="size-6 text-sky-600"
                    />
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-xl font-semibold text-gray-100"
                  >
                    Create a post
                  </DialogTitle>
                  <div className="sm:mx-auto sm:w-full sm:max-w-sm text-left flex flex-col gap-2 mt-4">
                    {formState.server.length > 0 && (
                      <div className="px-4 py-2 bg-red-700/30 text-red-50 text-sm rounded-md outline outline-1 outline-red-700">
                        <ul className="list-disc pl-5">
                          {formState.server.map((error, indx) => (
                            <li key={indx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm/6 font-medium text-white"
                      >
                        Title
                      </label>
                      <div className="my-2 flex flex-col gap-2">
                        <input
                          id="title"
                          name="title"
                          required
                          minLength={3}
                          autoComplete="off"
                          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                        {formState.title.length > 0 && (
                          <div className="px-4 py-2 bg-red-700/30 text-red-50 text-sm rounded-md outline outline-1 outline-red-700">
                            <ul className="list-disc pl-5">
                              {formState.title.map((error, indx) => (
                                <li key={indx}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm/6 font-medium text-gray-100"
                      >
                        Content
                      </label>
                      <div className="my-2 flex flex-col gap-2">
                        <textarea
                          id="content"
                          name="content"
                          rows={4}
                          minLength={10}
                          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-100 outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        {formState.content.length > 0 && (
                          <div className="px-4 py-2 bg-red-700/30 text-red-50 text-sm rounded-md outline outline-1 outline-red-700">
                            <ul className="list-disc pl-5">
                              {formState.content.map((error, indx) => (
                                <li key={indx}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-40 disabled:hover:bg-indigo-600"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        disabled={pending}
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:col-start-1 sm:mt-0 disabled:opacity-40 disabled:hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
