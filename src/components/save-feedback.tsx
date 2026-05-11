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
    success: "border-green-300 bg-green-50 text-green-700",
    error: "border-red-300 bg-red-50 text-red-700",
    saving: "border-slate-300 bg-slate-50 text-slate-700",
    idle: "",
  };

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`mt-2 rounded-md border px-3 py-2 text-sm ${colors[status]}`}
    >
      {message}
    </div>
  );
}
