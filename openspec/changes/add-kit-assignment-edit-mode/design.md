## Context

The Admin Kits page displays assigned units as a text list per kit card. Unit assignment is currently managed only from the Units page (`assignKitToUnit` / `removeKitFromUnit` actions). The Kits page fetches all units for the filter dropdown, so unit data is already available.

## Goals / Non-Goals

**Goals:**
- Add an edit-mode toggle to each kit card's assigned units section.
- Show all active units with checkboxes in edit mode.
- Stage changes as pending additions/removals.
- Show pending changes summary before applying.
- Apply with confirmation via `window.confirm()`.
- Cancel discards staged changes and returns to read-only.

**Non-Goals:**
- Do not autosave on checkbox click.
- Do not change kit contents or equipment items.
- Do not change checkoff routes, historical records, or QR/NFC behavior.
- Do not replace existing unit-side assignment management.

## Decisions

### Decision 1: Client component per kit card

Wrap the assigned units section in a client component that manages edit state, checkbox changes, and pending lists.

Rationale: Each kit card is independent — one kit in edit mode shouldn't affect another. A per-card component keeps state local and simple.

### Decision 2: Reuse existing server actions

Call `assignKitToUnit` and `removeKitFromUnit` for each add/remove respectively. Use `Promise.all` to batch them.

Rationale: These actions already handle upsert constraints and logging. No new database logic needed.

### Decision 3: `window.confirm()` for apply confirmation

Use a simple browser confirmation dialog listing the units to add and remove.

Rationale: Keeps the implementation lightweight. A custom modal could be added later if needed.

## Risks / Trade-offs

- **Risk**: Many units could make the edit list long. -> **Mitigation**: Units are scoped to in-service, non-deleted units. The fleet is small enough that this should not be a problem.
- **Risk**: Rapid checkbox toggling could cause race conditions. -> **Mitigation**: Staged changes are applied atomically via the Apply button; only one apply runs at a time per kit.

## Migration Plan

1. Create the client component for kit assignment editing.
2. Update the Kits page to use the component.
3. Run lint, typecheck, and build.
