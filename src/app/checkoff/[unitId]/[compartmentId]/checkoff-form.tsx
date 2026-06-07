"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { saveCheckData, submitCheckData } from "./actions";
import { groupItems, type ItemGroup } from "@/lib/item-groups";
import { buildRestockingList } from "@/lib/restocking-list";
import { writeCachedFormSetup } from "@/lib/checkoff-cache";
import { prefetchUnitSummary } from "@/components/unit-summary-prefetch";

type CheckoffItem = {
  id: string;
  group_id?: string | null;
  sort_order?: number | null;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

type Props = {
  unitId: string;
  compartmentId: string;
  targetType?: "compartment" | "kit";
  items: CheckoffItem[];
  groups?: ItemGroup[];
  initialData: Record<string, unknown>;
  previousData: Record<string, unknown>;
  carriedForwardData?: Record<string, unknown>;
  initialSectionComment?: string;
  readOnly?: boolean;
  shiftDate: string;
  shiftPeriod: string;
  sourceName: string;
};

function equipmentName(item: CheckoffItem) {
  return Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0]?.name : item.equipment_catalog?.name;
}

function isMissingValue(value: unknown) {
  return value === undefined || value === null || value === "";
}

function conditionStatus(value: unknown) {
  return typeof value === "object" && value !== null && "status" in value ? String(value.status) : null;
}

function carriedForwardIsMissing(item: CheckoffItem, value: unknown, isCarriedForward: boolean) {
  if (!isCarriedForward) return false;
  if (item.input_type === "checkbox") return value === false || isMissingValue(value);
  if (item.input_type === "condition") return isMissingValue(value) || conditionStatus(value) === null;
  return isMissingValue(value);
}

function carriedForwardNeedsAttention(item: CheckoffItem, value: unknown, isCarriedForward: boolean) {
  if (!isCarriedForward) return false;
  if (item.input_type === "checkbox") return value === false || isMissingValue(value);
  if (item.input_type === "condition") return isMissingValue(value) || conditionStatus(value) !== "OK";
  if (isMissingValue(value)) return true;
  return item.input_type === "quantity" && item.par_level !== null && typeof value === "number" && value < item.par_level;
}

type LiveFeedback = {
  type: "normal" | "missing" | "understocked" | "overstocked" | "attention";
  severity: "red" | "amber" | "text" | "none";
  label: string | null;
};

function getLiveFeedback(item: CheckoffItem, value: unknown): LiveFeedback {
  if (item.input_type === "checkbox") {
    if (value === false) return { type: "missing", severity: "red", label: "Missing" };
    return { type: "normal", severity: "none", label: null };
  }

  if (item.input_type === "condition") {
    const status = typeof value === "object" && value !== null && "status" in value ? String(value.status) : null;
    if (status && status !== "OK") return { type: "attention", severity: "amber", label: "Needs Check" };
    return { type: "normal", severity: "none", label: null };
  }

  if (item.input_type === "quantity" && item.par_level !== null) {
    const val = Number(value ?? 0);
    const par = item.par_level;

    if (val < par) return { type: "understocked", severity: "red", label: `Understocked: ${val - par}` };
    if (val === par + 1) return { type: "overstocked", severity: "text", label: "Overstocked: +1" };
    if (val > par) return { type: "overstocked", severity: "amber", label: `Overstocked: +${val - par}` };
  }

  return { type: "normal", severity: "none", label: null };
}

function WarningLabel({ children }: { children: string }) {
  return <span className="inline-flex items-center rounded-full border border-red-600 bg-red-50 px-2 py-0.5 text-xs font-black text-red-700">{children}</span>;
}

function ParLabel({ parLevel, needsAttention }: { parLevel: number | null; needsAttention: boolean }) {
  if (parLevel === null) return null;

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-black ${needsAttention ? "border-red-600 bg-red-50 text-red-700" : "border-slate-300 bg-slate-50 text-slate-600"}`}>
      Par {parLevel}
    </span>
  );
}

export function CheckoffForm({ unitId, compartmentId, targetType = "compartment", items, groups = [], initialData, previousData, carriedForwardData = {}, initialSectionComment = "", readOnly = false, shiftDate, shiftPeriod, sourceName }: Props) {
  const startTimeRef = useRef(Date.now());
  const [isPending, startTransition] = useTransition();
  const defaults = useMemo(() => Object.fromEntries(items.map((item) => {
    if (initialData[item.id] !== undefined) return [item.id, initialData[item.id]];
    if (item.input_type === "quantity") return [item.id, item.par_level ?? 0];
    if (item.input_type === "checkbox") return [item.id, true];
    return [item.id, { status: "OK", value: "" }];
  })), [initialData, items]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [sectionComment, setSectionComment] = useState(initialSectionComment);
  const [touchedItemIds, setTouchedItemIds] = useState<Set<string>>(() => new Set());
  const restockingList = useMemo(() => buildRestockingList([{ id: compartmentId, name: sourceName, items, itemData: values }]), [compartmentId, items, sourceName, values]);

  useEffect(() => {
    if (readOnly) return;
    const timer = setTimeout(() => {
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      startTransition(() => void saveCheckData(unitId, compartmentId, values, seconds, targetType));
    }, 700);

    return () => clearTimeout(timer);
  }, [compartmentId, readOnly, targetType, unitId, values]);

  // Cache form setup data for future opens
  useEffect(() => {
    writeCachedFormSetup(unitId, targetType, compartmentId, {
      targetType,
      sourceName,
      items: items.map((item) => ({
        id: item.id,
        name: equipmentName(item) ?? "Unknown item",
        parLevel: item.par_level,
        inputType: item.input_type,
        sortOrder: item.sort_order ?? 0,
        groupId: item.group_id ?? null,
      })),
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        sortOrder: group.sort_order ?? 0,
      })),
    });
  }, [unitId, targetType, compartmentId, items, groups, sourceName]);

  function setItemValue(id: string, value: unknown) {
    setValues((current) => ({ ...current, [id]: value }));
    setTouchedItemIds((current) => new Set(current).add(id));
  }

  const sections = useMemo(() => groupItems(items, groups, { hideEmptyGroups: true }), [groups, items]);

  function renderItem(item: CheckoffItem) {
        const name = equipmentName(item) ?? "Unnamed item";
        const value = values[item.id];
        const prev = previousData[item.id] ?? "-";
        const itemMeta = `Prev: ${typeof prev === "object" ? JSON.stringify(prev) : String(prev)}`;
        const feedback = getLiveFeedback(item, value);

        const cardBorder = feedback.severity === "red"
          ? "border-red-300 bg-red-50 ring-1 ring-red-100"
          : feedback.severity === "amber"
          ? "border-amber-300 bg-amber-50 ring-1 ring-amber-100"
          : "border-slate-200 bg-white";

        const headingColor = feedback.severity === "red" ? "text-red-700" : "";
        const showParLabel = item.input_type === "quantity" && item.par_level !== null && feedback.severity !== "none";

        return (
          <div key={item.id} className={`rounded-3xl border p-4 shadow-sm ${cardBorder}`}>
            <div className={item.input_type === "quantity" ? "grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start" : "flex items-start justify-between gap-4"}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`break-words text-lg font-black leading-snug ${headingColor}`}>{name}</h3>
                  {showParLabel ? <ParLabel needsAttention={feedback.severity === "red"} parLevel={item.par_level} /> : null}
                  {feedback.severity === "text" && feedback.label ? (
                    <span className="text-xs font-bold text-amber-700">{feedback.label}</span>
                  ) : null}
                  {feedback.severity === "red" && feedback.label ? (
                    <WarningLabel>{feedback.label}</WarningLabel>
                  ) : null}
                  {feedback.severity === "amber" && feedback.label ? (
                    <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700">{feedback.label}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{itemMeta}</p>
              </div>
              {item.input_type === "quantity" ? (
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
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
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => section.group ? (
        <details key={section.group.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-3" open>
          <summary className="cursor-pointer px-2 py-2 text-lg font-black">{section.group.name}</summary>
          <div className="mt-2 space-y-4">{section.items.map(renderItem)}</div>
        </details>
      ) : (
        <div key="ungrouped" className="space-y-4">{section.items.map(renderItem)}</div>
      ))}

      {restockingList.length > 0 ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-950 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Restocking List</p>
          <p className="mt-1 text-sm font-semibold">Current deficiencies for {sourceName}.</p>
          <ul className="mt-3 space-y-1 text-sm font-bold">
            {restockingList[0].entries.map((entry) => <li key={entry.itemId}>{entry.itemName} - {entry.detail}</li>)}
          </ul>
        </div>
      ) : null}

      {!readOnly ? (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="text-sm font-bold uppercase tracking-[0.2em] text-red-700" htmlFor="section-comment">Section Comment</label>
          <p className="mt-2 text-sm text-slate-600">Optional notes for this {targetType === "kit" ? "kit" : "compartment"}. These show on the unit page separately from unit comments.</p>
          <textarea
            className="mt-4 min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none ring-red-500 focus:ring-4"
            id="section-comment"
            maxLength={2000}
            onChange={(event) => setSectionComment(event.target.value)}
            placeholder="Add a section-specific note..."
            value={sectionComment}
          />
          <p className="mt-2 text-xs font-semibold text-slate-500">Maximum 2,000 characters. Clear this field and submit to remove the saved section comment.</p>
        </div>
      ) : null}

      {!readOnly ? (
        <button className="w-full rounded-3xl bg-green-700 px-5 py-5 text-xl font-black text-white disabled:opacity-60" disabled={isPending} onClick={() => {
          const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
          startTransition(() => {
            void prefetchUnitSummary(unitId, shiftDate, shiftPeriod);
            void submitCheckData(unitId, compartmentId, values, seconds, targetType, sectionComment, sourceName);
          });
        }} type="button">
          {isPending ? "Saving..." : `Submit ${targetType === "kit" ? "Kit" : "Compartment"}`}
        </button>
      ) : null}
    </div>
  );
}
