"use client";

import { IconPrint } from "@/components/icons";

export function PrintButton({ icon = <IconPrint />, children = "Print Check Sheets" }: { icon?: React.ReactNode; children?: React.ReactNode }) {
  return <button className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" onClick={() => window.print()} type="button">{icon}{children}</button>;
}
