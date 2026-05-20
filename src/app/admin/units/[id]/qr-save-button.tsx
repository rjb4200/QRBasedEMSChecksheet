"use client";

import { useFormStatus } from "react-dom";

export function QrSaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-xl bg-red-700 px-3 py-2 text-white disabled:opacity-50" type="submit" disabled={pending} title="Save">
      {pending ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
    </button>
  );
}
