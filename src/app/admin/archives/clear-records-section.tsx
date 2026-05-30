"use client";

import { useCallback, useEffect, useState } from "react";
import SlideToConfirm from "@/components/slide-to-confirm";
import type { RotationDateAvailability } from "@/lib/data-rotation";

type RotationCounts = Record<string, number>;

const TABLE_LABELS: Record<string, string> = {
  compartment_checks: "Compartment Checks",
  shift_archives: "Shift Archives",
  daily_unit_ledgers: "Daily Unit Ledgers",
  daily_unit_crews: "Daily Unit Crews",
  daily_unit_comments: "Daily Unit Comments",
  daily_section_comments: "Daily Section Comments",
  daily_restock_items: "Daily Restock Items",
  daily_email_report_runs: "Email Report Runs",
};

type ClearState = "idle" | "previewing" | "ready" | "exporting" | "confirming" | "clearing" | "done" | "error";

export default function ClearRecordsSection({ availability, defaultFrom, defaultTo, unitId }: { availability: RotationDateAvailability | null; defaultFrom: string; defaultTo: string; unitId: string }) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [state, setState] = useState<ClearState>("idle");
  const [counts, setCounts] = useState<RotationCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ totalCleared: number; exportFilename: string } | null>(null);

  const totalRecords = counts ? Object.values(counts).reduce((sum, c) => sum + (typeof c === "number" ? c : 0), 0) : 0;

  useEffect(() => {
    setFrom(defaultFrom);
    setTo(defaultTo);
    setState("idle");
    setCounts(null);
    setError(null);
    setResult(null);
  }, [defaultFrom, defaultTo, unitId]);

  const handlePreview = useCallback(async () => {
    setState("previewing");
    setError(null);
    setCounts(null);
    try {
      const params = new URLSearchParams();
      params.set("from", from);
      params.set("to", to);
      if (unitId) params.set("unitId", unitId);

      const res = await fetch(`/admin/archives/clear-records?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Failed to preview" }));
        throw new Error(body.error || "Failed to preview");
      }
      const data = await res.json();
      setCounts(data.counts);
      setState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to preview");
      setState("error");
    }
  }, [from, to, unitId]);

  const handleExportAndClear = useCallback(async () => {
    setState("exporting");
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("from", from);
      params.set("to", to);
      if (unitId) params.set("unitId", unitId);

      const res = await fetch(`/admin/archives/export-package?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Export failed. Records were not deleted.");
      }

      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error("Export package is empty. Records were not deleted.");
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `checkoff-export-${from}-to-${to}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setState("confirming");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
      setState("error");
    }
  }, [from, to, unitId]);

  const handleConfirmClear = useCallback(async () => {
    setState("clearing");
    setError(null);
    try {
      const res = await fetch("/admin/archives/clear-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, unitId: unitId || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "DELETE operation failed" }));
        throw new Error(body.error || "DELETE operation failed");
      }
      const data = await res.json();
      setResult({ totalCleared: data.totalCleared, exportFilename: data.exportFilename });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "DELETE operation failed");
      setState("error");
    }
  }, [from, to, unitId]);

  const handleReset = useCallback(() => {
    setState("idle");
    setCounts(null);
    setError(null);
    setResult(null);
  }, []);

  return (
    <div className="rounded-3xl border-2 border-red-300 bg-red-50/30 p-4 shadow-sm">
      <div className="mb-4 rounded-2xl bg-red-700 px-4 py-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-white">⚠️ DANGER ZONE — Data Destruction</p>
        <p className="mt-1 text-xs text-red-100">These actions permanently delete operational records. Exported records cannot be recovered after deletion.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-red-700">DELETE RECORDS From</label>
          <input
            className="rounded-2xl border border-red-200 px-4 py-3"
            disabled={state !== "idle" && state !== "ready" && state !== "error"}
            onChange={(e) => { setFrom(e.target.value); setState("idle"); setCounts(null); setError(null); }}
            type="date"
            value={from}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-red-700">To</label>
          <input
            className="rounded-2xl border border-red-200 px-4 py-3"
            disabled={state !== "idle" && state !== "ready" && state !== "error"}
            onChange={(e) => { setTo(e.target.value); setState("idle"); setCounts(null); setError(null); }}
            type="date"
            value={to}
          />
        </div>
        {(state === "idle" || state === "error") && (
          <button
            className="rounded-2xl bg-red-800 px-5 py-3 font-bold text-white"
            onClick={handlePreview}
            type="button"
          >
            Preview Records
          </button>
        )}
        {state === "ready" && counts && (
          <button
            className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white"
            onClick={handleExportAndClear}
            type="button"
          >
            Export and DELETE
          </button>
        )}
      </div>

      <div className="mt-3 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm">
        {availability ? (
          <>
            <p className="font-black text-red-800">Eligible records available: {availability.oldestDate} to {availability.newestDate}</p>
            <p className="mt-1 text-red-700">Default DELETE range starts at the oldest eligible records and is capped at 60 days. Exact row counts appear after Preview Records.</p>
          </>
        ) : (
          <p className="font-black text-red-800">No eligible historical records are currently available for deletion.</p>
        )}
      </div>

      {state === "previewing" && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">Loading preview counts...</div>
      )}

      {state === "exporting" && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">Generating export package. Your download will start shortly...</div>
      )}

      {counts && (state === "ready" || state === "confirming" || state === "clearing" || state === "done") && (
        <div className="mt-4 rounded-2xl border-2 border-red-300 bg-red-50 p-4">
          <p className="text-sm font-black text-red-800">
            {totalRecords > 0
              ? `${totalRecords.toLocaleString()} records across ${Object.values(counts).filter((c) => c > 0).length} tables will be PERMANENTLY DELETED for ${from} to ${to}.`
              : `No records found for ${from} to ${to}.`}
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(counts)
              .filter(([, count]) => count > 0)
              .map(([key, count]) => (
              <div key={key} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                <span className="font-semibold text-slate-700">{TABLE_LABELS[key] || key}</span>
                <span className="font-black text-red-700">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {(state === "confirming" || state === "clearing") && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-black uppercase text-red-800">Slide to permanently delete</p>
              <SlideToConfirm
                confirmedLabel={`DELETING ${totalRecords.toLocaleString()} records...`}
                disabled={state !== "confirming"}
                label={`Slide to DELETE ${totalRecords.toLocaleString()} records`}
                loading={state === "clearing"}
                onConfirm={handleConfirmClear}
              />
            </div>
          )}

          {state === "clearing" && (
            <div className="mt-4 rounded-2xl bg-white p-4 text-center text-sm font-semibold text-red-700">DELETING records...</div>
          )}

          {state === "done" && result && (
            <div className="mt-4 rounded-2xl bg-green-100 p-4">
              <p className="text-sm font-black text-green-800">Records DELETED successfully.</p>
              <p className="mt-1 text-sm text-green-700">{result.totalCleared.toLocaleString()} records deleted. Export saved as {result.exportFilename}.</p>
              <button
                className="mt-3 rounded-xl border border-green-300 px-4 py-2 text-sm font-bold text-green-800"
                onClick={handleReset}
                type="button"
              >
                DELETE another range
              </button>
            </div>
          )}
        </div>
      )}

      {state === "error" && error && (
        <div className="mt-4 rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm font-black text-yellow-800">Error</p>
          <p className="mt-1 text-sm text-yellow-700">{error}</p>
          <button
            className="mt-3 rounded-xl border border-yellow-300 px-4 py-2 text-sm font-bold text-yellow-800"
            onClick={handleReset}
            type="button"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
