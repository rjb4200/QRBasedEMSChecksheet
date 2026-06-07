"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

export function QrSaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-xl bg-red-700 px-3 py-2 text-white disabled:opacity-50" type="submit" disabled={pending} title="Save">
      {pending ? (
        <Spinner />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
        </svg>
      )}
    </button>
  );
}
