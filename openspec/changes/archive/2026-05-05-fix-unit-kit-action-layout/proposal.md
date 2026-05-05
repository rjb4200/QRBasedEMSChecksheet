## Why

The admin unit detail page has a broken kit/compartment action area where the "Assign Kit" form and "Create compartment from kit" form collide and overflow at common desktop widths. This makes the controls hard to read and risks admins selecting or submitting the wrong action.

## What Changes

- Rework the layout for the two kit action forms on the admin unit detail page so controls do not overlap or spill into adjacent forms.
- Preserve both workflows: assigning an existing shared kit to a unit and cloning a kit into a new unit compartment.
- Improve responsive behavior so the controls stack cleanly on smaller screens and align predictably on larger screens.
- Preserve existing form actions, field names, button labels, and server-side behavior.

## Capabilities

### New Capabilities

- `admin-unit-action-layout`: Layout and responsive behavior for unit detail admin action forms.

### Modified Capabilities

## Impact

- Affected UI: `src/app/admin/units/[id]/page.tsx` around the assign-kit and clone-kit-to-compartment forms.
- No database, API, Supabase, QR, checkoff, or data model changes.
- Validation should include desktop and mobile layout checks plus lint/typecheck.
