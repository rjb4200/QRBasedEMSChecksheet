## Why

Status badges and state indicators across the admin UI have drifted into multiple competing styles for the same concepts. "Not Started" appears as solid red fill (Fleet Matrix), light red with ring (Archives), and light red with border (Issues). Archives uses `yellow-*` for "Incomplete" while everything else uses `amber-*` — different Color Families entirely. The same "green = good" concept has four distinct visual treatments. Following the standardization of headers (#69), form panels (#70), and card orders (#71), this unifies all status badges to a single consistent system.

## What Changes

- Replace the Fleet Matrix `StatusBadge` component's solid-fill style with light-fill + border pill style
- Switch Archives check status badges from `ring-1` to `border` and `yellow` to `amber`
- Unify all status badge shapes to `rounded-full` (pill)
- Unify font weight to `font-bold` and padding to `px-2.5 py-0.5 text-xs`
- Standardize color tokens across four semantic categories: green (complete/active), red (not-started/open), amber (in-progress/incomplete), slate (neutral/informational)
- Fix daily report status on Users page to visually distinguish enabled from disabled

## Capabilities

### New Capabilities

- `admin-status-badges`: Standardize all admin status badges and state indicators to a unified pill style with light fill + border

### Modified Capabilities

None — pure visual standardization, no behavioral requirement changes.

## Impact

- **Affected files (~10)**: `src/components/fleet-matrix.tsx`, `src/app/admin/archives/page.tsx`, `src/app/admin/issues/page.tsx`, `src/app/admin/issues/[id]/page.tsx`, `src/components/recent-issues.tsx`, `src/components/recent-comments.tsx`, `src/app/admin/kits/page.tsx`, `src/app/admin/users/page.tsx`, `src/components/completion-trend-chart.tsx`, `src/app/admin/page.tsx`
- **No API, database, or dependency changes**
