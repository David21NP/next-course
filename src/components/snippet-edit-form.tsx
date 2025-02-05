"use client";

import { snippets } from "@/db/schema";
import { editorLanguages } from "@/common";
import { Editor, OnMount } from "@monaco-editor/react";
import { editor as Editortypes } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import * as actions from "@/actions";
import Link from "next/link";

interface Props {
  snippet: typeof snippets.$inferSelect;
}

export default function SnippetEdirForm({ snippet }: Props) {
  const [lang, setLang] = useState(snippet.language ?? "");
  const editorRef = useRef<Editortypes.IStandaloneCodeEditor>(null);

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const onSaveSnippet = useCallback(() => {
    actions.editSnippet(snippet.id, lang, editorRef.current?.getValue() ?? "");
  }, [snippet.id, lang]);

  return (
    <div className="flex flex-col gap-4">
      <div className="mr-auto sm:w-full sm:max-w-sm">
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
            onChange={(ev) => setLang(ev.target.value.toLowerCase())}
            defaultValue={lang}
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
      <Editor
        height="40vh"
        theme="vs-dark"
        language={lang || "javascript"}
        // defaultLanguage="javascript"
        defaultValue={snippet.code ?? ""}
        onMount={handleEditorDidMount}
      />
      <div className="flex gap-4">
        <Link
          href={`/snippets/${snippet.id}`}
          className="px-4 py-2 border border-white rounded-md"
        >
          Cancel
        </Link>
        <button
          className="px-4 py-2 border border-white rounded-md"
          onClick={onSaveSnippet}
        >
          Save
        </button>
      </div>
    </div>
  );
}
