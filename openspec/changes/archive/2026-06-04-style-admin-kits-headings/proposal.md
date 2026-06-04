## Why

The admin kits page heading uses inconsistent text styling: "Shared Layouts" appears as a red label while "Kits" is the large black title. Swapping their roles and using red text for the action headings aligns the page with the heading pattern used by other admin pages.

## What Changes

- Make "Shared Layouts" the large black H1 page title.
- Remove the "Kits" heading.
- Change "Create Kit" and "Create Kit From Compartment" subheadings to red text.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Admin kits page heading styling uses the standard page title and red section label pattern.

## Impact

- Affects `src/app/admin/kits/page.tsx`.
