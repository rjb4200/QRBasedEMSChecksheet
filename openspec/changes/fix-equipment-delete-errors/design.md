## Context

The Equipment Catalog page (`src/app/admin/equipment/`) has two delete paths inside `EditableCatalogRow`:

1. **Normal view delete**: A `<form action={deleteEquipment}>` that calls the server action. If FK constraints block the delete, the thrown error crashes the app.
2. **Edit mode delete**: A `<button type="button">` whose `onClick` calls `confirm()` then `setIsEditing(false)` — it never invokes `deleteEquipment`. The item is never deleted.

The server action `deleteEquipment` in `actions.ts` deletes from `unit_compartment_items` and `template_compartment_items` before deleting from `equipment_catalog`, but it never handles `kit_items`. When a kit still references the equipment, the catalog delete fails on a foreign key constraint and the error propagates as an unhandled exception.

The existing spec at `openspec/specs/equipment-catalog/spec.md` already requires:
- "Cannot delete item in use" with "an error prevents deletion and indicates where the item is used"

This change fixes the implementation to meet that requirement.

## Goals / Non-Goals

**Goals:**
- Add a pre-delete usage check covering `unit_compartment_items`, `kit_items`, and `template_compartment_items`.
- Return structured action state (`ok`, `message`) so the UI can display errors inline.
- Wire the edit-mode delete button to invoke the same delete server action.
- Make normal-mode and edit-mode deletes behave identically.

**Non-Goals:**
- Do not add automatic cascade deletion of references.
- Do not change the destructive-actions toggle behavior.
- Do not modify the usage badge display or other equipment catalog features.

## Decisions

1. Pre-check usage instead of cascade-deleting references.

   Rationale: Equipment items may be shared across many compartments, kits, and templates. Silently deleting references could break active checkoff forms. The spec explicitly requires blocking deletion for in-use items.

   Alternative considered: Cascade-delete all references. Rejected because it would silently remove items from active compartments and kits without the admin's awareness.

2. Use a structured return type from the server action.

   Rationale: The existing pattern of `throw new Error()` causes the Next.js error boundary to render a generic error page. A structured return like `{ ok: boolean; message?: string }` keeps the error inline and user-friendly.

   Alternative considered: Use `useActionState` with server validation. That would require restructuring the delete form to use a client action hook. Structured return via form submission keeps the change minimal.

3. Fetch friendly usage location names from the database in the pre-check query.

   Rationale: The spec requires showing where the item is used. The page already fetches usage data, but the server action should perform its own check with friendly names so it works independently.

   Alternative considered: Pass usage data from the page to the action as hidden form fields. Rejected because stale data could allow deletion of items that became in-use between page load and delete click. Server-side check is authoritative.

4. Unify edit-mode and normal-mode delete into the same form action pattern.

   Rationale: Edit-mode delete should be a real `<form action={deleteEquipment}>` with a hidden `id` input, matching the normal-mode pattern. There is no reason for edit mode to have different delete behavior.

   Alternative considered: Keep edit-mode delete as a `type="button"` with an async click handler. Rejected because it requires additional client-side error handling when the form approach already handles submission.

## Risks / Trade-offs

- The pre-check query adds one extra database round-trip before deletion. Mitigation: the query is lightweight (SELECT count with JOIN for names) and only runs on the delete path.
- Template usage names may be less descriptive than compartment/kit usage names because templates don't carry unit context. Mitigation: show template name and compartment name where available.
