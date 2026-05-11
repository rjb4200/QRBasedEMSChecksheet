"use client";

import { useState, useCallback } from "react";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export function useSaveFeedback() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const runSave = useCallback(async (saveFn: () => Promise<void>) => {
    if (status === "saving") return;

    setStatus("saving");
    setMessage("Saving changes...");

    try {
      await saveFn();
      setStatus("success");
      setMessage("Saved successfully.");
      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 4000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `Save failed: ${error.message}`
          : "Save failed. Please try again.",
      );
    }
  }, [status]);

  const clearMessage = useCallback(() => {
    setStatus("idle");
    setMessage(null);
  }, []);

  return {
    status,
    message,
    isSaving: status === "saving",
    runSave,
    clearMessage,
  };
}
