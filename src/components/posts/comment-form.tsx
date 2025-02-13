"use client";

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  // PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useSession } from "next-auth/react";
import * as actions from "@/actions";

const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XMarkIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const initialActionState = {
  comment: [],
  server: [],
};

interface Props {
  post_id: string;
  parent_id?: string;
  startOpen?: boolean;
}

export default function CommentForm({
  post_id,
  parent_id,
  startOpen = false,
}: Props) {
  const [showComment, setShowComment] = useState(startOpen);
  const [selected, setSelected] = useState(moods[5]);
  const ref = useRef<HTMLFormElement | null>(null);

  const session = useSession();

  const [formState, formAction, pending] = useActionState(
    actions.createComment,
    initialActionState,
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.set("post_id", post_id);
      formData.set("parent_id", parent_id ?? "undefined");
      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction],
  );

  useEffect(() => {
    if (formState.server.length === 0 && formState.comment.length === 0) {
      ref.current?.reset();

      if (!startOpen) {
        setShowComment(false);
      }
    }
  }, [formState, startOpen]);

  if (!showComment) {
    return (
      <div>
        <button
          className="text-sm font-semibold text-indigo-400"
          onClick={() => setShowComment(true)}
        >
          Reply
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4">
      <div className="shrink-0">
        {session.status === "loading" ? (
          <div className="size-10 text-sky-600">
            <div className="animate-spin border-4 border-sky-400 border-t-sky-600 size-10 m-auto rounded-full" />
          </div>
        ) : session.data?.user?.image ? (
          <img
            alt={`Profile image of user ${session.data?.user.name}`}
            src={session.data?.user?.image}
            className="inline-block size-10 rounded-full"
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
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-4">
        <form className="relative" onSubmit={handleSubmit} ref={ref}>
          <div className="rounded-lg bg-gray-700 outline outline-1 -outline-offset-1 outline-gray-500 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 relative">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              minLength={5}
              placeholder="Add your comment..."
              className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-200 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              defaultValue={""}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true" className="py-2">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>

            {pending && (
              <div className="absolute bg-white/30 p-4 inset-0 w-full h-full rounded-lg z-20">
                <div className="size-6 text-sky-600 m-auto mt-10">
                  <div className="animate-spin border-4 border-sky-400 border-t-sky-600 size-6 m-auto rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              {/*<div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon aria-hidden="true" className="size-5" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>*/}
              <div className="flex items-center">
                <Listbox value={selected} onChange={setSelected}>
                  <Label className="sr-only">Your mood</Label>
                  <div className="relative">
                    <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                      <span className="flex items-center justify-center">
                        {selected.value === null ? (
                          <span>
                            <FaceSmileIcon
                              aria-hidden="true"
                              className="size-5 shrink-0"
                            />
                            <span className="sr-only">Add your mood</span>
                          </span>
                        ) : (
                          <span>
                            <span
                              className={classNames(
                                selected.bgColor,
                                "flex size-8 items-center justify-center rounded-full",
                              )}
                            >
                              <selected.icon
                                aria-hidden="true"
                                className="size-5 shrink-0 text-white"
                              />
                            </span>
                            <span className="sr-only">{selected.name}</span>
                          </span>
                        )}
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-gray-600 py-3 text-base shadow outline outline-1 outline-black/5 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:ml-auto sm:w-64 sm:text-sm"
                    >
                      {moods.map((mood) => (
                        <ListboxOption
                          key={mood.value}
                          value={mood}
                          className="cursor-default select-none bg-gray-600 px-3 py-2 data-[focus]:relative data-[focus]:bg-gray-700 data-[focus]:outline-none text-gray-100"
                        >
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                mood.bgColor,
                                "flex size-8 items-center justify-center rounded-full",
                              )}
                            >
                              <mood.icon
                                aria-hidden="true"
                                className={classNames(
                                  mood.iconColor,
                                  "size-5 shrink-0",
                                )}
                              />
                            </div>
                            <span className="ml-3 block truncate font-medium">
                              {mood.name}
                            </span>
                          </div>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              <button
                type="button"
                onClick={() => setShowComment(false)}
                className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Post
              </button>
            </div>
          </div>
        </form>
        {formState.server.length > 0 && (
          <div className="px-4 py-2 bg-red-700/30 text-red-50 text-sm rounded-md outline outline-1 outline-red-700">
            <p>Error creando comentario</p>
            <ul className="list-disc pl-5">
              {formState.server.map((error, indx) => (
                <li key={indx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {formState.comment.length > 0 && (
          <div className="px-4 py-2 bg-red-700/30 text-red-50 text-sm rounded-md outline outline-1 outline-red-700">
            <p>Error creando comentario</p>
            <ul className="list-disc pl-5">
              {formState.comment.map((error, indx) => (
                <li key={indx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
