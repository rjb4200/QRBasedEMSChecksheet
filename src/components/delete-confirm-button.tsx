"use client";

import { useState } from "react";
import { IconTrash } from "@/components/icons";

type HiddenInput = { name: string; value: string };

export function DeleteConfirmButton({ formAction, hiddenInputs, disabled }: { formAction: string | ((formData: FormData) => void); hiddenInputs: HiddenInput[]; disabled?: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        aria-label="Delete"
        className="rounded-2xl border border-red-200 p-3 text-red-700 disabled:opacity-50"
        disabled={disabled}
        onClick={() => setConfirming(true)}
        title="Delete"
        type="button"
      >
        <IconTrash />
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-1">
      {hiddenInputs.map((input) => (
        <input key={input.name} name={input.name} type="hidden" value={input.value} />
      ))}
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
      <button className="rounded-xl border border-red-200 px-3 py-1 text-xs font-bold text-red-700" type="submit">
        Delete?
      </button>
    </form>
  );
}
