"use client";

export function PrintButton() {
  return <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" onClick={() => window.print()} type="button">Print Check Sheets</button>;
}
