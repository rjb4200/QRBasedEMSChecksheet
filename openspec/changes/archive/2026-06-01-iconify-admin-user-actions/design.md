## Context

The admin users page is a client component with local state for editing, password changes, and delete confirmation modal. Edit expands an inline form; delete opens a modal. The existing delete modal already provides safety — the toggle adds a pre-gate.

## Goals / Non-Goals

**Goals:**

- Replace text buttons with pencil/trash icons from the shared icon set.
- Add a local destructive toggle that shows/hides trash icons.
- Preserve the existing edit inline form and delete modal.

**Non-Goals:**

- Extract icons into a new component (already done in `src/components/icons.tsx`).
- Change the delete confirmation modal behavior.

## Decisions

1. Use a simple local `useState` toggle instead of the React Context pattern.

   The users page has its own delete visibility logic (modal confirmation). A simple boolean `[showDelete, setShowDelete]` on the page component is sufficient — unlike units where toggle state needed to propagate to child components.

   Alternative: reuse the DestructiveActionsToggle context provider. Overkill for a single-page component with no child propagation.

2. Keep the delete modal as-is.

   The modal already provides "Are you sure?" confirmation with a last-admin-user warning. The toggle is an additional pre-gate, not a replacement.
