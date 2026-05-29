"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteEquipment, saveEquipment } from "./actions";

function IconTrash() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" />
    </svg>
  );
}

function IconSave() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  );
}

function IconCancel() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SaveSubmit() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-xl bg-red-700 px-3 py-2 text-white disabled:opacity-50" type="submit" disabled={pending} title="Save" aria-label="Save equipment item">
      {pending ? <Spinner /> : <IconSave />}
    </button>
  );
}

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  input_type: string;
  default_par_level: number | null;
  usageBadges?: { unitName: string; targetName: string }[];
};

export function EditableCatalogRow({ item }: { item: CatalogItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editInputType, setEditInputType] = useState(item.input_type);
  const [editParLevel, setEditParLevel] = useState(item.default_par_level ?? "");
  const [showDelete, setShowDelete] = useState(false);

  const isQuantityType = editInputType === "quantity";
  const badges = item.usageBadges ?? [];
  const badgeCount = badges.length;
  const badgeLabel = badgeCount === 0 ? "Unused" : badgeCount === 1 ? "1 use" : `${badgeCount} uses`;
  const badgeStyle = badgeCount === 0
    ? "bg-amber-100 text-amber-800"
    : "bg-green-100 text-green-800";
  const tooltipText = badges.length > 0
    ? badges.map((b) => `${b.unitName} / ${b.targetName}`).join("\n")
    : "";

  function handleEdit() {
    setEditName(item.name);
    setEditCategory(item.category);
    setEditInputType(item.input_type);
    setEditParLevel(item.default_par_level ?? "");
    setIsEditing(true);
    setShowDelete(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setShowDelete(false);
  }

  if (!isEditing) {
    return (
      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_160px_140px_120px_auto_auto]">
        <span className="flex items-center px-4 py-3 font-semibold">{item.name}</span>
        <span className="flex items-center px-4 py-3">{item.category}</span>
        <span className="flex items-center px-4 py-3">{item.input_type}</span>
        <span className="flex items-center px-4 py-3">{item.input_type === "quantity" ? (item.default_par_level ?? "—") : "—"}</span>
        <div className="flex items-center gap-1">
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold cursor-help ${badgeStyle}`}
            title={tooltipText}
          >{badgeLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-600 hover:bg-slate-100"
            title="Edit"
            aria-label="Edit equipment item"
            type="button"
            onClick={handleEdit}
          >
            <IconEdit />
          </button>
          {showDelete ? (
            <form action={deleteEquipment} className="flex items-center gap-1">
              <input name="id" type="hidden" value={item.id} />
              <button className="rounded-xl border border-red-200 px-3 py-2 font-bold text-red-700 text-xs" title="Confirm delete" aria-label="Confirm delete equipment item" type="submit">Delete?</button>
              <button className="rounded-xl border border-slate-300 px-2 py-2 text-slate-600" title="Cancel delete" aria-label="Cancel delete" type="button" onClick={() => setShowDelete(false)}><IconCancel /></button>
            </form>
          ) : (
            <button
              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-700 hover:bg-red-50"
              title="Delete"
              aria-label="Delete equipment item"
              type="button"
              onClick={() => setShowDelete(true)}
            >
              <IconTrash />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form action={saveEquipment} className="grid gap-3 rounded-3xl border-2 border-red-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_160px_140px_120px_auto_auto]">
      <input name="id" type="hidden" value={item.id} />
      <input
        className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold"
        name="name"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />
      <input
        className="rounded-2xl border border-slate-300 px-4 py-3"
        name="category"
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
      />
      <select
        className="rounded-2xl border border-slate-300 px-4 py-3"
        name="inputType"
        value={editInputType}
        onChange={(e) => setEditInputType(e.target.value)}
      >
        <option value="quantity">quantity</option>
        <option value="checkbox">checkbox</option>
        <option value="condition">condition</option>
      </select>
      <input
        className={`rounded-2xl border border-slate-300 px-4 py-3 ${isQuantityType ? "" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}
        name="defaultParLevel"
        disabled={!isQuantityType}
        value={editParLevel}
        onChange={(e) => setEditParLevel(e.target.value)}
        min="0"
        step="1"
        type="number"
        placeholder={isQuantityType ? "Par" : "—"}
      />
      <div className="flex items-center gap-1">
        <span
          className={`rounded-full px-2 py-1 text-xs font-bold cursor-help ${badgeStyle}`}
          title={tooltipText}
        >{badgeLabel}</span>
      </div>
      <div className="flex items-center gap-1">
        <SaveSubmit />
        <button
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-600 hover:bg-slate-100"
          title="Cancel"
          aria-label="Cancel editing"
          type="button"
          onClick={handleCancel}
        >
          <IconCancel />
        </button>
        <button
          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-700 hover:bg-red-50"
          title="Delete"
          aria-label="Delete equipment item"
          type="button"
          onClick={() => { if (confirm("Delete this equipment item?")) { setIsEditing(false); } }}
        >
          <IconTrash />
        </button>
      </div>
    </form>
  );
}
