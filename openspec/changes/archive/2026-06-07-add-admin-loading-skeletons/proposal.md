## Why

13 of 19 admin pages have no loading skeleton—they show a blank screen or a generic 3-row placeholder that looks nothing like the actual page. The issue detail page's custom skeleton proves that page-specific placeholders dramatically improve perceived speed and reduce layout shift. This change extends that pattern to every major admin page, addressing GitHub issue #107.

## What Changes

- Add `loading.tsx` files to 11 admin routes, each with an inline Tailwind skeleton that structurally mirrors the actual page layout
- Update the existing generic `src/app/admin/loading.tsx` to better match the dashboard layout
- Each skeleton is a self-contained server component (no `"use client"`, no imports beyond React) using `animate-pulse` placeholder divs with matching card radii, spacing, and approximate sizing
- No shared skeleton components—each page gets its own inline markup for maximum precision and zero dependency overhead

## Capabilities

### Modified Capabilities

- `admin-loading-states`: Expand to require page-specific skeletons that mirror each page's structure (charts, filter bars, summary stats, card grids, form layouts) rather than just a generic placeholder. Add scenarios for the key pages: archives, fleet, equipment, units, kits, and system log.

## Impact

- **New files**: 11 `loading.tsx` files under `src/app/admin/*/`
- **Modified files**: `src/app/admin/loading.tsx` (improve dashboard skeleton), `src/app/admin/issues/[id]/loading.tsx` (already done, unchanged)
- **No changes to**: page components, data fetching, API routes, database
- **Skipped pages**: `/admin/issues` (client component with inline Spinner), `/admin/users` (client component with inline Spinner), `/admin/templates` and `/admin/templates/[id]` (redirect only), print routes (no loading state needed), `/admin/docs` (simple prose page, generic skeleton adequate)
