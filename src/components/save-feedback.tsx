"use client";

import { useFormStatus } from "react-dom";

export function SaveButton({
  children = "Save",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`disabled:opacity-50 ${className}`}
    >
      {pending ? "Saving..." : children}
    </button>
  );
}

export function SaveStatusMessage({
  status,
  message,
}: {
  status: "idle" | "saving" | "success" | "error";
  message: string | null;
}) {
  if (!message) return null;

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    saving: "border-slate-300 bg-slate-50 text-slate-700",
    idle: "",
  };

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm font-bold ${colors[status]}`}
    >
      {message}
    </div>
  );
}
