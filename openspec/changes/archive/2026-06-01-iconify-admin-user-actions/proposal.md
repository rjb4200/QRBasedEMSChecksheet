## Why

The admin users page uses text-based Edit and Delete buttons with no destructive action gating. Replacing them with icons matching other admin pages and adding a destructive delete toggle creates visual consistency and adds a safety layer before user deletion.

## What Changes

- Replace "Edit" and "Delete" text buttons with `IconEdit` and `IconTrash` components.
- Add a destructive actions toggle at the top of the users section that hides delete icons until enabled.
- Keep the existing edit form expansion and delete confirmation modal.

## Capabilities

### Modified Capabilities

- `admin-users-api-hardening`: Admin users page uses icon actions with a destructive delete toggle.

## Impact

- Affects `src/app/admin/users/page.tsx`.
