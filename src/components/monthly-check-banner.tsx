"use client";

function handlePrint() {
  const printWindow = window.open("/api/monthly-check-form", "_blank");
  if (!printWindow) return;
  printWindow.addEventListener("load", () => printWindow.print());
}

export function MonthlyCheckReminderBanner() {
  return (
    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="font-semibold">Monthly Check Due Today</div>
      <div className="text-sm">This unit is scheduled for its monthly check today.</div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-lg bg-amber-200 px-3 py-1 text-sm font-bold text-amber-900 hover:bg-amber-300"
        >
          Print Form
        </button>
        <a
          className="rounded-lg border border-amber-300 px-3 py-1 text-sm font-bold text-amber-900 hover:bg-amber-100"
          href="/api/monthly-check-form"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Form
        </a>
      </div>
    </div>
  );
}
