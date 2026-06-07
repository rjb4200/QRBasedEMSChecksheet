"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

export function SubmitButton({ className, children, title }: { className?: string; children: React.ReactNode; title?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending} title={title}>
      {pending ? <Spinner /> : children}
    </button>
  );
}
