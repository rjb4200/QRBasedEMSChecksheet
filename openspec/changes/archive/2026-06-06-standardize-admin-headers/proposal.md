## Why

Admin pages have drifted apart over time. Section labels use two competing style patterns (different font sizes, weights, and letter-spacing). H1 headings inconsistently apply `mt-2` margin. Four key pages lack intro subtitles entirely, leaving new admins without context on what each page does. Standardizing around the Fleet dashboard—the most-used and most-polished admin page—gives every page a uniform, professional feel.

## What Changes

- Add descriptive intro subtitles to Dashboard, Unit Management, Admin Users, and Issues pages
- Replace all Pattern B section labels (`text-xs font-black tracking-[0.2em]`) with the Fleet-standard Pattern A (`text-sm font-bold tracking-[0.25em]`)
- Fix stray `mt-2` on H1 elements on Archives and Analytics pages
- Fix hybrid label weight on Users and Issues pages (`font-black` → `font-bold`)

## Capabilities

### New Capabilities

- `admin-page-headers`: Standardize admin page headers, section labels, and intro subtitles to match the Fleet dashboard's visual conventions

### Modified Capabilities

None — this is a pure cosmetic and structural standardization with no behavioral requirement changes.

## Impact

- **Affected files (10 pages)**: `src/app/admin/page.tsx`, `src/app/admin/system-log/page.tsx`, `src/app/admin/equipment/page.tsx`, `src/app/admin/units/page.tsx`, `src/app/admin/kits/page.tsx`, `src/app/admin/archives/page.tsx`, `src/app/admin/analytics/page.tsx`, `src/app/admin/users/page.tsx`, `src/app/admin/issues/page.tsx`, `src/app/admin/issues/[id]/page.tsx`
- **Unaffected**: Detail/builder pages (Units/[id], Kits/[id], QR) and print pages are already aligned
- **No API, database, or dependency changes**
