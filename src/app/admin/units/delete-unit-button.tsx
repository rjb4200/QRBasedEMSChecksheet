"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { IconTrash } from "@/components/icons";
import { useDestroyEnabled } from "./destructive-toggle";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-xl border border-red-200 px-3 py-1 text-xs font-bold text-red-700" disabled={pending} type="submit">
      {pending ? "Deleting..." : "Delete?"}
    </button>
  );
}

export function DeleteUnitButton() {
  const destroyEnabled = useDestroyEnabled();
  const [confirming, setConfirming] = useState(false);

  if (!destroyEnabled) {
    return null;
  }

  if (!confirming) {
    return (
      <button
        aria-label="Delete unit"
        className="rounded-2xl border border-red-200 p-3 text-red-700 hover:text-red-900"
        onClick={() => setConfirming(true)}
        title="Delete unit"
        type="button"
      >
        <IconTrash />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        aria-label="Cancel delete"
        className="rounded-2xl border border-slate-300 p-3 text-slate-600"
        onClick={() => setConfirming(false)}
        title="Cancel"
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
      <SubmitButton />
    </div>
  );
}
