## Why

Issue tracker tags currently use deterministic colors, but their shapes, padding, font weights, and borders are inconsistent with the standardized admin badge styling. Keeping deterministic colors while standardizing the pill shape and border will make issue tags visually consistent across the issue list, issue detail page, and fleet dashboard issue summary.

## What Changes

- Keep deterministic tag color selection based on tag text.
- Update issue tag badge styling to use the unified pill base classes: `rounded-full px-2.5 py-0.5 text-xs font-bold border`.
- Update each deterministic palette entry to include a matching border color.
- Apply the same tag badge styling anywhere issue tags are displayed in the admin issue tracker and recent issues surfaces.
- Do not change tag storage, normalization, filtering, sorting, or API behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `issue-tags`: Issue tags continue using deterministic colors, but displayed tag badges must use standardized pill shape, padding, font weight, and border styling.

## Impact

- Affects issue tag rendering in `src/app/admin/issues/page.tsx`, `src/app/admin/issues/[id]/page.tsx`, and `src/components/recent-issues.tsx`.
- No database, migration, API, authentication, or notification changes expected.
