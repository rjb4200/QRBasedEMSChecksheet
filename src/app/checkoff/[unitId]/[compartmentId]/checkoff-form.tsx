"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { saveCheckData, submitCheckData } from "./actions";

type CheckoffItem = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

type Props = {
  unitId: string;
  compartmentId: string;
  items: CheckoffItem[];
  initialData: Record<string, unknown>;
  previousData: Record<string, unknown>;
  readOnly?: boolean;
};

function equipmentName(item: CheckoffItem) {
  return Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0]?.name : item.equipment_catalog?.name;
}

export function CheckoffForm({ unitId, compartmentId, items, initialData, previousData, readOnly = false }: Props) {
  const startTimeRef = useRef(Date.now());
  const [isPending, startTransition] = useTransition();
  const defaults = useMemo(() => Object.fromEntries(items.map((item) => {
    if (initialData[item.id] !== undefined) return [item.id, initialData[item.id]];
    if (item.input_type === "quantity") return [item.id, item.par_level ?? 0];
    if (item.input_type === "checkbox") return [item.id, true];
    return [item.id, { status: "OK", value: "" }];
  })), [initialData, items]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);

  useEffect(() => {
    if (readOnly) return;
    const timer = setTimeout(() => {
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      startTransition(() => void saveCheckData(unitId, compartmentId, values, seconds));
    }, 700);

    return () => clearTimeout(timer);
  }, [compartmentId, readOnly, unitId, values]);

  function setItemValue(id: string, value: unknown) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const name = equipmentName(item) ?? "Unnamed item";
        const value = values[item.id];
        const prev = previousData[item.id] ?? "-";

        return (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black">{name}</h3>
                <p className="text-sm text-slate-600">Par: {item.par_level ?? "-"} | Prev: {typeof prev === "object" ? JSON.stringify(prev) : String(prev)}</p>
              </div>
              {item.input_type === "quantity" ? (
                <div className="flex items-center gap-3">
                  <button className="h-12 w-12 rounded-2xl bg-slate-200 text-2xl font-black" disabled={readOnly} onClick={() => setItemValue(item.id, Math.max(0, Number(value ?? 0) - 1))} type="button">-</button>
                  <span className="w-12 text-center text-2xl font-black">{Number(value ?? 0)}</span>
                  <button className="h-12 w-12 rounded-2xl bg-slate-950 text-2xl font-black text-white" disabled={readOnly} onClick={() => setItemValue(item.id, Number(value ?? 0) + 1)} type="button">+</button>
                </div>
              ) : null}
            </div>

            {item.input_type === "checkbox" ? (
              <label className="mt-4 flex items-center gap-3 text-lg font-bold">
                <input checked={Boolean(value)} className="h-6 w-6" disabled={readOnly} onChange={(event) => setItemValue(item.id, event.target.checked)} type="checkbox" />
                Done
              </label>
            ) : null}

            {item.input_type === "condition" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <select className="rounded-2xl border border-slate-300 px-4 py-3" disabled={readOnly} onChange={(event) => setItemValue(item.id, { ...(typeof value === "object" && value ? value : {}), status: event.target.value })} value={typeof value === "object" && value && "status" in value ? String(value.status) : "OK"}>
                  <option>OK</option>
                  <option>Low</option>
                  <option>Missing</option>
                </select>
                <input className="rounded-2xl border border-slate-300 px-4 py-3" disabled={readOnly} onChange={(event) => setItemValue(item.id, { ...(typeof value === "object" && value ? value : {}), value: event.target.value })} placeholder="Optional value" value={typeof value === "object" && value && "value" in value ? String(value.value) : ""} />
              </div>
            ) : null}
          </div>
        );
      })}

      {!readOnly ? (
        <button className="w-full rounded-3xl bg-green-700 px-5 py-5 text-xl font-black text-white" disabled={isPending} onClick={() => {
          const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
          startTransition(() => void submitCheckData(unitId, compartmentId, values, seconds));
        }} type="button">
          Submit Compartment
        </button>
      ) : null}
    </div>
  );
}
