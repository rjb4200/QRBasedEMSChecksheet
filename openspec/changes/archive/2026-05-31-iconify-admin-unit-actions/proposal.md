## Why

The admin units list page uses text buttons for Edit and Delete, while the equipment page already uses compact pencil and trash icons for those same actions. Using matching icons reduces visual noise and creates consistency across admin pages. Additionally, the OOS status toggle button varies in width ("Set OOS" vs "Set In-Service") which misaligns the action buttons when toggled.

## What Changes

- Extract `IconEdit` and `IconTrash` from the equipment page into a shared icons component.
- Replace "Edit" and "Delete" text buttons on the admin units list page with the shared icons.
- Move the OOS toggle button to the leftmost position in the action row so its variable width does not shift the fixed-width icon buttons.
- Keep QR Codes and OOS toggle as text buttons.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `unit-configuration`: Admin units list page action buttons use consistent icon styling for Edit and Delete, matched to the equipment page.

## Impact

- Affects the equipment catalog row component (icon extraction) and the admin units list page.
- The equipment page's `IconEdit` and `IconTrash` SVGs move to a shared location.
- No API or database changes.
