## Why

The admin users page used a side-by-side grid layout that caused layout overflow when the edit form expanded. The page styling also did not match the shared panel and heading pattern used by the Fleet Panel and Units pages.

## What Changes

- Replace the side-by-side layout with a stacked layout inside a shared white panel.
- Add "Admin Dashboard" as the page heading and "User Management" as a red label.
- Use "Existing Users" as a red label with the destructive toggle on the same row.
- Make the edit form use inline `flex-wrap` instead of a fixed `min-w` grid to prevent overflow.
- Match card styling with `rounded-3xl` and `border-slate-200`.

## Capabilities

### Modified Capabilities

- `admin-users-api-hardening`: Admin users page layout matches the Units panel pattern with proper headings and overflow-safe edit forms.

## Impact

- Affects `src/app/admin/users/page.tsx`.
