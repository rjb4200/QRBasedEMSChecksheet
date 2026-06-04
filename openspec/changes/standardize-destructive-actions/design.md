## Context

The units page and users page already use a two-stage delete pattern: clicking the trash icon reveals a cancel button and a "Delete?" confirmation button. The equipment page has its own equivalent. Kits and unit builder pages still use single-click delete forms.

## Goals / Non-Goals

**Goals:**

- Create a reusable `DeleteConfirmButton` component.
- Apply two-stage confirmation to every delete button on kits list, kits builder, and unit builder.
- Add destructive toggle to the equipment catalog page.

**Non-Goals:**

- Add destructive toggles to builder/detail pages (single-item views don't need a toggle).
- Change the delete confirmation modal on the users page.

## Decisions

1. Reusable `DeleteConfirmButton` with props for action (server action) and hidden inputs.

   The component wraps a form with a server action. It manages local confirm/cancel state. Props include `formAction` (the server action), `hiddenInputs` (name/value pairs for the form), and optional `disabled`.

   Alternative: inline state on every page. Duplicates logic across pages.

2. Builder pages get two-stage confirmation but no toggle.

   Pages like `kits/[id]` and `units/[id]` are focused editing views. A destructive toggle adds cognitive load without proportional safety benefit on a single-item page. Two-stage confirmation alone is sufficient.

   Alternative: add toggles everywhere. Inconsistent — the toggle exists to gate repeated row-level delete icons on list pages.

3. Equipment page gets a destructive toggle matching units/users.

   The equipment catalog is a list page with repeated row-level delete actions. It matches the pattern where a toggle gates all delete icons, then each delete uses two-stage confirmation.
