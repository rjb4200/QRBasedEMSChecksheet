"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignKitToUnit, removeKitFromUnit } from "@/app/admin/units/actions";

type UnitInfo = {
  id: string;
  name: string;
};

type AssignmentInfo = {
  unitKitId: string;
  unitId: string;
  unitName: string;
};

export function KitAssignmentEditor({
  kitId,
  assignments,
  allUnits,
}: {
  kitId: string;
  assignments: AssignmentInfo[];
  allUnits: UnitInfo[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [stagedChecks, setStagedChecks] = useState<Map<string, boolean>>(new Map());
  const [saving, setSaving] = useState(false);

  const assignedIds = new Set(assignments.map((a) => a.unitId));

  function handleToggle(unitId: string) {
    const current = stagedChecks.get(unitId) ?? assignedIds.has(unitId);
    setStagedChecks(new Map(stagedChecks.set(unitId, !current)));
  }

  const pendingAdds: string[] = [];
  const pendingRemoves: string[] = [];
  for (const unit of allUnits) {
    const staged = stagedChecks.get(unit.id);
    if (staged === undefined) continue;
    if (staged && !assignedIds.has(unit.id)) pendingAdds.push(unit.name);
    if (!staged && assignedIds.has(unit.id)) pendingRemoves.push(unit.name);
  }

  function handleCancel() {
    setStagedChecks(new Map());
    setEditing(false);
  }

  async function handleApply() {
    const addList = pendingAdds.length > 0 ? `Add:\n${pendingAdds.join(", ")}` : "";
    const removeList = pendingRemoves.length > 0 ? `Remove:\n${pendingRemoves.join(", ")}` : "";
    const warn = pendingRemoves.length > 0 ? "\n\nRemoving a kit will affect future checkoff workflows for those units." : "";
    const msg = [addList, removeList].filter(Boolean).join("\n\n") + warn;

    if (!confirm(msg)) return;

    setSaving(true);
    try {
      for (const unit of allUnits) {
        const staged = stagedChecks.get(unit.id);
        if (staged === true && !assignedIds.has(unit.id)) {
          const fd = new FormData();
          fd.set("unitId", unit.id);
          fd.set("kitId", kitId);
          fd.set("sortOrder", "0");
          await assignKitToUnit(fd);
        }
        if (staged === false && assignedIds.has(unit.id)) {
          const assignment = assignments.find((a) => a.unitId === unit.id);
          if (assignment) {
            const fd = new FormData();
            fd.set("unitId", unit.id);
            fd.set("unitKitId", assignment.unitKitId);
            await removeKitFromUnit(fd);
          }
        }
      }
      setStagedChecks(new Map());
      setEditing(false);
      router.refresh();
    } catch {
      // Keep edit mode open on error
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = pendingAdds.length > 0 || pendingRemoves.length > 0;

  return (
    <div className="mt-3">
      {editing ? (
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-2">Edit Assignments</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {allUnits.map((unit) => {
              const currentlyAssigned = assignedIds.has(unit.id);
              const staged = stagedChecks.get(unit.id);
              const checked = staged !== undefined ? staged : currentlyAssigned;
              const pendingAdd = staged === true && !currentlyAssigned;
              const pendingRemove = staged === false && currentlyAssigned;
              return (
                <label key={unit.id} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold ${
                  pendingAdd ? "bg-green-50 text-green-800" :
                  pendingRemove ? "bg-red-50 text-red-800" :
                  currentlyAssigned ? "bg-white border border-slate-200" :
                  "text-slate-400"
                }`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggle(unit.id)}
                    className="h-4 w-4 accent-red-700"
                  />
                  {unit.name}
                  <span className="ml-auto text-xs">
                    {pendingAdd ? "Will add" : pendingRemove ? "Will remove" : currentlyAssigned ? "Assigned" : "Not assigned"}
                  </span>
                </label>
              );
            })}
          </div>
          {hasChanges && (
            <div className="mt-3 rounded-xl bg-white p-2 text-xs font-semibold">
              {pendingAdds.length > 0 && <p className="text-green-700">Add: {pendingAdds.join(", ")}</p>}
              {pendingRemoves.length > 0 && <p className="text-red-700">Remove: {pendingRemoves.join(", ")}</p>}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" type="button" onClick={handleApply} disabled={saving || !hasChanges}>
              {saving ? "Saving..." : "Apply Changes"}
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-slate-600">
            Assigned: {assignments.map((a) => a.unitName).join(", ") || "None"}
          </p>
          <button className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100" type="button" onClick={() => setEditing(true)}>
            Edit Assignments
          </button>
        </div>
      )}
    </div>
  );
}
