## Context

The equipment catalog page defines inline SVG icon components (`IconEdit`, `IconTrash`, `IconCancel`, `IconSave`, `Spinner`) in `editable-catalog-row.tsx`, a client component. The admin units list page (`page.tsx`) is a server component and currently uses text buttons for Edit and Delete. To share icons, they need to be extracted into a reusable file that both pages can import.

## Goals / Non-Goals

**Goals:**

- Extract `IconEdit` and `IconTrash` SVGs into a shared component file.
- Use those icons on the admin units list page for Edit and Delete actions.
- Move the OOS toggle button to the leftmost position in the button row.

**Non-Goals:**

- Change QR Codes button to an icon.
- Change OOS toggle button to an icon.
- Modify any other admin pages.
- Change icon styling or sizing beyond what the equipment page already uses.

## Decisions

1. Extract icons into `src/components/icons.tsx`.

   A standalone file that exports named icon components. Both the equipment page and the units page import from this single location. This avoids duplicating SVGs.

   Alternative: define icons in a barrel file. Adds a layer without benefit; a single file is sufficient for the current icon count.

2. Use icon-only buttons with `aria-label` and `title` for accessibility.

   Replacing text with icons removes visible labels, so each button needs an accessible label attribute.

   Alternative: keep text alongside icons. Adds visual bulk that defeats the compact-icon purpose.

3. Move OOS toggle leftmost.

   The OOS button has variable width ("Set OOS" vs "Set In-Service"). Placing it leftmost means the three fixed-width buttons (Edit icon, QR Codes text, Delete icon) stay aligned regardless of the toggle state.

   Alternative: style the OOS button with a fixed width. That constrains the button's minimum size, which could clip longer text on narrow screens.

## Risks / Trade-offs

- Icon-only buttons are less discoverable for first-time users -> use tooltips and accessible labels.
- Equipment page imports `IconEdit`/`IconTrash` as local components -> update imports to reference the shared file.
