## Context

The `/admin/units` page is a server component rendering a list of unit rows. Each row contains a delete form. The page currently has the Create form at the top. Adding a toggle and two-step delete requires client-side state.

## Goals / Non-Goals

**Goals:**

- Gate all delete icons behind a destructive actions toggle at the top of the page.
- Require a two-step confirmation (reveal "Delete?" + cancel) before submitting the delete form.
- Move the Create form to the bottom of the page.
- Reset toggle and confirm states on page reload.

**Non-Goals:**

- Change the server-side delete behavior.
- Gate Edit, QR, or OOS toggle actions.
- Add confirmation to compartment or kit deletes.

## Decisions

1. Use a client component for the toggle and delete confirm state.

   The toggle lives in a client wrapper placed at the top of the page. The delete icon and its confirmation state live in a client `DeleteUnitButton` component. Both use local `useState`, resetting on unmount/remount.

   Alternative: use URL search params for the toggle. Unnecessary complexity; a local state toggle on a page that reloads naturally on navigation is sufficient.

2. The delete confirmation matches the equipment catalog pattern.

   Clicking the trash icon does not submit the form — it reveals a red "Delete?" button and a cancel button inline. "Cancel" hides the confirm state. "Delete?" submits the form.

   Alternative: use `window.confirm()`. Ugly and inconsistent with the rest of the UI.

3. The Create form moves below the unit list.

   Destructive controls at the top, unit list in the middle, creation at the bottom. This places the safety gate where it is seen first.

   Alternative: keep Create at top, add toggle below it. Less natural reading order for the safety gate.

## Risks / Trade-offs

- Client component wrappers add a small JS payload → `DeleteUnitButton` and the toggle wrapper are tiny, no external dependencies.
- Toggle off means no delete icon at all → admins who need to delete must explicitly unlock first, which is the intended safety benefit.
